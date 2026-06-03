import { useCallback } from 'react'
import { useRoom } from '@/contexts/RoomContext'
import { useAuth } from '@/contexts/AuthContext'
import { useDiary } from '@/hooks/useDiary'
import DiaryTimeline from '@/components/diary/DiaryTimeline'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { StickerEmoji } from '@/types'

export default function DiaryPage() {
  const { roomCode } = useRoom()
  const { userId } = useAuth()
  const { entries, loading, error, placeSticker } = useDiary(roomCode)

  const handleSticker = useCallback(async (entryId: string, emoji: StickerEmoji) => {
    if (!userId) return
    try {
      await placeSticker(entryId, emoji, userId)
    } catch (err: any) {
      console.error('Sticker failed:', err)
    }
  }, [userId, placeSticker])

  if (loading) {
    return <LoadingSpinner text="正在翻开美食日记..." />
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-cute text-3xl md:text-4xl text-gradient-love mb-2">
          我们的美食日记 📖💕
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-body text-center">
            ⚠️ {error}
          </div>
        )}
        <p className="font-body text-brown-light">
          记录每一顿甜蜜的回忆～
        </p>
        {entries.length > 0 && (
          <p className="font-cute text-sm text-pink-dark mt-1">
            共 {entries.length} 条记录 🎉
          </p>
        )}
      </div>

      {/* Timeline */}
      <DiaryTimeline entries={entries} onSticker={handleSticker} />
    </div>
  )
}
