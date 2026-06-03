import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  text?: string
}

export default function LoadingSpinner({ text = '加载中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        🍳
      </motion.div>
      <p className="font-cute text-brown-light animate-pulse">{text}</p>
    </div>
  )
}
