export interface TagColor {
  bg: string;
  text: string;
}

export const TAG_COLORS: TagColor[] = [
  { bg: 'rgba(139, 92, 246, 0.07)', text: '#7C3AED' },
  { bg: 'rgba(56, 189, 248, 0.07)', text: '#0284C7' },
  { bg: 'rgba(59, 130, 246, 0.07)', text: '#2563EB' },
  { bg: 'rgba(239, 68, 68, 0.07)', text: '#DC2626' },
  { bg: 'rgba(34, 197, 94, 0.07)', text: '#16A34A' },
  { bg: 'rgba(251, 191, 36, 0.07)', text: '#D97706' },
  { bg: 'rgba(236, 72, 153, 0.07)', text: '#DB2777' },
];

export function getTagColor(tag: string): TagColor {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}
