import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const FLOATING_EMOJIS = ['❤️', '🍳', '🍰', '💕', '🥤', '💝', '🍜', '🌸', '🍕', '💖', '🧁', '✨']

export default function BrandLogo() {
  const [hearts, setHearts] = useState<Array<{ id: number; emoji: string; x: number; delay: number; size: number }>>([])

  useEffect(() => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: FLOATING_EMOJIS[i % FLOATING_EMOJIS.length],
      x: Math.random() * 100,
      delay: Math.random() * 8,
      size: 20 + Math.random() * 24,
    }))
    setHearts(items)
  }, [])

  return (
    <div className="relative flex flex-col items-center py-8 md:py-12 overflow-hidden">
      {/* Floating background emojis */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute bottom-0 pointer-events-none"
          initial={{ x: `${h.x}vw`, y: '120%', opacity: 0 }}
          animate={{
            y: '-120%',
            opacity: [0, 0.7, 0.7, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 8,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ fontSize: h.size }}
        >
          {h.emoji}
        </motion.div>
      ))}

      {/* Title */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
        className="text-7xl md:text-8xl mb-4"
      >
        👩‍🍳💕👨‍🍳
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="font-cute text-4xl md:text-6xl text-gradient-love mb-3 text-center"
      >
        小厨神 · 恋爱厨房
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="font-body text-brown-light text-base md:text-lg text-center max-w-md"
      >
        只属于我们两个人的专属点餐厨房 💕
      </motion.p>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-4 text-2xl"
      >
        🍳🍰🥤🍜💝
      </motion.div>
    </div>
  )
}
