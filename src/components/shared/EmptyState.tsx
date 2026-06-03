import { motion } from 'framer-motion'

interface EmptyStateProps {
  emoji: string
  title: string
  subtitle?: string
}

export default function EmptyState({ emoji, title, subtitle }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl mb-4"
      >
        {emoji}
      </motion.div>
      <h3 className="font-cute text-xl text-brown mb-2">{title}</h3>
      {subtitle && (
        <p className="font-body text-sm text-brown-light max-w-xs">{subtitle}</p>
      )}
    </motion.div>
  )
}
