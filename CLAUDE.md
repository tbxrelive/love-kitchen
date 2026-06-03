# CLAUDE.md

这份文件为 Claude Code（claude.ai/code）在此仓库中工作提供指导。

## 项目概述

小厨神 · 恋爱厨房 — 情侣专属的私厨点餐 Web 应用。两人共同输入房间码进入厨房，管理共享菜单，点菜时写甜蜜备注，实时追踪烹饪状态，并在美食日记中用表情贴纸互动。

**技术栈：** React 19 + Vite 8 + TypeScript + Tailwind CSS 3 + Framer Motion + Supabase（新加坡节点）+ PWA（`vite-plugin-pwa`）

## 常用命令

```bash
npm run dev              # 启动开发服务器 → localhost:5173
npm run dev -- --host    # 局域网可访问（手机测试用）
npm run build            # TypeScript 检查 + 生产构建 → dist/
npx vite preview         # 本地预览生产构建
npx wrangler pages deploy dist --project-name=love-kitchen   # 部署到 Cloudflare Pages
```

## 架构

### 后端：Supabase（REST + 轮询）
- **匿名登录** 通过 `supabase.auth.signInAnonymously()` 实现，无需注册
- **数据同步** 使用轮询（1.5–3s 间隔），非实时推送。每个 service 文件导出 `watchXxx()` 轮询函数 + CRUD 操作
- **所有字段使用 snake_case**，与 Supabase 表的列名一致（如 `dish_name`、`cooked_by`、`ordered_at`）
- Supabase 数据表：`rooms`、`menu_items`、`orders`、`diary_entries`、`stickers`
- SQL 建表语句和 RLS 安全策略在 `setup.sql` 中

### 状态管理
- `AuthContext` — 通过 Supabase 管理匿名用户 ID，暴露 `{ userId, loading, error }`
- `RoomContext` — 房间加入/离开、伴侣在线检测，暴露 `{ roomCode, room, partnerUid, myName, enterRoom, exitRoom }`
- 数据 hooks（`useMenu`、`useOrders`、`useDiary`）— 各自在 `useEffect` 中调用对应 service 的 `watchXxx()`，返回 `{ data, loading, error, ...mutators }`

### 路由设计
| 路径 | 页面 | 守卫 |
|------|------|-------|
| `/` | `LandingPage` | 无 |
| `/kitchen/:roomCode` | `KitchenPage` | `RoomGuard`（需已登录 + 已加入房间） |
| `/diary/:roomCode` | `DiaryPage` | `RoomGuard` |

`KitchenPage` 通过 `useEffect` → `enterRoom()` 从 URL 中的 `:roomCode` 参数自动加入房间——这是伴侣通过链接进入房间的方式。

### 组件层级
- `App.tsx` → `AuthProvider` → `RoomProvider` → `BrowserRouter` → `Routes` + `ConfettiOverlay`
- `KitchenPage` 在双列网格中编排 `MenuPanel` + `OrderBoard`
- `OrderCard` 根据 `userId === order.ordered_by` vs `userId === order.cooked_by` 以及 `order.status` 决定按钮的显示
- `ConfettiOverlay` 使用模块级全局回调模式（`triggerConfetti()`）生成 60 个 emoji 粒子

### 音效
`useSound` hook 通过 **Web Audio API** 合成音效（无需音频文件）—— `playOrder`（叮咚）、`playServe`（4 音琶音）、`playClaim`、`playAdd`、`playDelete`、`playSticker`

### 关键模式
- **所有 Supabase 类型使用 snake_case**，与数据库列名完全一致
- **PWA 图标生成**：使用 `npx sharp-cli` 将 SVG 转换为 PNG
- Cloudflare Pages 从 `dist/` 部署 — 环境变量在构建时编译进代码，非运行时注入
- 应用依赖房间码作为共享密码；由于房间码本身就是访问控制，RLS 策略为公开读写

### 样式
- 自定义 Tailwind 主题在 `tailwind.config.js` 中 — 包含 `cream`、`peach`、`pink`、`warm-yellow` 等颜色；自定义动画（`float`、`pop-in`、`heartbeat`）
- 组件样式在 `index.css` 中用 `@layer components` 定义 — `card-cute`、`btn-sweet`、`btn-sweet-secondary`、`input-sweet`、`badge-sweet`
- Framer Motion 用于卡片入场动画、飞跳 emoji、撒花和蒸汽特效
