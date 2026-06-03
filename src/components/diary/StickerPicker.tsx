import { motion } from 'framer-motion'
import type { StickerEmoji } from '@/types'
import { STICKER_EMOJIS, STICKER_LABELS } from '@/constants/stickers'

interface StickerPickerProps {
  onSelect: (emoji: StickerEmoji) => void
}

export default function StickerPicker({ onSelect }: StickerPickerProps) {
  return (
    <div className="flex gap-2">
      {STICKER_EMOJIS.map((emoji) => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.3, y: -4 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => onSelect(emoji)}
          className="w-10 h-10 rounded-full bg-cream-dark hover:bg-peach-light
                     flex items-center justify-center text-xl
                     shadow-sm hover:shadow-cute transition-all"
          title={STICKER_LABELS[emoji]}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  )
}
