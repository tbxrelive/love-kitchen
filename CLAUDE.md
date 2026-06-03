# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

小厨神 · 恋爱厨房 — a couple's private cooking/ordering web app. Two people share a room, manage a menu of dishes, place orders with sweet notes, track cooking status in real-time, and keep a food diary with sticker reactions.

**Stack:** React 19 + Vite 8 + TypeScript + Tailwind CSS 3 + Framer Motion + Supabase (Singapore) + PWA (`vite-plugin-pwa`)

## Commands

```bash
npm run dev              # Start dev server on localhost:5173
npm run dev -- --host    # Dev server accessible on LAN (for phone testing)
npm run build            # TypeScript check + production build → dist/
npx vite preview         # Preview production build locally
npx wrangler pages deploy dist --project-name=love-kitchen   # Deploy to Cloudflare Pages
```

## Architecture

### Backend: Supabase (REST + polling)
- **Anonymous auth** via `supabase.auth.signInAnonymously()` — no registration required
- **Data sync via polling** (every 1.5–3s), not Firestore real-time. Each service file exports a `watchXxx()` poll function + CRUD operations
- **All fields are snake_case** in Supabase tables and TypeScript interfaces (e.g., `dish_name`, `cooked_by`, `ordered_at`)
- Supabase tables: `rooms`, `menu_items`, `orders`, `diary_entries`, `stickers`
- SQL schema and RLS policies live in `setup.sql`

### State management
- `AuthContext` — manages anonymous user ID via Supabase, exposes `{ userId, loading, error }`
- `RoomContext` — room join/leave, partner detection, exposes `{ roomCode, room, partnerUid, myName, enterRoom, exitRoom }`
- Data hooks (`useMenu`, `useOrders`, `useDiary`) — each calls the corresponding service's `watchXxx()` in a `useEffect`, returns `{ data, loading, error, ...mutators }`

### Route design
| Path | Page | Guard |
|------|------|-------|
| `/` | `LandingPage` | None |
| `/kitchen/:roomCode` | `KitchenPage` | `RoomGuard` (need auth + room) |
| `/diary/:roomCode` | `DiaryPage` | `RoomGuard` |

`KitchenPage` auto-joins from the `:roomCode` URL param via `useEffect` → `enterRoom()` — this is how partners following a link enter the room.

### Component hierarchy
- `App.tsx` → `AuthProvider` → `RoomProvider` → `BrowserRouter` → `Routes` + `ConfettiOverlay`
- `KitchenPage` orchestrates `MenuPanel` + `OrderBoard` in a two-column grid
- `OrderCard` determines button visibility based on `userId === order.ordered_by` vs `userId === order.cooked_by` and `order.status`
- `ConfettiOverlay` uses a module-level global callback pattern (`triggerConfetti()`) to spawn 60 emoji particles

### Sound effects
`useSound` hook generates tones via **Web Audio API** (no audio files needed) — `playOrder` (ding-dong), `playServe` (4-note arpeggio), `playClaim`, `playAdd`, `playDelete`, `playSticker`

### Key patterns
- **All Supabase types use snake_case** and match the database columns exactly
- **PWA icon generation**: use `sharp-cli` (`npx sharp-cli`) to convert SVG to PNG
- Cloudflare Pages deploys from `dist/` — environment variables are baked at build time, not runtime
- The app relies on room codes as shared secrets; RLS policies are permissive (public read/write) since the room code is the only access control

### Styling
- Custom Tailwind theme in `tailwind.config.js` — colors like `cream`, `peach`, `pink`, `warm-yellow`; custom animations (`float`, `pop-in`, `heartbeat`)
- Component classes defined in `index.css` via `@layer components` — `card-cute`, `btn-sweet`, `btn-sweet-secondary`, `input-sweet`, `badge-sweet`
- Framer Motion for card entrance animations, flying emoji, confetti, and steam effects
