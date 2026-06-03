import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#FF85A2', '#FFD166', '#FFB3C1', '#FF6B8A', '#FFAB76', '#FFEAA7', '#FFF3E0']
const SHAPES = ['❤️', '🌸', '✨', '💕', '🌟', '🎉', '💝']

interface Particle {
  id: number
  x: number
  y: number
  color: string
  emoji: string
  size: number
  rotation: number
  delay: number
}

// Global event for triggering confetti
let triggerConfettiCallback: (() => void) | null = null

export function triggerConfetti() {
  triggerConfettiCallback?.()
}

export default function ConfettiOverlay() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [show, setShow] = useState(false)

  const spawn = useCallback(() => {
    const items: Particle[] = []
    for (let i = 0; i < 60; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        emoji: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        size: 16 + Math.random() * 24,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
      })
    }
    setParticles(items)
    setShow(true)

    setTimeout(() => {
      setShow(false)
    }, 4000)
  }, [])

  useEffect(() => {
    triggerConfettiCallback = spawn
    return () => { triggerConfettiCallback = null }
  }, [spawn])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 1,
                x: `${p.x}vw`,
                y: `${p.y}vh`,
                rotate: 0,
                scale: 0,
              }}
              animate={{
                opacity: [1, 1, 0],
                y: `${100 + Math.random() * 20}vh`,
                rotate: p.rotation + Math.random() * 720,
                scale: [0, 1, 1],
                x: `${p.x + (Math.random() - 0.5) * 20}vw`,
              }}
              transition={{
                duration: 3 + Math.random() * 1.5,
                delay: p.delay,
                ease: 'easeOut',
              }}
              className="absolute"
              style={{ fontSize: p.size }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
