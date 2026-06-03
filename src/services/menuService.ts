import supabase from '@/config/supabase'
import type { DishCategory, Dish } from '@/types'

export async function addDish(roomCode: string, data: { name: string; category: DishCategory; emoji: string; createdBy: string }) {
  const { data: d, error } = await supabase.from('menu_items').insert({
    room_code: roomCode, name: data.name.trim(), category: data.category,
    emoji: data.emoji, created_by: data.createdBy,
  }).select('*').single()
  if (error) throw error
  return d.id
}

export async function updateDish(id: string, data: { name: string; category: DishCategory; emoji: string }) {
  const { error } = await supabase.from('menu_items').update({
    name: data.name.trim(), category: data.category, emoji: data.emoji, updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw error
}

export async function deleteDish(id: string) {
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) throw error
}

export function watchMenu(roomCode: string, cb: (dishes: Dish[]) => void) {
  let active = true
  const poll = async () => {
    if (!active) return
    const { data } = await supabase.from('menu_items').select('*').eq('room_code', roomCode).order('created_at', { ascending: true })
    cb((data || []) as Dish[])
    if (active) setTimeout(poll, 2000)
  }
  poll()
  return () => { active = false }
}
