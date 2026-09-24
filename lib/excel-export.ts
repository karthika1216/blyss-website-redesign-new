import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as XLSX from 'xlsx'
import { query } from '@/lib/mysql'

export const EXCEL_FILE_NAME = 'Blyss_Orders.xlsx'

const headers = [
  'Order ID', 'Order Date', 'Customer Name', 'Email', 'Phone', 'Country', 'Shipping Address',
  'Front Neck', 'Back Neck', 'Sleeve', 'Size', 'Bust', 'Under Bust', 'Waist', 'Shoulder',
  'Armhole', 'Blouse Length', 'Sleeve Length', 'Sleeve Round', 'Measurement Unit', 'Fabric Type',
  'Fabric Name', 'Lining', 'Padding', 'Reference Image', 'Special Instructions', 'Total Amount',
  'Payment Status', 'Order Status',
]

const exportSql = `
  SELECT
    o.order_number AS order_id,
    o.created_at AS order_date,
    COALESCE(u.name, o.customer_name) AS customer_name,
    COALESCE(u.email, o.email) AS email,
    COALESCE(u.phone, o.phone) AS phone,
    COALESCE(cp.country, o.country) AS country,
    COALESCE(cp.shipping_address, o.shipping_address) AS shipping_address,
    COALESCE(fd.name, o.front_neck, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.frontNeck'))) AS front_neck,
    COALESCE(bd.name, o.back_neck, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.backNeck'))) AS back_neck,
    COALESCE(sd.name, o.sleeve, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.sleeves'))) AS sleeve,
    COALESCE(o.standard_size, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.standardSize'))) AS size,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.bust')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.bust')), CAST(m.bust AS CHAR)) AS bust,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.underBust')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.underBust')), CAST(m.under_bust AS CHAR)) AS under_bust,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.waist')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.waist')), CAST(m.waist AS CHAR)) AS waist,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.shoulder')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.shoulder')), CAST(m.shoulder AS CHAR)) AS shoulder,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.armhole')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.armhole')), CAST(m.armhole AS CHAR)) AS armhole,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.blouseLength')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.blouseLength')), CAST(m.blouse_length AS CHAR)) AS blouse_length,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.sleeveLength')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.sleeveLength')), CAST(m.sleeve_length AS CHAR)) AS sleeve_length,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.sleeveRound')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.sleeveRound')), CAST(m.sleeve_round AS CHAR)) AS sleeve_round,
    COALESCE(JSON_UNQUOTE(JSON_EXTRACT(o.measurements, '$.unit')), JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.measurements.unit')), m.measurement_unit) AS measurement_unit,
    COALESCE(f.fabric_type, o.fabric_type, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.fabricType'))) AS fabric_type,
    COALESCE(f.name, o.fabric_name, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.fabricName'))) AS fabric_name,
    COALESCE(o.lining, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.lining'))) AS lining,
    COALESCE(o.padding, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.padding'))) AS padding,
    COALESCE(o.reference_image_url, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.referenceImage'))) AS reference_image,
    COALESCE(o.special_instructions, JSON_UNQUOTE(JSON_EXTRACT(oi.configuration, '$.specialInstructions'))) AS special_instructions,
    o.total_amount,
    COALESCE(p.status, o.payment_status) AS payment_status,
    o.order_status
  FROM orders o
  LEFT JOIN users u ON u.id = o.user_id
  LEFT JOIN customer_profiles cp ON cp.user_id = o.user_id
  LEFT JOIN (
    SELECT i1.* FROM order_items i1
    INNER JOIN (
      SELECT order_id, MAX(id) AS id FROM order_items GROUP BY order_id
    ) latest ON latest.id = i1.id
  ) oi ON oi.order_id = o.id
  LEFT JOIN (
    SELECT m1.* FROM measurements m1
    INNER JOIN (
      SELECT user_id, MAX(id) AS id FROM measurements GROUP BY user_id
    ) latest ON latest.id = m1.id
  ) m ON m.user_id = o.user_id
  LEFT JOIN blouse_designs fd ON fd.category = 'front_neck' AND fd.name = o.front_neck
  LEFT JOIN blouse_designs bd ON bd.category = 'back_neck' AND bd.name = o.back_neck
  LEFT JOIN blouse_designs sd ON sd.category = 'sleeve' AND sd.name = o.sleeve
  LEFT JOIN fabrics f ON f.fabric_type = o.fabric_type AND f.name = o.fabric_name
  LEFT JOIN (
    SELECT p1.* FROM payments p1
    INNER JOIN (
      SELECT order_id, MAX(id) AS id FROM payments GROUP BY order_id
    ) latest ON latest.id = p1.id
  ) p ON p.order_id = o.id
  ORDER BY o.created_at ASC, o.id ASC
`

function workbookFromRows(rows: any[]) {
  const uniqueRows = [...new Map(rows.map((row) => [String(row.order_id), row])).values()]
  const data = uniqueRows.map((row) => headers.map((header) => row[header.toLowerCase().replaceAll(' ', '_')] ?? ''))
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...data])
  sheet['!cols'] = headers.map((header) => ({ wch: Math.min(Math.max(header.length + 2, 14), 30) }))
  sheet['!freeze'] = { xSplit: 0, ySplit: 1 }
  sheet['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(headers.length - 1)}${data.length + 1}` }
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Orders')
  return workbook
}

export async function createOrdersWorkbook() {
  const rows = await query<any[]>(exportSql)
  return workbookFromRows(rows)
}

export function getOrdersExcelPath() {
  return process.env.BLYSS_EXPORT_PATH || path.join(process.cwd(), EXCEL_FILE_NAME)
}

export async function getOrdersExcelUpdatedAt() {
  try {
    return (await fs.stat(getOrdersExcelPath())).mtime
  } catch {
    return null
  }
}

export async function syncOrdersToExcel() {
  const workbook = await createOrdersWorkbook()
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  const targetPath = getOrdersExcelPath()
  const temporaryPath = `${targetPath}.tmp`
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(temporaryPath, buffer)
  await fs.rm(targetPath, { force: true })
  await fs.rename(temporaryPath, targetPath)
  return buffer
}

export const exportOrdersToExcelFile = syncOrdersToExcel