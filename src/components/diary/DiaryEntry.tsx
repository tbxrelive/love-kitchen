import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { DiaryEntry as DiaryEntryType, StickerEmoji } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useSound } from '@/hooks/useSound'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categories'
import { STICKER_LABELS } from '@/constants/stickers'
import StickerPicker from './StickerPicker'

const POLAROID_COLORS = [
  '#FFB3C1', '#FFD1C1', '#FFEAA7', '#FFAB76', '#A0E7E5',
  '#B4C6FF', '#FFC5D3', '#D4A5FF', '#FFD166', '#8DE0C4',
]

interface DiaryEntryProps {
  entry: DiaryEntryType
  onSticker: (entryId: string, emoji: StickerEmoji) => void
}

export default function DiaryEntry({ entry, onSticker }: DiaryEntryProps) {
  const { userId } = useAuth()
  const { playSticker } = useSound()

  const borderColor = useMemo(
    () => POLAROID_COLORS[Math.floor(Math.abs(hashCode(entry.id || '')) % POLAROID_COLORS.length)],
    [entry.id]
  )

  const time = entry.served_at
    ? new Date(entry.served_at).toLocaleString('zh-CN', {
        month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : ''

  const handleSticker = (emoji: StickerEmoji) => {
    playSticker()
    onSticker(entry.id!, emoji)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      className="polaroid-card bg-white p-4 md:p-5 shadow-cute"
      style={{ borderColor }}
    >
      {/* Date stamp */}
      <p className="font-body text-xs text-brown-light mb-3 font-mono">📅 {time}</p>

      {/* Dish */}
      <div className="flex items-center gap-4 mb-3">
        <motion.span
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="text-4xl cursor-default"
        >
          {entry.dish_emoji}
        </motion.span>
        <div>
          <h3 className="font-cute text-xl text-chocolate">{entry.dish_name}</h3>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-body ${CATEGORY_COLORS[entry.category]}`}>
            {CATEGORY_LABELS[entry.category]}
          </span>
        </div>
      </div>

      {/* Note */}
      {entry.note && (
        <div className="bg-pink/5 border border-pink/20 rounded-2xl p-3 mb-3">
          <p className="font-body text-sm text-rose">💌 「{entry.note}」</p>
        </div>
      )}

      {/* People */}
      <div className="flex items-center gap-4 mb-3 font-body text-sm text-brown">
        <span>🧑‍🍳 {entry.ordered_by_name} 点的</span>
        <span>👨‍🍳 {entry.cooked_by_name} 做的</span>
      </div>

      {/* Stickers */}
      {entry.stickers && entry.stickers.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {entry.stickers.map((sticker, idx) => (
            <motion.span
              key={sticker.id || idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-xl cursor-default"
              title={STICKER_LABELS[sticker.emoji] || sticker.emoji}
            >
              {sticker.emoji}
            </motion.span>
          ))}
        </div>
      )}

      {/* Sticker picker */}
      <div className="pt-2 border-t border-dashed border-peach/30">
        <p className="font-body text-xs text-brown-light mb-2">
          给 TA 的表现打个分吧～
        </p>
        <StickerPicker onSelect={handleSticker} />
      </div>
    </motion.div>
  )
}

// Simple string hash for consistent random color
function hashCode(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}
