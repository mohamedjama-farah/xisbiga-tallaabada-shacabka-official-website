import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Accept any video/* type plus common extensions sent as octet-stream
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.webm', '.ogg', '.avi', '.mkv', '.m4v', '.3gp'];
const MAX_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    console.log('[upload-video] file:', file?.name, file?.type, file?.size);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File too large — max 500MB (got ${Math.round(file.size / 1024 / 1024)}MB)` }, { status: 400 });
    }

    // Accept video/* mime types OR octet-stream with a video extension
    const isVideoType = file.type.startsWith('video/');
    const ext = (extname(file.name).toLowerCase() || '.mp4') as string;
    const isVideoExt = ALLOWED_EXTENSIONS.includes(ext);

    if (!isVideoType && !isVideoExt) {
      return NextResponse.json({ error: `Not a video file (got type: ${file.type}, extension: ${ext})` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeExt = isVideoExt ? ext : '.mp4';
    const filename = `${randomBytes(12).toString('hex')}${safeExt}`;
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), buffer);

    console.log('[upload-video] saved:', filename);
    return NextResponse.json({ url: `/uploads/videos/${filename}`, name: file.name }, { status: 201 });
  } catch (e) {
    console.error('[upload-video POST] ERROR:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
