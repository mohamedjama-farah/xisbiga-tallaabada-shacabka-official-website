// Public: GET /api/content?page=home
// Returns all content overrides for a page, merged with defaults
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getDefaultContent } from '@/lib/contentSchema';

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page');
  if (!page) return NextResponse.json({ error: 'page required' }, { status: 400 });

  // Start with defaults
  const defaults = getDefaultContent(page);

  try {
    // Fetch DB overrides
    const rows = await prisma.pageContent.findMany({ where: { page } });

    // Merge overrides on top of defaults
    const result: Record<string, { en: string; so: string }> = { ...defaults };
    for (const row of rows) {
      if (!result[row.section]) result[row.section] = { en: '', so: '' };
      result[row.section] = {
        ...result[row.section],
        [row.lang]: row.content,
      };
    }

    return NextResponse.json(result);
  } catch {
    // If DB fails, return defaults
    return NextResponse.json(defaults);
  }
}
