import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityHeaders } from '@/lib/security';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ results: [] }, { headers: securityHeaders });

  const term = q.toLowerCase();

  const [news, events, documents] = await Promise.all([
    prisma.newsPost.findMany({
      where: {
        published: true,
        OR: [
          { titleEn: { contains: q, mode: 'insensitive' } },
          { titleSo: { contains: q, mode: 'insensitive' } },
          { contentEn: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, titleEn: true, titleSo: true, excerpt: true, createdAt: true },
      take: 5,
    }),
    prisma.event.findMany({
      where: {
        published: true,
        OR: [
          { titleEn: { contains: q, mode: 'insensitive' } },
          { titleSo: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, titleEn: true, titleSo: true, location: true, date: true },
      take: 5,
    }),
    prisma.document.findMany({
      where: {
        published: true,
        OR: [
          { titleEn: { contains: q, mode: 'insensitive' } },
          { titleSo: { contains: q, mode: 'insensitive' } },
          { descEn: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, titleEn: true, titleSo: true, descEn: true, category: true },
      take: 5,
    }),
  ]);

  // Static page content search
  const staticPages = [
    { title: 'Policy Platform', titleSo: 'Qorshaha Siyaasadeed', href: '/policy', keywords: ['policy', 'siyaasad', 'education', 'healthcare', 'economy', 'waxbarasho', 'caafimaad'] },
    { title: 'How to Vote', titleSo: 'Sida Loo Codeyn', href: '/vote', keywords: ['vote', 'codeyn', 'election', 'doorasho', 'register', 'diiwaangeli'] },
    { title: 'Constitutional Rights', titleSo: 'Xuquuqda Dastuuriga', href: '/rights', keywords: ['rights', 'xuquuq', 'constitution', 'dastuur', 'human rights'] },
    { title: 'About XTS', titleSo: 'Xisbiga XTS', href: '/about', keywords: ['about', 'naga', 'xts', 'party', 'xisbi', 'mission', 'hadaf'] },
    { title: 'Women\'s Wing', titleSo: 'Goobta Haweenka', href: '/women', keywords: ['women', 'haween', 'gender', 'jins'] },
    { title: 'Youth Wing', titleSo: 'Goobta Dhalinyarada', href: '/youth', keywords: ['youth', 'dhalinyaro', 'young', 'da'] },
    { title: 'Volunteer', titleSo: 'Volunteer', href: '/volunteer', keywords: ['volunteer', 'canvass', 'help', 'caawi'] },
    { title: 'Contact', titleSo: 'Xiriir', href: '/contact', keywords: ['contact', 'xiriir', 'email', 'phone'] },
    { title: 'Donate', titleSo: 'Xiwaal', href: '/donate', keywords: ['donate', 'xiwaal', 'money', 'lacag', 'support'] },
    { title: 'FAQ', titleSo: "Su'aalaha Badanaa", href: '/faq', keywords: ['faq', 'question', 'su\'aal', 'help', 'caawi'] },
    { title: 'Gallery', titleSo: 'Gallariya', href: '/gallery', keywords: ['gallery', 'gallariya', 'photo', 'sawir'] },
    { title: 'Diaspora', titleSo: 'Masakinta', href: '/diaspora', keywords: ['diaspora', 'masaakinta', 'abroad', 'dibadda'] },
    { title: 'Branch Offices', titleSo: 'Xafiisyada', href: '/branches', keywords: ['office', 'xafiis', 'branch', 'laanta', 'location'] },
    { title: 'Party Constitution', titleSo: 'Dastuurka Xisbiga', href: '/party/constitution', keywords: ['constitution', 'dastuur', 'party rules', 'xeerka'] },
  ].filter(p => p.keywords.some(kw => kw.includes(term) || term.includes(kw)));

  const results = [
    ...news.map(n => ({ type: 'news', titleEn: n.titleEn, titleSo: n.titleSo, desc: n.excerpt, href: `/news/${n.id}`, date: n.createdAt })),
    ...events.map(e => ({ type: 'event', titleEn: e.titleEn, titleSo: e.titleSo, desc: e.location, href: `/events`, date: e.date })),
    ...documents.map(d => ({ type: 'document', titleEn: d.titleEn, titleSo: d.titleSo, desc: d.descEn, href: `/documents`, date: null })),
    ...staticPages.map(p => ({ type: 'page', titleEn: p.title, titleSo: p.titleSo, desc: null, href: p.href, date: null })),
  ];

  return NextResponse.json({ results, query: q }, { headers: securityHeaders });
}
