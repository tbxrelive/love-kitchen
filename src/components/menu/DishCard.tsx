import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Dish } from '@/types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categories'
import { useAuth } from '@/contexts/AuthContext'
import { useSound } from '@/hooks/useSound'
import CuteModal from '@/components/shared/CuteModal'
import AddDishForm from './AddDishForm'
import type { DishCategory } from '@/types'

interface DishCardProps {
  dish: Dish
  onOrder: (dish: Dish) => void
  onEdit: (dishId: string, name: string, category: DishCategory, emoji: string) => void
  onDelete: (dishId: string) => void
}

export default function DishCard({ dish, onOrder, onEdit, onDelete }: DishCardProps) {
  const { userId } = useAuth()
  const { playOrder, playDelete } = useSound()
  const [showEdit, setShowEdit] = useState(false)
  const [flyingEmoji, setFlyingEmoji] = useState(false)
  const isOwner = userId === dish.created_by

  const handleOrder = () => {
    setFlyingEmoji(true)
    playOrder()
    setTimeout(() => {
      onOrder(dish)
      setFlyingEmoji(false)
    }, 600)
  }

  const handleDelete = () => {
    playDelete()
    onDelete(dish.id!)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        whileHover={{ y: -4 }}
        className="card-cute p-4 flex items-center gap-4 group relative overflow-hidden"
      >
        {/* Flying emoji on order */}
        <AnimatePresence>
          {flyingEmoji && (
            <motion.div
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{ scale: 3, x: 60, y: -80, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute z-20 pointer-events-none"
              style={{ left: '20px', top: '20px' }}
            >
              <span className="text-4xl">{dish.emoji}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji */}
        <motion.div
          className={`text-4xl md:text-5xl flex-shrink-0 ${flyingEmoji ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
          transition={{ duration: 0.3 }}
        >
          {dish.emoji}
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-cute text-lg text-chocolate truncate">{dish.name}</h3>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-body mt-1 ${CATEGORY_COLORS[dish.category]}`}>
            {CATEGORY_LABELS[dish.category]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOrder}
            className="btn-sweet text-sm px-4 py-2"
            title="好想吃这个～"
          >
            🛎️ 好想吃～
          </motion.button>

          {isOwner && (
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowEdit(true)}
                className="w-7 h-7 rounded-full bg-peach-light text-xs hover:bg-peach transition-colors"
                title="编辑"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="w-7 h-7 rounded-full bg-red-50 text-xs hover:bg-red-100 transition-colors"
                title="删除"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit modal */}
      <CuteModal open={showEdit} onClose={() => setShowEdit(false)} title="编辑菜品 ✏️">
        <AddDishForm
          initial={{ name: dish.name, category: dish.category, emoji: dish.emoji }}
          onSubmit={(name, category, emoji) => {
            onEdit(dish.id!, name, category, emoji)
            setShowEdit(false)
          }}
          onCancel={() => setShowEdit(false)}
        />
      </CuteModal>
    </>
  )
}
