---
name: solozed-blog
description: Write blog posts for Solozed personal website in Chinese. Matches the established essay voice: thoughtful, long-form, reflective with concrete examples and a larger-picture ending.
origin: solozed-web
---

# Solozed Blog Writer

Write Chinese-language blog posts matching Solozed's essay voice and format.

## Frontmatter Template

```yaml
---
title: "文章标题"
description: "一段话概括文章核心观点，吸引读者继续阅读"
pubDate: YYYY-MM-DD
tags: ["Tag1", "Tag2"]
---
```

## Content Schema

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});
```

## Voice Profile

Solozed essays are:
- **Chinese language**, thoughtful, long-form
- Start with a concrete observation or tension
- Use specific examples, names, numbers as proof
- Build argument threads across sections
- End with a "larger picture" reflection that elevates beyond the topic
- Closing line: philosophical or reflective, often referencing "The Age of AI, the grace to be"

## Structure Pattern

```
## Section Title (H2)

Content with concrete examples or names as anchors.

### Subsection (H3)

More detailed exploration.

---

## Next Section

Continue the argument thread.

---

## Final Section

Build toward the larger picture.

---

**Closing paragraph**

Reflective ending that connects back to a bigger theme.
```

## Writing Rules

1. Lead with concrete thing: example, name, number, contradiction
2. Explain after the example, not before
3. Use **bold** for key terms and concepts
4. Use `---` (horizontal rule) to separate major sections
5. Keep paragraphs long and thoughtful (3-5 sentences minimum)
6. End with emotional/philosophical elevation, not a summary
7. Never use: "在这个快速发展的时代", "革命性的", "游戏规则改变者"

## Quality Gates

- Frontmatter complete with all required fields
- Description is compelling and specific (not generic)
- At least 2 named examples or references
- Ending connects to larger theme
- No AI throat-clearing phrases
- Tags relevant to content

## Workflow

1. Ask for topic and key points
2. Draft outline with section jobs
3. Write full content following voice profile
4. Output complete MDX ready to save to `src/content/blog/`
