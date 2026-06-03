import { useState, useEffect, useCallback } from 'react'
import { addDish, updateDish, deleteDish, watchMenu } from '@/services/menuService'
import type { Dish, DishCategory } from '@/types'

export function useMenu(roomCode: string | null) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomCode) { setDishes([]); setLoading(false); return }
    setLoading(true)
    const unsub = watchMenu(roomCode, (items) => { setDishes(items); setLoading(false) })
    return () => unsub()
  }, [roomCode])

  const add = useCallback(async (name: string, cat: DishCategory, emoji: string, uid: string) => {
    if (!roomCode) throw new Error('不在房间里')
    await addDish(roomCode, { name, category: cat, emoji, createdBy: uid })
  }, [roomCode])
  const update = useCallback(async (id: string, name: string, cat: DishCategory, emoji: string) => {
    await updateDish(id, { name, category: cat, emoji })
  }, [])
  const remove = useCallback(async (id: string) => { await deleteDish(id) }, [])

  return { dishes, loading, error, add, update, remove }
}
