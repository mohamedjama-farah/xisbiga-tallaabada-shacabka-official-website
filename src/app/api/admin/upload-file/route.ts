import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { securityHeaders } from '@/lib/security';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB for documents

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: securityHeaders });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: securityHeaders });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF, Word, or image files allowed' }, { status: 400, headers: securityHeaders });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large — max 20MB' }, { status: 400, headers: securityHeaders });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = extname(file.name).toLowerCase() || '.pdf';
    const filename = `${randomBytes(12).toString('hex')}${ext}`;
    const uploadsDir = join(process.cwd(), 'public', 'documents');

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/documents/${filename}`, name: file.name }, { status: 201, headers: securityHeaders });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500, headers: securityHeaders });
  }
}
