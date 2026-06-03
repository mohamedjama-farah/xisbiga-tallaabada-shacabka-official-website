'use client';
import { useState, useEffect } from 'react';
import { getDefaultContent } from '@/lib/contentSchema';

type ContentMap = Record<string, { en: string; so: string }>;

// Returns content for a page — DB overrides merged on top of defaults.
// Falls back to defaults instantly; DB content swaps in when loaded.
export function usePageContent(page: string): ContentMap {
  const [content, setContent] = useState<ContentMap>(() => getDefaultContent(page));

  useEffect(() => {
    fetch(`/api/content?page=${page}`)
      .then(r => r.json())
      .then((data: ContentMap) => setContent(data))
      .catch(() => {}); // keep defaults on error
  }, [page]);

  return content;
}

// Helper to get a single field in the current language
export function useField(content: ContentMap, key: string, lang: 'en' | 'so'): string {
  return content[key]?.[lang] ?? content[key]?.en ?? '';
}
