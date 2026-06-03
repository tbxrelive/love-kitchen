import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface HeartBurstProps {
  active: boolean
}

const EMOJIS = ['❤️', '💕', '💝', '💖', '😍', '🥰']

export default function HeartBurst({ active }: HeartBurstProps) {
  // Generate random values per burst, not at module scope
  const hearts = useMemo(() => {
    if (!active) return []
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      angle: (i / 12) * 360 + (Math.random() - 0.5) * 30,
      distance: 60 + Math.random() * 120,
      size: 18 + Math.random() * 20,
    }))
  }, [active])

  if (!active) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.5, 1],
            x: Math.cos((h.angle * Math.PI) / 180) * h.distance,
            y: Math.sin((h.angle * Math.PI) / 180) * h.distance,
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute"
          style={{ fontSize: h.size }}
        >
          {h.emoji}
        </motion.div>
      ))}
    </div>
  )
}
