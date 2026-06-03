import { useCallback, useRef } from 'react'

// Generate simple sound effects using Web Audio API — no audio files needed
export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio not available — silently ignore
    }
  }, [getCtx])

  // 🔔 点单叮咚
  const playOrder = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      ;[880, 1100].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.12)
        gain.gain.setValueAtTime(0.15, now + i * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.12)
        osc.stop(now + i * 0.12 + 0.3)
      })
    } catch {}
  }, [getCtx])

  // ✨ 上菜bling
  const playServe = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      ;[523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.1)
        gain.gain.setValueAtTime(0.12, now + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.4)
      })
    } catch {}
  }, [getCtx])

  // 👨‍🍳 接单
  const playClaim = useCallback(() => {
    playTone(660, 0.2, 'square', 0.08)
    setTimeout(() => playTone(880, 0.15, 'square', 0.08), 100)
  }, [playTone])

  // ➕ 加菜
  const playAdd = useCallback(() => {
    playTone(600, 0.15, 'sine', 0.1)
    setTimeout(() => playTone(800, 0.1, 'sine', 0.1), 80)
  }, [playTone])

  // 🗑️ 删除
  const playDelete = useCallback(() => {
    playTone(300, 0.15, 'triangle', 0.08)
  }, [playTone])

  // 💕 贴贴纸
  const playSticker = useCallback(() => {
    playTone(1200, 0.12, 'sine', 0.08)
    setTimeout(() => playTone(1500, 0.1, 'sine', 0.06), 60)
  }, [playTone])

  return { playOrder, playServe, playClaim, playAdd, playDelete, playSticker }
}
