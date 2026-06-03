import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { joinRoom, leaveRoom, watchRoom } from '@/services/roomService'
import type { Room } from '@/types'

interface RoomContextValue {
  roomCode: string | null; room: Room | null; partnerUid: string | null
  myName: string; setMyName: (n: string) => void
  enterRoom: (c: string) => Promise<{ success: boolean; error?: string }>
  exitRoom: () => Promise<void>
}

const RoomContext = createContext<RoomContextValue>({
  roomCode: null, room: null, partnerUid: null, myName: '',
  setMyName: () => {}, enterRoom: async () => ({ success: false }), exitRoom: async () => {},
})

export function RoomProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth()
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [partnerUid, setPartnerUid] = useState<string | null>(null)
  const [myName, setMyNameState] = useState(() => localStorage.getItem('lk_my_name') || '')
  const setMyName = useCallback((n: string) => { setMyNameState(n); localStorage.setItem('lk_my_name', n) }, [])

  useEffect(() => {
    if (!roomCode || !userId) return
    const unsub = watchRoom(roomCode, (r) => {
      setRoom(r)
      if (r) setPartnerUid(r.participant_ids.find((p: string) => p !== userId) || null)
    })
    return () => unsub()
  }, [roomCode, userId])

  const enterRoom = useCallback(async (code: string) => {
    if (!userId) return { success: false, error: '请先登录～' }
    const r = await joinRoom(code, userId)
    if (r.success) { setRoomCode(code); localStorage.setItem('lk_room_code', code) }
    return r
  }, [userId])

  const exitRoom = useCallback(async () => {
    if (roomCode && userId) await leaveRoom(roomCode, userId)
    setRoomCode(null); setRoom(null); setPartnerUid(null)
    localStorage.removeItem('lk_room_code')
  }, [roomCode, userId])

  useEffect(() => {
    if (userId && !roomCode) {
      const saved = localStorage.getItem('lk_room_code')
      if (saved) joinRoom(saved, userId).then(r => { if (r.success) setRoomCode(saved); else localStorage.removeItem('lk_room_code') })
    }
  }, [userId])

  return <RoomContext.Provider value={{ roomCode, room, partnerUid, myName, setMyName, enterRoom, exitRoom }}>{children}</RoomContext.Provider>
}

export function useRoom() { return useContext(RoomContext) }
