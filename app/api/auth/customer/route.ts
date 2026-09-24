import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { getMysqlPool, query } from '@/lib/mysql'

const hashPassword = (password: string, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
const verifyPassword = (password: string, stored: string) => { const [salt, hash] = stored.split(':'); if (!salt || !hash) return false; return timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(password, salt, 64)) }
const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex')

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('blyss_session')?.value
    if (token) await query('DELETE FROM auth_sessions WHERE token_hash = ?', [tokenHash(token)])
    cookieStore.delete('blyss_session')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] MySQL logout failed', error)
    return NextResponse.json({ error: 'Unable to log out.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.email || !body.password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    const email = String(body.email).trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    if (body.action === 'register') {
      if (!body.name || !body.phone || body.password.length < 8) return NextResponse.json({ error: 'Name, phone, and an 8-character password are required.' }, { status: 400 })
      if (body.password !== body.confirmPassword) return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
      const pool = getMysqlPool()
      const connection = await pool.getConnection()
      try {
        await connection.beginTransaction()
        const [exists] = await connection.execute<any[]>('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
        if (exists[0]) {
          await connection.rollback()
          return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
        }
        const [userResult] = await connection.execute<any>('INSERT INTO users (email, password_hash, name, phone) VALUES (?, ?, ?, ?)', [email, hashPassword(String(body.password)), String(body.name).trim(), String(body.phone).trim()])
        const userId = Number(userResult.insertId)
        if (!userId) throw new Error('MySQL did not return an insert id for users')
        await connection.execute('INSERT INTO customer_profiles (user_id) VALUES (?)', [userId])
        await connection.commit()
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    }
    const users = await query<any[]>('SELECT id,email,password_hash,name,phone FROM users WHERE email = ? LIMIT 1', [email])
    if (!users[0] || !verifyPassword(body.password, users[0].password_hash)) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    const token = randomBytes(32).toString('hex')
    await query('INSERT INTO auth_sessions (user_id,token_hash,expires_at) VALUES (?,?,DATE_ADD(NOW(), INTERVAL 30 DAY))', [users[0].id, tokenHash(token)])
    const cookieStore = await cookies()
    cookieStore.set('blyss_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' })
    return NextResponse.json({ user: { id: users[0].id, email: users[0].email, name: users[0].name, phone: users[0].phone } })
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    console.error('[v0] MySQL auth failed', { code: error?.code, errno: error?.errno, sqlState: error?.sqlState, sqlMessage: error?.sqlMessage, message: error?.message, stack: error?.stack })
    return NextResponse.json({ error: 'Unable to access your account. Check the MySQL connection and schema.' }, { status: 500 })
  }
}
