import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { syncOrdersToExcel } from '@/lib/excel-export'

const adminAuthorized = (request: NextRequest) => Boolean(process.env.BLYSS_ADMIN_TOKEN && request.headers.get('x-admin-token') === process.env.BLYSS_ADMIN_TOKEN)

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId')
  if (!orderId) return NextResponse.json({ error: 'Order ID required.' }, { status: 400 })

  try {
    const rows = await query<any[]>(
      `SELECT p.*, o.order_number, o.customer_name, o.email, o.total_amount
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE o.order_number = ? LIMIT 1`,
      [orderId]
    )
    return NextResponse.json(rows[0] || null)
  } catch (error) {
    console.error('[v0] Payment fetch failed', error)
    return NextResponse.json({ error: 'Unable to fetch payment.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!adminAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { orderId, paymentStatus, proofUrl } = body

    if (!orderId || !paymentStatus) {
      return NextResponse.json({ error: 'Order ID and payment status required.' }, { status: 400 })
    }

    const updates = ['status = ?']
    const values: any[] = [paymentStatus]

    if (proofUrl) {
      updates.push('proof_url = ?')
      values.push(proofUrl)
    }

    if (paymentStatus === 'Payment Confirmed') {
      updates.push('paid_at = NOW()')
    }

    values.push(orderId)

    await query(
      `UPDATE payments SET ${updates.join(', ')} WHERE order_id = (SELECT id FROM orders WHERE order_number = ?)`,
      values
    )

    // Update order payment status
    await query('UPDATE orders SET payment_status = ? WHERE order_number = ?', [paymentStatus, orderId])

    // If payment confirmed, update order status
    if (paymentStatus === 'Payment Confirmed') {
      await query('UPDATE orders SET order_status = ? WHERE order_number = ?', ['Order Received', orderId])
      await query('INSERT INTO order_status_history (order_id, status, note) SELECT id, ?, ? FROM orders WHERE order_number = ?', [
        'Order Received',
        'Payment verified by admin',
        orderId,
      ])
    }

    try { await syncOrdersToExcel() } catch (error) { console.error('[blyss] Automatic Excel export failed', error) }

    const result = await query<any[]>('SELECT * FROM payments WHERE order_id = (SELECT id FROM orders WHERE order_number = ?)', [orderId])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] Payment update failed', error)
    return NextResponse.json({ error: 'Unable to update payment.' }, { status: 500 })
  }
}
