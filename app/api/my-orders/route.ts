import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const email = request.nextUrl.searchParams.get('email')

  if (!userId && !email) {
    return NextResponse.json({ error: 'User ID or email required.' }, { status: 400 })
  }

  try {
    let rows

    if (userId) {
      rows = await query<any[]>(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      )
    } else {
      rows = await query<any[]>(
        'SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC',
        [email]
      )
    }

    // Fetch payment info for each order
    const ordersWithPayment = await Promise.all(
      rows.map(async (order) => {
        const payments = await query<any[]>('SELECT * FROM payments WHERE order_id = ?', [order.id])
        return {
          ...order,
          payment: payments[0],
        }
      })
    )

    return NextResponse.json(ordersWithPayment)
  } catch (error) {
    console.error('[v0] My orders fetch failed', error)
    return NextResponse.json({ error: 'Unable to fetch orders.' }, { status: 500 })
  }
}
