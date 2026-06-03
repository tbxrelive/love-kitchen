import supabase from '@/config/supabase'

export function normalizeRoomCode(c: string) { return c.trim().replace(/\s+/g, '-') }
export function isValidRoomCode(c: string) { return /^[a-zA-Z0-9一-鿿_-]{2,12}$/.test(c) }

export async function joinRoom(code: string, uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if room exists
    const { data: room, error: fetchErr } = await supabase.from('rooms').select('*').eq('id', code).maybeSingle()
    if (fetchErr) throw fetchErr

    if (!room) {
      // Create room
      const { error: createErr } = await supabase.from('rooms').insert({ id: code, participant_ids: [uid] })
      if (createErr) throw createErr
      return { success: true }
    }

    const pids: string[] = room.participant_ids || []
    if (pids.includes(uid)) {
      return { success: true }
    }

    // Clean up old IDs if room was full, then add
    if (pids.length >= 2) {
      // Replace non-present user or just add if possible
      const other = pids.find((p: string) => p !== uid)
      const { error: updateErr } = await supabase.from('rooms').update({
        participant_ids: other ? [other, uid] : [uid]
      }).eq('id', code)
      if (updateErr) throw updateErr
      return { success: true }
    }

    const { error: updateErr } = await supabase.from('rooms').update({
      participant_ids: [...pids, uid]
    }).eq('id', code)
    if (updateErr) throw updateErr
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function leaveRoom(code: string, uid: string) {
  const { data: room } = await supabase.from('rooms').select('participant_ids').eq('id', code).maybeSingle()
  if (!room) return
  const pids: string[] = room.participant_ids || []
  await supabase.from('rooms').update({
    participant_ids: pids.filter((p: string) => p !== uid)
  }).eq('id', code)
}

export function watchRoom(code: string, cb: (room: any) => void) {
  let active = true
  const poll = async () => {
    if (!active) return
    const { data } = await supabase.from('rooms').select('*').eq('id', code).maybeSingle()
    cb(data || null)
    if (active) setTimeout(poll, 3000)
  }
  poll()
  return () => { active = false }
}
