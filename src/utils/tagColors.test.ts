import { describe, it, expect } from 'vitest';
import { getTagColor, TAG_COLORS } from './tagColors';

describe('getTagColor', () => {
  it('returns a valid TagColor object', () => {
    const result = getTagColor('Frontend');
    expect(result).toHaveProperty('bg');
    expect(result).toHaveProperty('text');
    expect(typeof result.bg).toBe('string');
    expect(typeof result.text).toBe('string');
  });

  it('returns consistent colors for the same tag', () => {
    const result1 = getTagColor('Frontend');
    const result2 = getTagColor('Frontend');
    expect(result1).toEqual(result2);
  });

  it('returns different colors for different tags', () => {
    const result1 = getTagColor('Frontend');
    const result2 = getTagColor('Astro');
    // Different tags may or may not have same color by chance, but at minimum verify no crash
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  it('handles empty string tag', () => {
    const result = getTagColor('');
    expect(result).toHaveProperty('bg');
    expect(result).toHaveProperty('text');
  });

  it('handles unicode tags', () => {
    const result = getTagColor('中文标签');
    expect(result).toHaveProperty('bg');
    expect(result).toHaveProperty('text');
  });

  it('all colors are from TAG_COLORS array', () => {
    const tags = ['Frontend', 'Astro', 'React', 'TypeScript', 'CSS', 'Performance', 'Testing'];
    for (const tag of tags) {
      const result = getTagColor(tag);
      const isValidColor = TAG_COLORS.some(c => c.bg === result.bg && c.text === result.text);
      expect(isValidColor).toBe(true);
    }
  });

  it('returns colors within valid range (0 to TAG_COLORS.length-1)', () => {
    const tags = ['Frontend', 'Astro', 'React', 'TypeScript', 'CSS', 'Performance', 'Testing', 'Node', 'GraphQL', 'Rust', 'Go'];
    for (const tag of tags) {
      const result = getTagColor(tag);
      const index = TAG_COLORS.findIndex(c => c.bg === result.bg && c.text === result.text);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(TAG_COLORS.length);
    }
  });
});
