import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Dish, DishCategory } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import CuteModal from '@/components/shared/CuteModal'
import CuteButton from '@/components/shared/CuteButton'
import EmptyState from '@/components/shared/EmptyState'
import DishCard from './DishCard'
import AddDishForm from './AddDishForm'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/constants/categories'

interface MenuPanelProps {
  dishes: Dish[]
  onAdd: (name: string, category: DishCategory, emoji: string) => void
  onEdit: (dishId: string, name: string, category: DishCategory, emoji: string) => void
  onDelete: (dishId: string) => void
  onOrder: (dish: Dish) => void
}

export default function MenuPanel({ dishes, onAdd, onEdit, onDelete, onOrder }: MenuPanelProps) {
  const { userId } = useAuth()
  const [showAdd, setShowAdd] = useState(false)
  const [filterCategory, setFilterCategory] = useState<DishCategory | 'all'>('all')

  const filtered = filterCategory === 'all'
    ? dishes
    : dishes.filter((d) => d.category === filterCategory)

  const handleAdd = (name: string, category: DishCategory, emoji: string) => {
    if (!userId) return
    onAdd(name, category, emoji)
    setShowAdd(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-cute text-2xl md:text-3xl text-chocolate flex items-center gap-2">
          <span>📋</span> 今日菜单
        </h2>
        <CuteButton size="sm" onClick={() => setShowAdd(true)} icon="➕">
          加菜
        </CuteButton>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-2xl font-cute text-sm whitespace-nowrap transition-all ${
            filterCategory === 'all'
              ? 'bg-pink text-white shadow-cute'
              : 'bg-cream-dark text-brown-light hover:bg-peach-light'
          }`}
        >
          🌟 全部
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-2xl font-cute text-sm whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-pink text-white shadow-cute'
                : 'bg-cream-dark text-brown-light hover:bg-peach-light'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Dish list */}
      {filtered.length === 0 ? (
        <EmptyState
          emoji="🛒"
          title="我们还一道菜都没有呢～"
          subtitle="一起去逛超市吧！点击「加菜」开始填满我们的菜单 💕"
        />
      ) : (
        <motion.div layout className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onOrder={onOrder}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add dish modal */}
      <CuteModal open={showAdd} onClose={() => setShowAdd(false)} title="添加新菜品 ✨">
        <AddDishForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </CuteModal>
    </div>
  )
}
