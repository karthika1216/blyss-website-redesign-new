import { NextResponse } from 'next/server'
import { ensureAdminSchema, verifyPassword, createAdminSession, adminSql } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    await ensureAdminSchema()
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    const rows = await adminSql<any[]>('SELECT id,email,name,password_hash FROM admin_users WHERE email=? AND active=1 LIMIT 1', [String(email).trim().toLowerCase()])
    const admin = rows[0]
    if (!admin || !verifyPassword(String(password), admin.password_hash)) return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
    await createAdminSession(admin.id)
    return NextResponse.json({ admin: { email: admin.email, name: admin.name } })
  } catch (error) { console.error('[v0] admin login failed', error); return NextResponse.json({ error: 'Admin authentication is unavailable.' }, { status: 500 }) }
}
