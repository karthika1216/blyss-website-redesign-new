import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { syncOrdersToExcel } from '@/lib/excel-export'
import { createClient as createSupabaseClient } from '@/utils/supabase/server'

const statuses = ['Payment Received', 'Measurements Pending', 'Fabric Pending', 'Fabric Received', 'Cutting', 'Stitching', 'Quality Check', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled']
const adminAuthorized = (request: NextRequest) => Boolean(process.env.BLYSS_ADMIN_TOKEN && request.headers.get('x-admin-token') === process.env.BLYSS_ADMIN_TOKEN)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.customerName || !body.email || !body.phone || !body.shippingAddress) return NextResponse.json({ error: 'Customer and delivery details are required.' }, { status: 400 })
    const supabase = await createSupabaseClient()
    const paymentReference = String(body.paymentReference || `TEST-${crypto.randomUUID()}`)
    const orderId = `BLYSS-${Date.now()}`
    const paymentStatus = body.paymentProofUrl ? 'Proof Uploaded' : 'Pending'
    const measurements = body.measurements || {}
    const { error: insertError } = await supabase
      .from('blyss_orders')
      .insert({
        order_id: orderId,
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        country: body.country || 'India',
        shipping_address: body.shippingAddress,
        fit_type: body.fitType === 'custom' ? 'custom' : 'standard',
        standard_size: body.standardSize || null,
        bust: measurements.bust || null,
        under_bust: measurements.underBust || null,
        waist: measurements.waist || null,
        shoulder: measurements.shoulder || null,
        armhole: measurements.armhole || null,
        blouse_length: measurements.blouseLength || null,
        sleeve_length: measurements.sleeveLength || null,
        sleeve_round: measurements.sleeveRound || null,
        front_neck: body.frontNeck || 'Round Neck',
        back_neck: body.backNeck || 'U Back',
        sleeves: body.sleeves || 'Elbow Sleeve',
        lining: body.lining || 'With lining',
        padding: body.padding || 'Light padding',
        fabric_type: body.fabricType || 'Blyss Fabric',
        fabric_name: body.fabricName || null,
        reference_image: body.referenceImage || null,
        special_instructions: body.specialInstructions || body.instructions || null,
        quantity: Number(body.quantity || 1),
        stitching_price: Number(body.stitchingPrice || 4800),
        fabric_price: Number(body.fabricPrice || 0),
        shipping_fee: Number(body.shippingFee || 0),
        total_amount: Number(body.totalAmount || 4800),
        payment_status: paymentStatus,
        order_status: 'Order Received',
        payment_reference: paymentReference,
      })
      
    if (insertError) throw insertError
    if (body.cartId) {
      try { await query('DELETE FROM cart_items WHERE cart_id = ?', [body.cartId]) } catch (error) { console.error('[blyss] Cart cleanup failed after Supabase order creation', error) }
    }
    return NextResponse.json({ orderId })
  } catch (error) {
    console.error('[blyss] Supabase order creation failed', error)
    const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : error instanceof Error ? error.message : 'Unknown Supabase error'
    return NextResponse.json({ error: 'Unable to create order.', details: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!adminAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const q = request.nextUrl.searchParams.get('q')?.trim() || ''
  const status = request.nextUrl.searchParams.get('status') || ''
  const rows = await query<any[]>('SELECT * FROM orders WHERE (? = \'\' OR order_number LIKE ? OR customer_name LIKE ? OR email LIKE ?) AND (? = \'\' OR order_status = ?) ORDER BY created_at DESC', [q, `%${q}%`, `%${q}%`, `%${q}%`, status, status])
  return NextResponse.json(rows)
}

export async function PATCH(request: NextRequest) {
  if (!adminAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.orderId || !statuses.includes(body.orderStatus)) return NextResponse.json({ error: 'Invalid order update.' }, { status: 400 })
  await query('UPDATE orders SET order_status = ?, tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE order_number = ?', [body.orderStatus, body.trackingNumber || null, body.orderId])
  await query('INSERT INTO order_status_history (order_id,status) SELECT id,? FROM orders WHERE order_number = ?', [body.orderStatus, body.orderId])
  const rows = await query<any[]>('SELECT * FROM orders WHERE order_number = ?', [body.orderId])
  try { await syncOrdersToExcel() } catch (error) { console.error('[blyss] Automatic Excel export failed', error) }
  return NextResponse.json(rows[0])
}
