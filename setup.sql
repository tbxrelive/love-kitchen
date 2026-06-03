-- =====================================================
-- 小厨神 · 恋爱厨房 — Supabase 数据库建表 SQL
-- 在 Supabase Dashboard → SQL Editor 中粘贴并运行
-- =====================================================

-- 1. 房间表
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  participant_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 菜单表
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  dish_id TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  dish_emoji TEXT NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  ordered_by TEXT NOT NULL,
  ordered_by_name TEXT NOT NULL,
  cooked_by TEXT,
  cooked_by_name TEXT,
  status TEXT DEFAULT 'ordered',
  ordered_at TIMESTAMPTZ DEFAULT NOW(),
  started_cooking_at TIMESTAMPTZ,
  served_at TIMESTAMPTZ
);

-- 4. 日记表
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  order_id TEXT,
  dish_name TEXT NOT NULL,
  dish_emoji TEXT NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  ordered_by TEXT NOT NULL,
  ordered_by_name TEXT NOT NULL,
  cooked_by TEXT NOT NULL,
  cooked_by_name TEXT NOT NULL,
  served_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 贴纸表
CREATE TABLE IF NOT EXISTS stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_entry_id UUID REFERENCES diary_entries(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  placed_by TEXT NOT NULL,
  placed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 启用 RLS（行级安全）— 任何人都可以访问（用房间码当密码）
-- =====================================================
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

-- 公开可读
CREATE POLICY "public_read" ON rooms FOR SELECT USING (true);
CREATE POLICY "public_read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "public_read" ON orders FOR SELECT USING (true);
CREATE POLICY "public_read" ON diary_entries FOR SELECT USING (true);
CREATE POLICY "public_read" ON stickers FOR SELECT USING (true);

-- 公开可写（通过房间码隔离，房间码本身是共享密码）
CREATE POLICY "public_insert" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert" ON diary_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert" ON stickers FOR INSERT WITH CHECK (true);

-- 公开可更新/删除
CREATE POLICY "public_update" ON rooms FOR UPDATE USING (true);
CREATE POLICY "public_update" ON menu_items FOR UPDATE USING (true);
CREATE POLICY "public_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON menu_items FOR DELETE USING (true);
