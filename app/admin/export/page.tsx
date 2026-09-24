import Link from 'next/link'
import { getOrdersExcelUpdatedAt } from '@/lib/excel-export'

export const dynamic = 'force-dynamic'

export default async function Page() {
	const updatedAt = await getOrdersExcelUpdatedAt()
	return <main className="admin-content"><div className="admin-page-heading"><div><p className="eyebrow">BLYSS ADMIN</p><h1>Export Data</h1></div></div><section className="admin-panel"><h2>Order workbook</h2><p className="admin-muted">This Excel file contains the latest order data from MySQL and is refreshed automatically after order, status, and payment updates.</p><p className="admin-muted">Last export/update: {updatedAt ? updatedAt.toLocaleString('en-IN') : 'Not generated yet'}</p><Link className="button button-navy" href="/api/admin/export">Download Excel</Link></section></main>
}
