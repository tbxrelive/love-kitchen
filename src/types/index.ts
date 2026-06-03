export type DishCategory = 'staple' | 'dessert' | 'drink' | 'snack' | 'other'
export type OrderStatus = 'ordered' | 'cooking' | 'served'
export type StickerEmoji = '😋' | '👍' | '😘' | '🥰' | '😅'

export interface Room { id: string; participant_ids: string[]; created_at: string }
export interface Dish { id: string; name: string; category: DishCategory; emoji: string; created_by: string; room_code: string; created_at: string }
export interface Order { id: string; dish_id: string; dish_name: string; dish_emoji: string; category: DishCategory; note: string | null; ordered_by: string; ordered_by_name: string; cooked_by: string | null; cooked_by_name: string | null; status: OrderStatus; room_code: string; ordered_at: string; started_cooking_at: string | null; served_at: string | null }
export interface DiaryEntry { id: string; order_id: string; dish_name: string; dish_emoji: string; category: DishCategory; note: string | null; ordered_by: string; ordered_by_name: string; cooked_by: string; cooked_by_name: string; room_code: string; served_at: string; created_at: string; stickers: Sticker[] }
export interface Sticker { id: string; emoji: StickerEmoji; placed_by: string; placed_at: string }
