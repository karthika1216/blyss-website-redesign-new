import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { query } from '@/lib/mysql'

async function currentUser() {
  const token = (await cookies()).get('blyss_session')?.value
  if (!token) return null
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const rows = await query<any[]>('SELECT u.id,u.email,u.name,u.phone,p.country,p.shipping_address,m.bust,m.under_bust,m.waist,m.shoulder,m.armhole,m.blouse_length,m.sleeve_length,m.sleeve_round FROM auth_sessions s JOIN users u ON u.id=s.user_id LEFT JOIN customer_profiles p ON p.user_id=u.id LEFT JOIN measurements m ON m.user_id=u.id WHERE s.token_hash=? AND s.expires_at>NOW() ORDER BY m.updated_at DESC LIMIT 1', [tokenHash])
  return rows[0] || null
}

export async function GET() {
  const user = await currentUser()
  return user ? NextResponse.json(user) : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PATCH(request: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  await query('UPDATE users SET name=?, phone=? WHERE id=?', [String(body.name || user.name), String(body.phone || user.phone || ''), user.id])
  await query('UPDATE customer_profiles SET country=?, shipping_address=? WHERE user_id=?', [String(body.country || 'India'), String(body.shippingAddress || ''), user.id])
  return NextResponse.json({ ok: true })
}
