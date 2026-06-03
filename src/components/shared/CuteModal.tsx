import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CuteModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function CuteModal({ open, onClose, title, children }: CuteModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto
                       bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-6
                       border-t-4 border-pink"
          >
            {/* Handle bar for mobile */}
            <div className="md:hidden flex justify-center mb-4">
              <div className="w-10 h-1.5 bg-peach rounded-full" />
            </div>

            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cute text-2xl text-chocolate">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-peach-light flex items-center justify-center
                             text-lg hover:bg-peach transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
