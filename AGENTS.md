# AGENTS.md — solozed-web

Project-specific context for AI agents. This file is read automatically at the start of every session.

## 项目概述

Solozed 个人网站，服务于 solozed.com 品牌内容展示。

- 官网：https://solozed.com
- 部署：Cloudflare Pages
- 技术栈：Astro v6 + React 19 + TypeScript + OGL (WebGL) + Motion
- Node 要求：>=22.12.0

## 开发命令

```bash
npm run dev      # 开发服务器 localhost:4321
npm run build    # 生产构建 → ./dist/
npm run preview  # 本地预览构建结果
npm run astro    # 直接运行 Astro CLI（如 npm run astro add）
```

## 目录结构

```
src/
├── layouts/Layout.astro   # 基础 HTML 布局，含 SEO meta、字体、结构化数据
├── pages/
│   ├── index.astro        # 首页 — 组合 React islands
│   └── blog/
│       ├── index.astro    # 博客列表页
│       └── [slug].astro   # 博客详情页
├── components/
│   ├── BlogNav.astro      # 博客导航（玻璃胶囊风格）
│   ├── Footer.astro       # 底部版权栏
│   ├── OrbBackground.tsx  # Canvas 呼吸光球动效（博客页）
│   └── react/             # React islands（需 client:load 水合）
│       ├── BackgroundLayer.tsx  # ShapeGrid + Aurora 容器
│       ├── ShapeGrid.tsx        # WebGL 网格（OGL）
│       ├── Aurora.tsx           # WebGL 极光着色器（OGL）
│       └── ShinyText.tsx        # 光泽文字动效（Motion）
└── styles/global.css     # 全局样式（overflow hidden、暗色主题）
```

## 关键架构决策

### Astro + React 混用

Astro 负责静态生成（SSG），React 组件通过 `client:load` 指令水合为 islands。
所有 `src/components/react/` 下的组件必须使用 `client:load`。

### WebGL 动画栈

- **OGL**：`ogl` 包，ShapeGrid 和 Aurora 的底层 WebGL 渲染
- **Motion**：`motion` 包，ShinyText 的动画
- Aurora.tsx 和 ShapeGrid.tsx 均内联 GLSL 着色器（VERT/FRAG 常量）
- BackgroundLayer 将两者以兄弟 div 组合，通过 z-index 分层

### SEO / GEO

Layout.astro 包含完整 meta 标签：Open Graph、Twitter Card、GEO 地理标签（geo.region/geo.placename/geo.position）、JSON-LD 结构化数据（WebSite + Organization）。

## 博客写作规范

### Frontmatter（必须完整）

所有博客文章 frontmatter 必须包含 `title`、`description`、`pubDate`、`tags`：

```yaml
---
title: "文章标题"
description: "简短描述，不超过 100 字"
pubDate: 2026-04-16
tags: ["Tag1", "Tag2"]
---
```

### 引号格式

- **中文正文内引用**：统一使用「」书名号
- **YAML frontmatter**：`title` 和 `description` 中的引号保持英文 `"..."` 不变
- **代码块内容**：保持原始引号不变

### 微信公众号写作风格

- 叙事优先：先说数据/感受，再说方法论，结论前置
- 节奏感：每个段落不超过 3 行
- 共鸣开头：第一人称真实场景，不用「今天我要讲的是……」套话
- 结尾留白：画面型结尾，不用追问型或反转型
- 删除冗余：「其实」「基本上」「大概」一律删掉
- 中英混排：英文词组两侧不加空格（如「Chrome 浏览器」）

## Git 工作流

**严禁直接修改 `main`。所有改动须在分支完成：**

```bash
git checkout -b feat/your-feature  # 或 fix/your-issue
# ... 改动并验证 ...
git checkout main && git merge --squash your-feature && git branch -d your-feature
```
