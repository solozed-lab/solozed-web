# AGENTS.md — solozed-web

Project-specific context for AI agents. This file is read automatically at the start of every session.

## 项目概述

Solozed 个人网站，服务于 solozed.com 品牌内容展示。

- 官网：https://solozed.com
- 部署：Cloudflare Pages
- 技术栈：Astro v6 + React 19 + TypeScript + OGL (WebGL) + Motion
- Node 要求：>=22.12.0

---

## Context Hierarchy

AI 在不同场景下应加载的上下文层级。严格遵循分层，不过度加载。

```
┌─────────────────────────────────────────────────────┐
│  Level 1: Rules Files                                │ ← AGENTS.md，始终加载
├─────────────────────────────────────────────────────┤
│  Level 2: Spec / Architecture Docs                    │ ← 本文件的「关键架构决策」章节
├─────────────────────────────────────────────────────┤
│  Level 3: Relevant Source Files                      │ ← 按任务加载，不超过 2 个文件
├─────────────────────────────────────────────────────┤
│  Level 4: Error Output / Test Results                │ ← 按需加载
├─────────────────────────────────────────────────────┤
│  Level 5: Conversation History                        │ ← 跨会话靠 AGENTS.md 传承，不靠聊天记录
└─────────────────────────────────────────────────────┘
```

### Level 1 规则（AGENTS.md）
始终有效，适用于所有任务。

### Level 2 架构文档
本文件「关键架构决策」章节，跨 feature 一致。

### Level 3 源文件
每次任务只加载与当前操作直接相关的文件。典型任务加载：
- 修改 `Layout.astro` → 只加载 `Layout.astro`
- 修改 React 组件 → 只加载那个 `.tsx` + 它的测试文件（如有）
- 不加载整个 `components/` 目录

### Level 4 错误输出
Build 失败 / 测试失败时，把错误信息作为任务上下文传入，不粘贴 500 行输出。

---

## 开发命令

```bash
npm run dev      # 开发服务器 localhost:4321
npm run build    # 生产构建 → ./dist/
npm run preview  # 本地预览构建结果
npm run astro    # 直接运行 Astro CLI（如 npm run astro add）
```

---

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

---

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

---

## Context Packing 策略

### 启动新任务（Brain Dump 格式）

```
PROJECT: solozed-web
TASK: [任务描述]
CONTEXT LAYER: [1/2/3/4，说明当前在哪层]
RELEVANT FILES: [文件路径]
PATTERN TO FOLLOW: [参考现有哪个文件的写法]
KNOWN GOTCHAS: [已知的坑]
```

### 修改前（Selective Include 格式）

```
TASK: [要做什么]
RELEVANT FILES:
- src/pages/blog/index.astro（第 28-45 行：tag filter 逻辑）
- src/components/BlogNav.astro（第 1-20 行：导航结构）
CONSTRAINT: 不改 Layout.astro，不改其他页面
```

### 项目地图（Hierarchical Summary）

```
## 页面 (src/pages/)
index.astro      — 首页，BackgroundLayer 入口
blog/index.astro — 博客列表，含 tag filter 和 readingTime
blog/[slug].astro — 博客详情，含 OrbBackground

## 组件 (src/components/)
BlogNav.astro    — 玻璃胶囊风格导航，桌面/移动响应式
Footer.astro     — 版权栏
OrbBackground.tsx — Canvas 粒子动效（仅博客页）

## React Islands (src/components/react/)
BackgroundLayer — ShapeGrid + Aurora 容器
ShapeGrid       — WebGL 网格动效
Aurora          — WebGL 极光着色器
ShinyText       — Motion 光泽文字

## 共享 (src/styles/)
global.css      — overflow hidden、暗色主题、全局 token
```

---

## 用户偏好

- **沟通风格**：简洁直接，不需要解释为什么
- **决策模式**：快反馈，确认后授权执行
- **修改前确认**：架构性改动、多文件改动需要先确认方向
- **单人工作流**：不需要考虑团队协作、代码 review 流程
- **细节强迫症**：主动发现 UX 问题，会注意到不对齐、字体粗细、滚动流畅度

