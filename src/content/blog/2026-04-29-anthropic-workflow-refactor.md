---
title: "我用 Anthropic 的方法论让 AI 重构了自己的工作流"
slug: anthropic-workflow-refactor
pubDate: 2026-04-29
description: "Anthropic 的方法论不是让 AI 更聪明，而是更有序。我用四个原则重构了自己的工作流：清理 25 个空壳 skill、审计 5 个项目规范、建立安全体系、优化内容创作流程。"
tags: ["AI协作", "Anthropic", "工作流", "一人公司"]
---

上一篇文章[我把 Hermes 从单兵作战，变成了一个专业团队](/blog/2026-04-26-ai-ceo-mode)，我讲了怎么把 Hermes 从单兵作战变成一个专业团队——skill 体系、CEO 模式、角色分工。

听起来挺像回事的。

我让 AI 自己扫描 workflow，结果 36 个 skill 里，有 25 个是空壳。只有 YAML frontmatter，正文啥也没有。

更离谱的是，这些空壳被其他核心 skill 引用着。

等于我跟 AI 说**这里有规范**，结果打开一看，空气。

我一直在优化 AI 的能力，却忘了自己的基建。

---

## 问题不在模型，在基建

Anthropic 有篇文章叫《Building effective agents》，里面有个观点让我印象深刻：好的 AI 协作不是让 AI 更聪明，而是让 AI **更有序**。

我之前一直在折腾 prompt、换模型，想让 AI**更聪明**。但后来发现，问题根本不在模型——是我的工作流没有基建。

就像盖房子，你一直在挑更好的砖头，但地基都没打。

---

## 四个原则

我从 Anthropic 的文档里提炼了四个原则，今天全用上了：

**1. 简洁原则：只写 AI 不知道的东西**

别写「这是一个用来做 X 的工具」——AI 不需要你解释它是什么。只写它不知道的：触发条件、具体步骤、踩过的坑。

举个例子：我之前写的 AGENTS.md，开头都是**这是一个用于 AI 协作的规范文件**。后来改成直接写 **Context Hierarchy**——分 5 层，每层加载什么内容。AI 不需要知道这个文件是什么，它需要知道具体怎么分层。

**2. Self-Review：提交前必须自检**

Google 的工程实践里有一条：提交代码前必须自己 review 一遍。AI 生成的代码比人写的更容易引入隐性问题，所以更要自检。

我把这个写进了每个项目的 AGENTS.md：
- 提交前必须过 Self-Review Checklist——build 通过了吗？
- 改动范围和 commit message 一致吗？
- 有没有引入 console.log？
- 这个清单不是给 AI 看的，是给我自己看的。

**3. 渐进式披露：上下文分层**

别把所有信息一股脑塞给 AI。分层：Level 1 是规则（始终加载），Level 2 是架构文档（按需加载），Level 3 是源文件（只加载相关的 1-2 个）。

我之前犯过一个错：给 AI 加载整个 src/ 目录，让它**全面了解项目**。结果它反而不知道该关注什么。后来改成**按需加载，只加载与当前任务直接相关的文件**，效果反而更好。

**4. 反馈循环：持续迭代**

别试图一次把所有事情做完。先跑通一个最小闭环，然后持续迭代。

今天清理 skill 体系，我没有一次性把 36 个全改完。先让 3 个子 Agent 并行扫描，分类出哪些有内容、哪些是空壳。然后先删空壳，再修引用，最后补充内容。每一步都验证，每一步都可回滚。

---

## 我做了什么

**Skill 体系清理：36→14**

派了 3 个子 Agent 并行扫描全部 36 个 skill，发现 69% 是空壳。直接删掉 25 个，剩下的每个都有可执行内容。

删之前还做了一件事：检查这些空壳有没有被其他 skill 引用。果然，有 4 个核心 skill 引用了这些空壳。先修引用，再删空壳，不然会报错。

还做了一个拆分：develop-workflow 有 353 行，是个巨型垃圾桶。拆成 4 个：通用开发规范、Git 铁律、分层记忆架构、多阶段开发。每个文件控制在 100 行以内。

**项目规范审计**

对 ~/Projects/ 下 5 个项目做全面审计，发现三个问题：

1. Git 规范写了没执行——3 个项目 AGENTS.md 写**严禁直推 main**，但最近 20 条 commit 全在 main 上
2. AGENTS.md 质量差距大——md.solozed.com 最完整，solace-ai 缺 6 个关键章节
3. 测试覆盖接近零——4 个项目 0 功能测试，全靠 npm run build 验证

修复了 3 个项目 AGENTS.md，补充了 8 个缺失章节：Context Hierarchy、测试指令、Anti-Patterns、Red Flags、Confusion Management、Context Packing、Self-Review、Success Criteria。

**安全体系建设**

从 skills.sh 安装了 4 个安全 skill：skill-vetter（审查外部 skill）、security-review（代码安全审计）、api-security-best-practices（API 专项）、security-best-practices（通用安全规范）。

四层覆盖：skill 入口审查 → 代码审计 → API 专项 → 通用规范。

**内容创作流程优化**

新建了 video-script-workflow（视频脚本）、content-repurpose-workflow（一鱼多吃），更新了 wechat-writing-workflow，集成了 humanizer 去 AI 味。

**碎片捕捉机制上线**

创建了 input/fragments/ 目录，设置了每周一自动整理的 cron job。以后看到好内容，说「记一下：XXX」，AI 直接存入。

---

## 成果

做完这些，我的工作流变了：

每个 skill 都有可执行内容，没有空壳。流程标准化，不靠人肉记忆。内容创作全链路覆盖，从碎片捕捉到多平台发布。

最明显的变化：之前每次写文章，都要重新告诉 AI 我的写作风格和公众号格式。现在这些都写在 AGENTS.md 里，AI 自动加载，不用重复说。

---

## 建议你也去试试

如果你想试试用 Anthropic 的方法论优化自己的 AI 工作流，可以从这三件事开始：

**1. 清理空壳**

检查一下你的 AI 配置文件（CLAUDE.md、.cursorrules 等），看看有多少是**写了但没内容**的。删掉空壳，保留有内容的。

**2. 写 Self-Review Checklist**

提交代码前，过一遍检查清单。不用太复杂，5 项就够：build 通过了吗？改动范围和 commit message 一致吗？有没有调试代码？有没有硬编码密钥？有没有循环依赖？

**3. 分层加载上下文**

别把所有信息一股脑塞给 AI。分层：规则层（始终加载）、架构层（按需加载）、源文件层（只加载相关的 1-2 个）。

---

AI 时代，值得更加从容。

不是因为 AI 更强了，是因为你更有序了。

---

*The Age of AI, the grace to be.*
