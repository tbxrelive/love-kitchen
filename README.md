# 小厨神 · 恋爱厨房 💕

只属于两个人的专属私厨点餐应用。一起管理菜单、点菜写甜蜜备注、实时追踪烹饪状态，在美食日记中用表情贴纸互动。

## 技术栈

React 19 + Vite 8 + TypeScript + Tailwind CSS 3 + Framer Motion + Supabase（新加坡）+ PWA

## 本地开发

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 → http://localhost:5173
npm run dev -- --host  # 局域网可访问（手机测试用）
npm run build        # TypeScript 检查 + 生产构建 → dist/
npx vite preview     # 本地预览生产构建
```

## 环境变量

复制 `.env.example` 为 `.env`，填入 Supabase 项目凭证：

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 部署

```bash
npm run build
npx wrangler pages deploy dist --project-name=love-kitchen
```

部署到 Cloudflare Pages，国内无需 VPN 即可访问。

## 数据库

Supabase 建表语句和 RLS 安全策略在 `setup.sql` 中。共 5 张表：

| 表 | 说明 |
|----|------|
| `rooms` | 房间（房间码 + 参与者） |
| `menu_items` | 菜单菜品 |
| `orders` | 订单（点菜 → 烹饪 → 上菜） |
| `diary_entries` | 美食日记 |
| `stickers` | 日记贴纸 |

## 项目结构

```
src/
├── config/          # Supabase 客户端
├── types/           # TypeScript 类型定义
├── constants/       # 分类、emoji、贴纸常量
├── contexts/        # AuthContext + RoomContext
├── hooks/           # useMenu / useOrders / useDiary / useSound
├── services/        # 数据库 CRUD + 轮询同步
├── pages/           # LandingPage / KitchenPage / DiaryPage
└── components/      # UI 组件
    ├── landing/     # 首页品牌 Logo + 房间码输入
    ├── menu/        # 菜单面板 + 菜品卡片 + 点菜弹窗
    ├── orders/      # 订单看板 + 订单卡片
    ├── diary/       # 日记时间线 + 贴纸选择器
    └── shared/      # 通用组件（撒花、爱心、按钮等）
```

## 使用方式

1. 两人各自打开应用，输入昵称
2. 其中一人创建房间码，告诉对方
3. 输入相同房间码进入厨房
4. 一起添加菜品 → 点菜 → 认领 → 烹饪 → 上菜 🎉
5. 上菜后自动记录到美食日记，可以贴贴纸互动

## PWA

支持添加到手机主屏幕，像原生 App 一样使用。iOS Safari 点击「分享」→「添加到主屏幕」。
