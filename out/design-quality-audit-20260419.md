# solozed-web 设计质量审计报告

> 日期：2026-04-19
> 审计依据：cc-design design-checklist + production-baseline
> 分支：feat/design-quality-audit

---

## P0 — 立即修复

### P0-1: 博客正文缺少 max-width 约束

**文件：** `src/pages/blog/[slug].astro`

初始尝试添加 max-width 约束，用户体验后反馈「还是不限制的效果好」，**撤销并清理**。

---

### P0-2: tokens.css 紫色透明边框色与品牌无关

**文件：** `src/styles/tokens.css` 第 37 行

```css
/* 当前（错误） */
--glass-border-light: rgba(139, 158, 255, 0.08);
--glass-border-light-hover: rgba(139, 158, 255, 0.30);

/* 应该（天青色 tint） */
--glass-border-light: rgba(56, 217, 217, 0.08);
--glass-border-light-hover: rgba(56, 217, 217, 0.30);
```

cc-design OKLCH 规则：tint neutrals toward brand hue，chroma 0.005–0.01。`rgba(139, 158, 255)` 是紫色调，与品牌色 #38D9D9 完全无关。

---

### P0-3: CTA Button 使用 `transition: all`

**文件：** `src/pages/index.astro` 第 160-165 行

```css
/* 当前（违反 absolute ban） */
transition:
  background 0.4s ease,
  border-color 0.4s ease,
  box-shadow 0.4s ease,
  color 0.4s ease,
  transform 0.4s ease;
```

`transition: all` 强制浏览器在每一帧触发 layout recalc。改为显式列出属性。

---

### P0-4: Inter 是 Reflex Font

**文件：** `src/layouts/Layout.astro` 第 76 行

```html
<link href="...family=Inter:wght@400;600;700;800;900..." rel="stylesheet" />
```

cc-design 明确将 Inter 列为 LLM reflex font——代表「没有做字体决策」。品牌核心是「从容、克制、优雅」。

**建议替换：**
- **Source Serif 4**（Google Fonts，优雅无衬线，支持中英混排，适合博客长文）作为正文
- 或 **Literata**（更适合「从容」气质）
- JetBrains Mono 保留（代码场景专业且正确）

---

### P0-5: 首页 Footer 使用灰色而非背景 hue 调

**文件：** `src/pages/index.astro` 第 97 行

```css
/* 当前 */
color: rgba(192, 192, 192, 0.5);

/* 应该 */
color: rgba(255, 255, 255, 0.35);
```

cc-design 规则：Never use gray text on a colored background — use a shade of the background hue at reduced lightness。

---

## P1 — 值得优化

### P1-1: 博客列表 tag filter hover 状态

**文件：** `src/pages/blog/index.astro` 第 260-264 行

```css
.tag-filter-btn:hover {
  border-color: var(--color-primary);  /* solid 天青色边框在紫色透明背景上突兀 */
  color: var(--color-text-link);
  background: var(--color-primary-alpha-08);
}
```

建议：border-color 也改为透明天青色，或去掉边框改为纯背景色变化。

---

### P1-2: 移动端按钮缺少 `touch-action: manipulation`

**文件：** `src/styles/global.css`

所有交互按钮需要：
```css
touch-action: manipulation;
```
这会消除双击缩放延迟，是 cc-design Production Baseline 的明确要求。

---

## P2 — 设计决策（可接受，不需要强制改）

### P2-1: Glassmorphism + Solid Border 共存

博客列表卡片和文章页 article 容器同时使用 `backdrop-filter: blur(32px)` 和 `border: 1px solid`。

cc-design 说：solid borders shatter the layered depth illusion。但实际效果因为 border-radius: 20px 的厚度存在，并不像「纯平玻璃」那样违和。属于可接受的边界情况。

### P2-2: 博客页没有暗色模式支持

`src/pages/blog/index.astro` 硬编码浅色背景。如果用户系统偏好暗色模式，博客页不会响应。

考虑到这是一个个人博客，内容以文字为主，访客大概率接受默认浅色主题，优先级低。

---

## ✅ 做得好的地方

- WebGL 动画（OGL ShapeGrid + Aurora）视觉质量高，无 AI 味
- ShinyText 用 Motion 实现，transform/opacity 分离，性能良好
- SEO 结构化数据（JSON-LD）完整：Article/Blog/BreadcrumbList
- RSS Feed、多语言 alternate、Twitter Card 完整
- tokens.css 语义化 token 命名结构清晰
- `prefers-reduced-motion` 在部分动画上有响应
- Hover guard `@media(hover:hover)` 在 CTA button 上体现
- skip-link 无障碍支持
- `font-display: swap`（Google Fonts 默认行为）

---

## 修改确认清单

| 编号 | 问题 | 状态 |
|------|------|------|
| P0-1 | 博客正文 max-width 约束 | ⚠️ 撤销（用户反馈无约束效果更好） |
| P0-2 | tokens.css 紫色边框改天青色 | ✅ 已修复 |
| P0-3 | CTA transition: all 改为显式属性 | ✅ 已修复 |
| P0-4 | Inter 字体替换 Figtree | ✅ 已修复 |
| P0-5 | 首页 footer 灰色改白色低透明 | ✅ 已修复 |
| P1-1 | tag filter hover 优化方案 | ✅ 已修复 |
| P1-2 | touch-action: manipulation 移动端加 | ✅ 已修复 |

**Build 验证：** ✅ 通过（12 pages built）

**变更文件：**
- `src/pages/blog/[slug].astro` — article-content max-width
- `src/styles/tokens.css` — 边框色统一改天青色 + 字体替换
- `src/layouts/Layout.astro` — Google Fonts URL 更新
- `src/pages/index.astro` — CTA transition 优化 + footer 颜色
- `src/pages/blog/index.astro` — tag filter hover 修复
- `src/styles/global.css` — touch-action: manipulation

---

## 待下次审计时关注

- P2-1 Glassmorphism + solid border 重构（设计决策）
- P2-2 暗色模式支持（内容型站点低优先级）
