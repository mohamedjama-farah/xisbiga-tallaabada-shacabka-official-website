// Admin: GET /api/admin/content?page=home  — list all fields for a page
//        POST /api/admin/content            — upsert a single field
//        DELETE /api/admin/content          — delete one override (revert to default)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPageSchema, getDefaultContent, CONTENT_SCHEMA } from '@/lib/contentSchema';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
  
    const page = req.nextUrl.searchParams.get('page');
  
    // If no page, return list of all pages (for sidebar)
    if (!page) {
      return NextResponse.json(CONTENT_SCHEMA.map(s => ({ page: s.page, label: s.label, icon: s.icon })));
    }
  
    const schema = getPageSchema(page);
    if (!schema) return NextResponse.json({ error: 'Unknown page' }, { status: 404 });
  
    const defaults = getDefaultContent(page);
    const rows = await prisma.pageContent.findMany({ where: { page } });
  
    // Build map of overrides
    const overrides: Record<string, { en?: string; so?: string }> = {};
    for (const row of rows) {
      if (!overrides[row.section]) overrides[row.section] = {};
      overrides[row.section][row.lang as 'en' | 'so'] = row.content;
    }
  
    // Return fields with current values (override or default)
    const fields = schema.fields.map(f => ({
      key: f.key,
      label: f.label,
      multiline: f.multiline ?? false,
      en: overrides[f.key]?.en ?? f.defaultEn,
      so: overrides[f.key]?.so ?? f.defaultSo,
      defaultEn: f.defaultEn,
      defaultSo: f.defaultSo,
      isCustom: !!(overrides[f.key]?.en || overrides[f.key]?.so),
    }));
  
    return NextResponse.json({ page, label: schema.label, fields });
    } catch (e) {
    console.error('[content]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
  
    const { page, section, lang, content } = await req.json();
    if (!page || !section || !lang || content === undefined) {
      return NextResponse.json({ error: 'page, section, lang, content required' }, { status: 400 });
    }
  
    const row = await prisma.pageContent.upsert({
      where: { page_section_lang: { page, section, lang } },
      update: { content, updatedAt: new Date() },
      create: { id: `${page}_${section}_${lang}_${Date.now()}`, page, section, lang, content },
    });
  
    return NextResponse.json(row);
    } catch (e) {
    console.error('[content]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
  
    const { page, section } = await req.json();
    if (!page || !section) return NextResponse.json({ error: 'page, section required' }, { status: 400 });
  
    await prisma.pageContent.deleteMany({ where: { page, section } });
    return NextResponse.json({ ok: true });
    } catch (e) {
    console.error('[content]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
