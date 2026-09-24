import { NextResponse } from 'next/server'
import { ensureAdminSchema, getAdminSession } from '@/lib/admin-auth'
export async function GET() { try { await ensureAdminSchema(); const admin = await getAdminSession(); return NextResponse.json({ admin }, { status: admin ? 200 : 401 }) } catch { return NextResponse.json({ admin: null }, { status: 401 }) } }
