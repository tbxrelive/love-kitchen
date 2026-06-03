import { useState, useEffect, useCallback } from 'react'
import { addSticker, watchDiary } from '@/services/diaryService'
import type { DiaryEntry, StickerEmoji } from '@/types'

export function useDiary(roomCode: string | null) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomCode) { setEntries([]); setLoading(false); return }
    setLoading(true)
    const unsub = watchDiary(roomCode, (items) => { setEntries(items); setLoading(false) })
    return () => unsub()
  }, [roomCode])

  const placeSticker = useCallback(async (entryId: string, emoji: StickerEmoji, uid: string) => {
    await addSticker(entryId, emoji, uid)
  }, [])

  return { entries, loading, error, placeSticker }
}
