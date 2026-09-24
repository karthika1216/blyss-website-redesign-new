import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file || !orderId) {
      return NextResponse.json({ error: 'File and orderId are required.' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payments')
    await fs.mkdir(uploadDir, { recursive: true })

    const filename = `${orderId}-${randomBytes(8).toString('hex')}-${file.name}`
    const filepath = path.join(uploadDir, filename)

    const buffer = await file.arrayBuffer()
    await fs.writeFile(filepath, Buffer.from(buffer))

    return NextResponse.json({
      filename,
      url: `/uploads/payments/${filename}`,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('[v0] Payment proof upload failed', error)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}
