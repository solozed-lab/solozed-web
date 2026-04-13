import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'solozed Blog',
    description: '在AI时代，solozed探索技术与生活的从容之道。The Age of AI, the grace to be — 让AI成为从容生活的助力，而非焦虑的来源。',
    site: context.site,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}
