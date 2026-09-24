import {NextRequest,NextResponse} from 'next/server'
import {query} from '@/lib/mysql'
const authorized=(r:NextRequest)=>Boolean(process.env.BLYSS_ADMIN_TOKEN&&r.headers.get('x-admin-token')===process.env.BLYSS_ADMIN_TOKEN)
export async function GET(request:NextRequest){if(!authorized(request))return NextResponse.json({error:'Unauthorized'},{status:401});try{return NextResponse.json(await query<any[]>(`SELECT p.*,o.order_number,o.customer_name,o.email FROM payments p JOIN orders o ON p.order_id=o.id ORDER BY p.created_at DESC`))}catch(error){console.error('[v0] admin payments failed',error);return NextResponse.json({error:'Unable to load payments.'},{status:500})}}
