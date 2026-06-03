import supabase from '@/config/supabase'
import type { DiaryEntry, StickerEmoji, Sticker } from '@/types'

export async function createDiaryEntry(roomCode: string, order: {
  id?: string; dish_name: string; dish_emoji: string; category: string;
  note: string | null; ordered_by: string; ordered_by_name: string;
  cooked_by?: string | null; cooked_by_name?: string | null;
}) {
  const { data: d, error } = await supabase.from('diary_entries').insert({
    room_code: roomCode, order_id: order.id,
    dish_name: order.dish_name, dish_emoji: order.dish_emoji,
    category: order.category, note: order.note,
    ordered_by: order.ordered_by, ordered_by_name: order.ordered_by_name,
    cooked_by: order.cooked_by || 'unknown', cooked_by_name: order.cooked_by_name || '神秘大厨',
  }).select('*').single()
  if (error) throw error
  return d.id
}

export async function addSticker(entryId: string, emoji: StickerEmoji, uid: string) {
  const { error } = await supabase.from('stickers').insert({
    diary_entry_id: entryId, emoji, placed_by: uid,
  })
  if (error) throw error
}

export function watchDiary(roomCode: string, cb: (entries: DiaryEntry[]) => void) {
  let active = true
  const poll = async () => {
    if (!active) return
    const { data: entries } = await supabase.from('diary_entries').select('*').eq('room_code', roomCode).order('served_at', { ascending: false })
    if (!entries) { cb([]); if (active) setTimeout(poll, 3000); return }

    const results: DiaryEntry[] = []
    for (const e of entries) {
      const { data: stickers } = await supabase.from('stickers').select('*').eq('diary_entry_id', e.id).order('placed_at', { ascending: true })
      results.push({ ...e, stickers: (stickers || []) as Sticker[] } as DiaryEntry)
    }
    cb(results)
    if (active) setTimeout(poll, 3000)
  }
  poll()
  return () => { active = false }
}
