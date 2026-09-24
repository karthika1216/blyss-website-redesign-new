import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { query } from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionToken = String(body.sessionToken || randomBytes(24).toString('hex'))
    const existing = await query<any[]>('SELECT id FROM carts WHERE session_token=? LIMIT 1', [sessionToken])
    const cartId = existing[0]?.id || (await query<any>('INSERT INTO carts (user_id,session_token) VALUES (?,?)', [body.userId || null, sessionToken])).insertId
    await query('INSERT INTO cart_items (cart_id,quantity,configuration) VALUES (?,?,?)', [cartId, Number(body.quantity || 1), JSON.stringify(body.configuration || {})])
    return NextResponse.json({ cartId, sessionToken })
  } catch (error) {
    console.error('[v0] MySQL cart persistence failed', error)
    return NextResponse.json({ error: 'Unable to save cart.' }, { status: 500 })
  }
}
