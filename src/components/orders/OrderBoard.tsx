import { motion, AnimatePresence } from 'framer-motion'
import type { Order } from '@/types'
import EmptyState from '@/components/shared/EmptyState'
import OrderCard from './OrderCard'

interface OrderBoardProps {
  orders: Order[]
  onClaim: (orderId: string) => void
  onServe: (order: Order) => void
}

export default function OrderBoard({ orders, onClaim, onServe }: OrderBoardProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-cute text-2xl md:text-3xl text-chocolate flex items-center gap-2">
          <span>🧾</span> 进行中
        </h2>
        <span className="badge-sweet font-cute">
          {orders.length} 单
        </span>
      </div>

      {/* Order list */}
      {orders.length === 0 ? (
        <EmptyState
          emoji="🍳"
          title="今天还没有人点菜呢～"
          subtitle="快去菜单里看看，想吃哪个就点哪个！"
        />
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClaim={onClaim}
                onServe={onServe}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
