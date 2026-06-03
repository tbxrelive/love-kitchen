import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Order } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useSound } from '@/hooks/useSound'
import CuteButton from '@/components/shared/CuteButton'
import HeartBurst from '@/components/shared/HeartBurst'

interface OrderCardProps {
  order: Order
  onClaim: (orderId: string) => void
  onServe: (order: Order) => void
}

const STATUS_CONFIG = {
  ordered: { label: '等你接单～', emoji: '🔔', color: 'bg-warm-yellow text-chocolate' },
  cooking: { label: '正在为你烹饪…', emoji: '👨‍🍳', color: 'bg-pink text-white' },
  served: { label: '上菜啦！', emoji: '✨', color: 'bg-green-200 text-green-800' },
}

export default function OrderCard({ order, onClaim, onServe }: OrderCardProps) {
  const { userId } = useAuth()
  const { playClaim, playServe } = useSound()
  const [showHearts, setShowHearts] = useState(false)

  const isOrderer = userId === order.ordered_by
  const isCook = userId === order.cooked_by
  const status = STATUS_CONFIG[order.status]

  const handleClaim = () => {
    playClaim()
    onClaim(order.id!)
  }

  const handleServe = () => {
    playServe()
    setShowHearts(true)
    setTimeout(() => onServe(order), 300)
  }

  const timeStr = order.ordered_at
    ? new Date(order.ordered_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1, y: 0, scale: 1,
        boxShadow: order.status === 'ordered'
          ? ['0 0 0px #FF85A2', '0 0 18px #FF85A2', '0 0 0px #FF85A2']
          : undefined,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="card-cute relative overflow-hidden"
    >
      <HeartBurst active={showHearts} />

      {/* Steam animation when cooking */}
      {order.status === 'cooking' && (
        <div className="absolute top-2 right-8 flex gap-1 pointer-events-none">
          <span className="text-lg animate-steam opacity-0">♨️</span>
          <span className="text-sm animate-steam-2 opacity-0">💨</span>
          <span className="text-base animate-steam-3 opacity-0">☁️</span>
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-cute ${status.color}`}>
          {status.emoji} {status.label}
        </span>
        <span className="text-xs font-body text-brown-light">{timeStr}</span>
      </div>

      {/* Dish info */}
      <div className="flex items-center gap-4 mb-3">
        <motion.span
          animate={order.status === 'cooking'
            ? { rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }
            : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-5xl"
        >
          {order.dish_emoji}
        </motion.span>
        <div>
          <h3 className="font-cute text-xl text-chocolate">{order.dish_name}</h3>
          <p className="font-body text-sm text-brown-light">
            🧑‍🍳 {order.ordered_by_name} 想吃这个～
          </p>
        </div>
      </div>

      {/* Note */}
      {order.note && (
        <div className="bg-pink/5 border border-pink/20 rounded-2xl p-3 mb-3">
          <p className="font-body text-sm text-rose">
            💌 「{order.note}」
          </p>
        </div>
      )}

      {/* Cook info — sweet couple text */}
      {order.status === 'cooking' && order.cooked_by_name && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2.5 bg-warm-yellow/30 rounded-2xl text-center"
        >
          <p className="font-cute text-sm text-chocolate">
            👨‍🍳 {order.cooked_by_name} 正在为你忙碌中…
            <span className="inline-block animate-bounce-soft ml-1">💕</span>
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {order.status === 'ordered' && !isOrderer && (
          <motion.div
            animate={{ rotate: [0, -3, 3, -3, 3, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="w-full"
          >
            <CuteButton onClick={handleClaim} className="w-full" size="md" icon="💪">
              交给我吧！
            </CuteButton>
          </motion.div>
        )}

        {order.status === 'cooking' && isCook && (
          <CuteButton onClick={handleServe} className="w-full" size="md" icon="🍽️">
            上菜咯～✨
          </CuteButton>
        )}

        {order.status === 'ordered' && isOrderer && (
          <div className="w-full text-center py-2">
            <p className="font-body text-sm text-brown-light">
              ⏳ 乖乖等着，TA 马上就来接单～
            </p>
          </div>
        )}

        {order.status === 'cooking' && !isCook && (
          <div className="w-full text-center py-2">
            <p className="font-body text-sm text-brown-light">
              👀 闻着香味了，马上就能吃啦～
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
