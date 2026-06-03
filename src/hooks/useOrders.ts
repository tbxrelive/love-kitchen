import { useState, useEffect, useCallback, useRef } from 'react'
import { placeOrder, claimOrder, serveOrder, watchOrders } from '@/services/orderService'
import { createDiaryEntry } from '@/services/diaryService'
import type { Order } from '@/types'

export function useOrders(roomCode: string | null) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [justServed, setJustServed] = useState<Order | null>(null)
  const prevRef = useRef<Order[]>([])

  useEffect(() => {
    if (!roomCode) { setOrders([]); setLoading(false); return }
    setLoading(true)
    const unsub = watchOrders(roomCode, (items) => {
      const active = items.filter(i => i.status !== 'served')
      const prevIds = new Set(prevRef.current.map(o => o.id))
      for (const po of prevRef.current) {
        if (!active.find(a => a.id === po.id)) {
          const updated = items.find(i => i.id === po.id)
          if (updated?.status === 'served') setJustServed(updated)
        }
      }
      setOrders(active); setLoading(false); prevRef.current = active
    })
    return () => unsub()
  }, [roomCode])

  const order = useCallback(async (dishId: string, dishName: string, dishEmoji: string, cat: Order['category'], note: string | null, uid: string, name: string) => {
    if (!roomCode) throw new Error('不在房间里')
    await placeOrder(roomCode, { dishId, dishName, dishEmoji, category: cat, note, orderedBy: uid, orderedByName: name })
  }, [roomCode])
  const claim = useCallback(async (orderId: string, uid: string, name: string) => {
    await claimOrder(orderId, uid, name)
  }, [])
  const serve = useCallback(async (order: Order) => {
    if (!roomCode || !order.id) throw new Error('数据不完整')
    await serveOrder(order.id)
    try { await createDiaryEntry(roomCode, order as any) } catch {}
  }, [roomCode])
  const clearJustServed = useCallback(() => setJustServed(null), [])

  return { orders, loading, error, justServed, clearJustServed, order, claim, serve }
}
