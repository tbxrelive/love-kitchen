import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DishCategory } from '@/types'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/constants/categories'
import { FOOD_EMOJIS } from '@/constants/emojis'
import CuteButton from '@/components/shared/CuteButton'

interface AddDishFormProps {
  onSubmit: (name: string, category: DishCategory, emoji: string) => void
  onCancel: () => void
  initial?: { name: string; category: DishCategory; emoji: string }
}

export default function AddDishForm({ onSubmit, onCancel, initial }: AddDishFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [category, setCategory] = useState<DishCategory>(initial?.category || 'staple')
  const [emoji, setEmoji] = useState(initial?.emoji || '🍳')

  const isEdit = !!initial

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), category, emoji)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-body text-sm text-brown mb-1 ml-1">菜品名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：爱心蛋炒饭"
          className="input-sweet"
          maxLength={30}
          autoFocus
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-body text-sm text-brown mb-2 ml-1">分类</label>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-2xl font-cute text-sm transition-all ${
                category === cat
                  ? 'bg-pink text-white shadow-cute'
                  : 'bg-cream-dark text-brown-light hover:bg-peach-light'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Emoji picker */}
      <div>
        <label className="block font-body text-sm text-brown mb-2 ml-1">
          选择一个可爱的图标
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-cream-dark rounded-2xl">
          {(FOOD_EMOJIS[category] || []).map((e) => (
            <motion.button
              key={e}
              type="button"
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEmoji(e)}
              className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all ${
                emoji === e
                  ? 'bg-pink shadow-cute scale-110'
                  : 'hover:bg-peach-light'
              }`}
            >
              {e}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <CuteButton type="button" variant="secondary" onClick={onCancel} className="flex-1">
          取消
        </CuteButton>
        <CuteButton type="submit" className="flex-1" disabled={!name.trim()}>
          {isEdit ? '💾 保存' : '✨ 加菜'}
        </CuteButton>
      </div>
    </form>
  )
}
