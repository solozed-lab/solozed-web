/**
 * Estimate reading time for blog posts.
 * Handles mixed Chinese/English content — Chinese chars count as full words,
 * English words count individually, markdown syntax is stripped.
 */
export function readingTime(body: string): number {
  // Strip common markdown syntax
  const text = body
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/`[^`]*`/g, '')         // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[.*?\]\(.*?\)/g, '')   // links
    .replace(/[#*_~>\-|]/g, '')      // emphasis, headings, hr, tables
    .replace(/<[^>]+>/g, '');        // HTML tags

  // Chinese characters — each is a word
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;

  // English words — split on whitespace
  const englishWords = text
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0).length;

  // Approximate: Chinese ~300 char/min, English ~200 word/min
  const minutes = chineseChars / 300 + englishWords / 200;
  return Math.max(1, Math.ceil(minutes));
}
