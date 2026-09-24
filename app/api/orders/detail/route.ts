import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { getAdminSession } from '@/lib/admin-auth'

const adminAuthorized = (request: NextRequest) => Boolean(process.env.BLYSS_ADMIN_TOKEN && request.headers.get('x-admin-token') === process.env.BLYSS_ADMIN_TOKEN)

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId') || request.nextUrl.searchParams.get('orderNumber')
  const userId = request.nextUrl.searchParams.get('userId')
  const isAdmin = adminAuthorized(request) || Boolean(await getAdminSession())

  if (!orderId) return NextResponse.json({ error: 'Order ID required.' }, { status: 400 })
  if (!isAdmin && !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Fetch order details
    const orders = await query<any[]>('SELECT * FROM orders WHERE order_number = ? LIMIT 1', [orderId])
    if (!orders[0]) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })

    const order = orders[0]

    // Check authorization: customer can only see their own order
    if (!isAdmin && userId && order.user_id !== parseInt(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch order items
    const items = await query<any[]>('SELECT * FROM order_items WHERE order_id = ?', [order.id])

    // Fetch payment info
    const payments = await query<any[]>('SELECT * FROM payments WHERE order_id = ?', [order.id])
    const payment = payments[0]

    // Fetch status history
    const history = await query<any[]>(
      'SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC',
      [order.id]
    )

    return NextResponse.json({
      order,
      items,
      payment,
      history,
    })
  } catch (error) {
    console.error('[v0] Order detail fetch failed', error)
    return NextResponse.json({ error: 'Unable to fetch order details.' }, { status: 500 })
  }
}
