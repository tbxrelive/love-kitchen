import type { DishCategory } from '@/types'

export const CATEGORY_LABELS: Record<DishCategory, string> = {
  staple: '🍚 主食',
  dessert: '🍰 甜点',
  drink: '🥤 饮品',
  snack: '🍟 小吃',
  other: '✨ 其他',
}

export const CATEGORY_COLORS: Record<DishCategory, string> = {
  staple: 'bg-warm-yellow/50 text-chocolate',
  dessert: 'bg-pink/40 text-pink-deep',
  drink: 'bg-blue-100 text-blue-700',
  snack: 'bg-orange-100 text-orange-700',
  other: 'bg-purple-100 text-purple-700',
}

export const ALL_CATEGORIES: DishCategory[] = ['staple', 'dessert', 'drink', 'snack', 'other']
