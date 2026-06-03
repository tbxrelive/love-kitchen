import { motion, AnimatePresence } from 'framer-motion'
import type { DiaryEntry as DiaryEntryType, StickerEmoji } from '@/types'
import EmptyState from '@/components/shared/EmptyState'
import DiaryEntry from './DiaryEntry'

interface DiaryTimelineProps {
  entries: DiaryEntryType[]
  onSticker: (entryId: string, emoji: StickerEmoji) => void
}

export default function DiaryTimeline({ entries, onSticker }: DiaryTimelineProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="font-cute text-2xl md:text-3xl text-chocolate flex items-center gap-2">
        <span>📖</span> 我们的美食日记
      </h2>

      {entries.length === 0 ? (
        <EmptyState
          emoji="📸"
          title="我们的美食日记还是空的呢～"
          subtitle="点第一单、做第一道菜，这里就会变成我们的甜蜜相册 💕"
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink via-peach to-transparent" />

          <div className="space-y-4 pl-10 md:pl-14">
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[26px] md:-left-[34px] top-6
                                  w-4 h-4 rounded-full bg-pink border-2 border-cream shadow-cute" />
                  <DiaryEntry entry={entry} onSticker={onSticker} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
