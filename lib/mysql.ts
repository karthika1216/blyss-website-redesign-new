import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'

const globalForMysql = globalThis as unknown as { blyssMysql?: Pool }

function createPool() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('MySQL is not configured. Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME.')
  }
  return mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    user: DB_USER,
    password: DB_PASSWORD ?? '',
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
  })
}

export function getMysqlPool() {
  if (!globalForMysql.blyssMysql) {
    globalForMysql.blyssMysql = createPool()
  }
  return globalForMysql.blyssMysql
}

export async function query<T extends RowDataPacket[] | ResultSetHeader[]>(sql: string, values: unknown[] = []) {
  const [rows] = await getMysqlPool().execute<T>(sql, values)
  return rows
}

export type MysqlRow = RowDataPacket