---

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

---

## Confusion Management

### 当上下文冲突时

```
CONFUSION:
AGENTS.md 说「每个任务只加载 1-2 个文件」
现有代码习惯把工具函数放在 src/lib/ 且被多个组件引用

OPTIONS:
A) 遵守 AGENTS.md，工具函数视为 shared context，单独列出
B) 工具函数下沉到使用它的组件附近，避免跨文件引用
C) 问 —— 这是否是已知的架构债务

→ 等待用户确认
```

### 当需求不完整时

```
MISSING REQUIREMENT:
[具体描述缺少什么]

OPTIONS:
A) 最简单可行的方案（先跑通）
B) 等用户补充需求
C) 提出 2-3 个选项，各自代价说明

→ 等待用户确认
```

### 当发现「明显可以改进」的地方时

不在本次任务范围内的改进，发现后记录，不直接改：

```
NOTICED BUT NOT TOUCHING:
- [文件] 有 [问题]，属于 [哪个类别] 问题
→ 是否需要创建独立的 task 来处理？
```

---

## Git 工作流

**严禁直接修改 `main`。所有改动须在分支完成：**

```bash
git checkout -b feat/your-feature  # 或 fix/your-issue
# ... 改动并验证 ...
git checkout main && git merge --squash your-feature && git branch -d your-feature
```

**Commit 规范**：每条 commit 必须是独立可验证的增量，不能是「和各种改动混在一起」。

---

## Anti-Patterns

| 反模式 | 问题 | 正确做法 |
|--------|------|----------|
| Context flooding | 加载整个 src/ 目录给 AI | 只加载任务直接相关的 1-2 个文件 |
| Stale context | 用上周的聊天记录指导今天的任务 | 以 AGENTS.md 和源文件为准 |
| 假设未经确认 | 「用户应该想要 X」直接实现 | 明确问出来，等确认再动手 |
| 一次性改太多 | 一次 MR 改 10 个文件 | 每个逻辑改动单独 commit |
| 跳过验证 | 改完不跑 build | 提交前 `npm run build` 必须跑通 |

---

## Red Flags

AI 应在以下情况主动汇报：
- 需要修改的文件超过 5 个（任务需要拆分）
- 发现与 AGENTS.md 规则冲突的已有代码
- 发现安全或隐私风险（secrets 暴露、用户数据处理）
- 技术方案与已有架构决策矛盾
- 需求依赖一个不存在的文件或 API

---

## 当前项目状态

- 分支：`feat/design-quality-audit`，设计质量审计完成，待合并 main
- 已完成：Layout 统一、readingTime/filter 联动、tokens.css/image 字段修复
- 本次新增：cc-design 审计修复（7项 P0/P1 问题）

---

## Solozed 本地化分支（multica 项目）

**项目路径**：`~/Projects/multica/`（forked from `multica-ai/multica` → `solozed-lab/multica`）

**分支**：`feat/localize`

**关键决策**：Go module 路径 `github.com/multica-ai/multica` **保留不变**，以便持续 `git merge upstream/main` 同步上游。只替换可见层（品牌/URL/logo），不改动 import 路径。

**已完成**：Landing i18n（en/zh）、Email 模板、Auth 页面、SEO 元数据、安装脚本（brew + binary）、cmd_setup.go 默认 server URL、Logo SVG。

**待处理**：Phase 3 — 核心页面 UI 深层汉化（issues/projects/settings 等，按需进行）。

**配置文件**：`~/Projects/multica/CONFIG.md`

---

## Success Criteria（验收标准）

重构后 AI 能：
- [ ] 回答「当前任务在哪个 Context Level」
- [ ] 每次只加载必要的 1-2 个源文件
- [ ] 用 Brain Dump 格式启动新任务
- [ ] 发现问题时用 Confusion Management 模式显式汇报
- [ ] 发现 AGENTS.md 范围外的改进时记录而不直接改
