import { cookies } from 'next/headers'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { query } from '@/lib/mysql'

const COOKIE = 'blyss_admin_session'
const SESSION_DAYS = 7
let adminSchemaPromise: Promise<void> | undefined

const ADMIN_USERS_SQL = `CREATE TABLE IF NOT EXISTS admin_users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, name VARCHAR(160) NOT NULL DEFAULT 'Blyss Admin', active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB`
const ADMIN_SESSIONS_SQL = `CREATE TABLE IF NOT EXISTS admin_sessions (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, admin_user_id BIGINT UNSIGNED NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE, expires_at DATETIME NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE, INDEX idx_admin_sessions_expiry (expires_at)) ENGINE=InnoDB`

async function provisionAdminSchema() {
  await query(ADMIN_USERS_SQL)
  await query(ADMIN_SESSIONS_SQL)
  const email = process.env.BLYSS_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.BLYSS_ADMIN_PASSWORD
  if (!email || !password) throw new Error('Admin credentials are not configured.')
  const existing = await query<any[]>('SELECT id FROM admin_users WHERE email=? LIMIT 1', [email])
  if (!existing[0]) await query('INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)', [email, hashPassword(password), 'Blyss Admin'])
}

export async function ensureAdminSchema() {
  if (!adminSchemaPromise) {
    adminSchemaPromise = provisionAdminSchema().catch((error) => {
      adminSchemaPromise = undefined
      throw error
    })
  }
  return adminSchemaPromise
}

export function hashPassword(password: string) { const salt = randomBytes(16).toString('hex'); return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}` }
export function verifyPassword(password: string, stored: string) { const [, salt, hash] = stored.split(':'); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(hash, 'hex'); return actual.length === expected.length && timingSafeEqual(actual, expected) }
function tokenHash(token: string) { return createHash('sha256').update(token).digest('hex') }

export async function createAdminSession(adminId: number) {
  const token = randomBytes(32).toString('base64url')
  await query('INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))', [adminId, tokenHash(token)])
  const store = await cookies(); store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_DAYS * 86400 })
}

export async function getAdminSession() {
  await ensureAdminSchema()
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const rows = await query<any[]>('SELECT a.id, a.email, a.name FROM admin_sessions s JOIN admin_users a ON a.id=s.admin_user_id WHERE s.token_hash=? AND s.expires_at>NOW() AND a.active=1 LIMIT 1', [tokenHash(token)])
  return rows[0] ?? null
}
export async function requireAdmin() { const admin = await getAdminSession(); if (!admin) throw new Error('UNAUTHORIZED'); return admin }
export async function destroyAdminSession() { const store = await cookies(); const token = store.get(COOKIE)?.value; if (token) await query('DELETE FROM admin_sessions WHERE token_hash=?', [tokenHash(token)]); store.delete(COOKIE) }
export { COOKIE }
export { query as adminSql }
