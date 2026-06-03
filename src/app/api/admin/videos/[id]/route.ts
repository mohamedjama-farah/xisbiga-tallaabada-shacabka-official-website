import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const data = await req.json();
    const video = await prisma.video.update({
      where: { id },
      data: {
        titleEn:   data.titleEn   !== undefined ? data.titleEn   : undefined,
        titleSo:   data.titleSo   !== undefined ? data.titleSo   : undefined,
        descEn:    data.descEn    !== undefined ? data.descEn    : undefined,
        descSo:    data.descSo    !== undefined ? data.descSo    : undefined,
        videoId:   data.videoId   !== undefined ? data.videoId   : undefined,
        videoUrl:  data.videoUrl  !== undefined ? data.videoUrl  : undefined,
        featured:  data.featured  !== undefined ? data.featured  : undefined,
        date:      data.date      !== undefined ? data.date      : undefined,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : undefined,
        published: data.published !== undefined ? data.published : undefined,
      },
    });
    return NextResponse.json(video);
  } catch (e) {
    console.error('[videos PATCH]', e);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[videos DELETE]', e);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
