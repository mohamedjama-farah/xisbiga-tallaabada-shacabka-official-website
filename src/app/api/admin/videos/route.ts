import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const videos = await prisma.video.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
    return NextResponse.json(videos);
  } catch (e) {
    console.error('[videos GET]', e);
    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    if (!data.titleEn || !data.titleSo) {
      return NextResponse.json({ error: 'Title (EN + SO) is required' }, { status: 400 });
    }
    if (!data.videoId && !data.videoUrl) {
      return NextResponse.json({ error: 'Provide either a YouTube Video ID or upload a video file' }, { status: 400 });
    }
    const video = await prisma.video.create({
      data: {
        titleEn: data.titleEn,
        titleSo: data.titleSo,
        descEn: data.descEn || null,
        descSo: data.descSo || null,
        videoId: data.videoId || '',
        videoUrl: data.videoUrl || null,
        featured: data.featured ?? false,
        date: data.date || null,
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
    });
    return NextResponse.json(video, { status: 201 });
  } catch (e) {
    console.error('[videos POST]', e);
    return NextResponse.json({ error: 'Failed to save video. Check the server logs.' }, { status: 500 });
  }
}
