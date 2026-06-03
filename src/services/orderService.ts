import supabase from '@/config/supabase'
import type { Order } from '@/types'

export async function placeOrder(roomCode: string, data: {
  dishId: string; dishName: string; dishEmoji: string; category: Order['category']
  note: string | null; orderedBy: string; orderedByName: string
}) {
  const { data: d, error } = await supabase.from('orders').insert({
    room_code: roomCode, dish_id: data.dishId, dish_name: data.dishName,
    dish_emoji: data.dishEmoji, category: data.category, note: data.note,
    ordered_by: data.orderedBy, ordered_by_name: data.orderedByName,
    status: 'ordered',
  }).select('*').single()
  if (error) throw error
  return d.id
}

export async function claimOrder(orderId: string, uid: string, name: string) {
  const { error } = await supabase.from('orders').update({
    cooked_by: uid, cooked_by_name: name, status: 'cooking', started_cooking_at: new Date().toISOString(),
  }).eq('id', orderId)
  if (error) throw error
}

export async function serveOrder(orderId: string) {
  const { error } = await supabase.from('orders').update({
    status: 'served', served_at: new Date().toISOString(),
  }).eq('id', orderId)
  if (error) throw error
}

export function watchOrders(roomCode: string, cb: (orders: Order[]) => void) {
  let active = true
  const poll = async () => {
    if (!active) return
    const { data } = await supabase.from('orders').select('*').eq('room_code', roomCode).order('ordered_at', { ascending: true })
    cb((data || []) as Order[])
    if (active) setTimeout(poll, 1500)
  }
  poll()
  return () => { active = false }
}
