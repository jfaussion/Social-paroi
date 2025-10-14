import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isOpener } from '@/utils/session.utils'
import crypto from 'crypto'

// POST /api/uploads/cloudinary-signature
// Returns a signed payload for client-side direct upload to Cloudinary
export async function POST(req: NextRequest) {
  const session = await auth()
  if (isOpener(session) === false) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as {
    folder?: string
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
    return NextResponse.json({ error: 'Cloudinary env not configured' }, { status: 500 })
  }

  // Restrict folder to known safe subfolders; default to Tracks
  const folder = body.folder && typeof body.folder === 'string' ? body.folder : 'Tracks'
  const timestamp = Math.floor(Date.now() / 1000)

  // Build the string to sign according to Cloudinary rules
  // We sign: folder, timestamp, upload_preset
  const toSign = `folder=SocialParoiApp/${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`
  const signature = crypto.createHash('sha1').update(toSign).digest('hex')

  return NextResponse.json({
    cloudName,
    apiKey,
    signature,
    timestamp,
    uploadPreset,
    folder: `SocialParoiApp/${folder}`,
  })
}


