import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRoom } from '@/contexts/RoomContext'
import { useMenu } from '@/hooks/useMenu'
import { useOrders } from '@/hooks/useOrders'
import { useNotification } from '@/hooks/useNotification'
import { triggerConfetti } from '@/components/shared/ConfettiOverlay'
import MenuPanel from '@/components/menu/MenuPanel'
import OrderBoard from '@/components/orders/OrderBoard'
import OrderNoteModal from '@/components/menu/OrderNoteModal'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { Dish, DishCategory, Order } from '@/types'

const CHEF_PRAISES = [
  '今天我家{name}是米其林大厨！👨‍🍳⭐',
  '{name}今天辛苦啦，爱的味道满分！💯',
  '给{name}颁一个最佳厨师奖！🏆',
  '{name}的厨艺今天爆表啦！🔥',
  '今天的厨房王者是{name}！👑',
]

export default function KitchenPage() {
  const { roomCode: urlRoomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { myName, roomCode, enterRoom } = useRoom()
  const { notify, requestPermission } = useNotification()

  const { dishes, loading: menuLoading, error: menuError, add, update, remove } = useMenu(roomCode)
  const { orders, loading: ordersLoading, error: ordersError, justServed, clearJustServed, order, claim, serve } = useOrders(roomCode)

  const [orderDish, setOrderDish] = useState<Dish | null>(null)
  const [orderNoteOpen, setOrderNoteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  // Today's Chef
  const chefStats = useMemo(() => {
    const cookCounts: Record<string, { name: string; count: number }> = {}
    orders.forEach((o) => {
      if (o.cooked_by_name && o.cooked_by) {
        if (!cookCounts[o.cooked_by]) {
          cookCounts[o.cooked_by] = { name: o.cooked_by_name, count: 0 }
        }
        cookCounts[o.cooked_by].count++
      }
    })
    const chefs = Object.entries(cookCounts).map(([uid, { name, count }]) => ({ uid, name, count }))
    chefs.sort((a, b) => b.count - a.count)
    if (chefs.length === 0) return null
    const top = chefs[0]
    const praise = CHEF_PRAISES[Math.abs(top.name.length + top.count) % CHEF_PRAISES.length]
    return { ...top, praise: praise.replace('{name}', top.name) }
  }, [orders])

  // Auto-join room from URL param
  useEffect(() => {
    if (urlRoomCode && !roomCode && userId && !joining) {
      setJoining(true)
      enterRoom(urlRoomCode).then((result) => {
        if (!result.success) navigate('/')
        setJoining(false)
      })
    }
  }, [urlRoomCode, roomCode, userId, enterRoom, navigate, joining])

  // Notification permission
  useEffect(() => {
    const handleClick = () => {
      requestPermission()
      document.removeEventListener('click', handleClick)
    }
    document.addEventListener('click', handleClick, { once: true })
    return () => document.removeEventListener('click', handleClick)
  }, [requestPermission])

  // Notify on new orders + status changes
  const prevOrdersRef = useRef<Order[]>([])
  useEffect(() => {
    const prev = prevOrdersRef.current
    const prevMap = new Map(prev.map(o => [o.id, o]))
    for (const order of orders) {
      const prevOrder = prevMap.get(order.id!)
      if (!prevOrder && order.ordered_by !== userId) {
        notify(`${order.ordered_by_name} 点了 ${order.dish_emoji} ${order.dish_name}！`, {
          body: order.note || '快去接单吧～',
          tag: `order-${order.id}`,
        })
      } else if (prevOrder && prevOrder.status !== order.status) {
        if (order.status === 'cooking' && order.ordered_by === userId) {
          notify(`🎉 ${order.cooked_by_name || 'TA'} 开始做 ${order.dish_emoji} ${order.dish_name} 啦！`)
        }
      }
    }
    prevOrdersRef.current = orders
  }, [orders, userId, notify])

  // Confetti on serve
  useEffect(() => {
    if (justServed) {
      triggerConfetti()
      notify(`✨ ${justServed.dish_emoji} ${justServed.dish_name} 上菜啦！快去吃～`)
      const timer = setTimeout(() => clearJustServed(), 4000)
      return () => clearTimeout(timer)
    }
  }, [justServed, clearJustServed, notify])

  // Clear action error
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [actionError])

  // Handlers
  const handleAddDish = useCallback(async (name: string, category: DishCategory, emoji: string) => {
    if (!userId) return
    try { await add(name, category, emoji, userId) } catch (err: any) { setActionError(err.message || '加菜失败') }
  }, [userId, add])

  const handleEditDish = useCallback(async (dishId: string, name: string, category: DishCategory, emoji: string) => {
    try { await update(dishId, name, category, emoji) } catch (err: any) { setActionError(err.message || '编辑失败') }
  }, [update])

  const handleDeleteDish = useCallback(async (dishId: string) => {
    try { await remove(dishId) } catch (err: any) { setActionError(err.message || '删除失败') }
  }, [remove])

  const handleOpenOrder = useCallback((dish: Dish) => {
    setOrderDish(dish)
    setOrderNoteOpen(true)
  }, [])

  const handleConfirmOrder = useCallback(async (note: string) => {
    if (!orderDish || !userId) return
    try {
      await order(orderDish.id!, orderDish.name, orderDish.emoji, orderDish.category, note || null, userId, myName || '神秘食客')
    } catch (err: any) { setActionError(err.message || '点单失败') }
    setOrderNoteOpen(false)
    setOrderDish(null)
  }, [orderDish, userId, myName, order])

  const handleClaim = useCallback(async (orderId: string) => {
    if (!userId) return
    try { await claim(orderId, userId, myName || '大厨') } catch (err: any) { setActionError(err.message || '接单失败') }
  }, [userId, myName, claim])

  const handleServe = useCallback(async (orderItem: Order) => {
    try { await serve(orderItem) } catch (err: any) { setActionError(err.message || '上菜失败～') }
  }, [serve])

  if (menuLoading && ordersLoading && !joining) {
    return <LoadingSpinner text="正在加载厨房..." />
  }

  return (
    <div className="page-container">
      <div className="text-center mb-6">
        <h1 className="font-cute text-3xl md:text-4xl text-gradient-love mb-1">
          欢迎来到我们的厨房 🏠💕
        </h1>
        <p className="font-body text-brown-light">今天想吃什么呢～</p>
      </div>

      {(menuError || ordersError || actionError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-body text-center">
          ⚠️ {menuError || ordersError || actionError}
        </div>
      )}

      {chefStats && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mb-4 p-3 bg-gradient-to-r from-warm-yellow/50 via-pink/20 to-peach/40 rounded-2xl border-2 border-warm-yellow-dark/30 text-center"
        >
          <span className="animate-crown inline-block text-2xl mr-2">👑</span>
          <span className="font-cute text-base md:text-lg text-chocolate">{chefStats.praise}</span>
          <span className="block font-body text-xs text-brown-light mt-1">已接 {chefStats.count} 单 🍳</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <MenuPanel dishes={dishes} onAdd={handleAddDish} onEdit={handleEditDish} onDelete={handleDeleteDish} onOrder={handleOpenOrder} />
        </section>
        <section>
          <OrderBoard orders={orders} onClaim={handleClaim} onServe={handleServe} />
        </section>
      </div>

      <OrderNoteModal
        dish={orderDish}
        open={orderNoteOpen}
        onClose={() => { setOrderNoteOpen(false); setOrderDish(null) }}
        onConfirm={handleConfirmOrder}
      />
    </div>
  )
}
