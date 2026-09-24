import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { EXCEL_FILE_NAME, syncOrdersToExcel } from '@/lib/excel-export'

export async function GET() {
  try {
    await requireAdmin()
    const buffer = await syncOrdersToExcel()
    return new NextResponse(buffer as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${EXCEL_FILE_NAME}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[blyss] Excel export failed', error)
    return NextResponse.json({ error: 'Unable to generate the Excel export.' }, { status: 500 })
  }
}