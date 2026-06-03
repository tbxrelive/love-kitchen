import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface CuteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

export default function CuteButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: CuteButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center gap-2 font-cute font-bold rounded-2xl',
    'transition-all duration-200 select-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    size === 'sm' && 'px-4 py-2 text-sm',
    size === 'md' && 'px-6 py-3 text-lg',
    size === 'lg' && 'px-8 py-4 text-xl',
  )

  const variants = {
    primary: cn(
      'text-white shadow-cute',
      'bg-gradient-to-r from-pink-dark to-pink-deep',
      'hover:shadow-cute-hover hover:from-[#FF9BB5] hover:to-pink-dark',
    ),
    secondary: cn(
      'text-pink-deep border-2 border-pink bg-white shadow-cute',
      'hover:bg-pink/10 hover:shadow-cute-hover',
    ),
    ghost: cn(
      'text-brown hover:bg-pink/10',
    ),
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(base, variants[variant], className)}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : icon ? (
        <span className="text-xl">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
