import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRoom } from '@/contexts/RoomContext'
import PartnerIndicator from './PartnerIndicator'

export default function NavBar() {
  const { roomCode, exitRoom } = useRoom()
  const location = useLocation()

  const isKitchen = location.pathname.includes('/kitchen/')
  const isDiary = location.pathname.includes('/diary/')

  return (
    <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b-2 border-peach/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            👩‍🍳
          </motion.span>
          <span className="font-cute text-xl text-gradient-love hidden sm:inline">
            小厨神
          </span>
        </Link>

        {/* Center: Room code + Partner */}
        <div className="flex items-center gap-3">
          {roomCode && (
            <span className="badge-sweet text-sm font-cute">
              🏠 {roomCode}
            </span>
          )}
          <PartnerIndicator />
        </div>

        {/* Right: Nav links */}
        <div className="flex items-center gap-2">
          {roomCode && (
            <>
              <Link
                to={`/kitchen/${roomCode}`}
                className={`px-4 py-2 rounded-2xl font-cute text-sm transition-all ${
                  isKitchen
                    ? 'bg-pink text-white shadow-cute'
                    : 'text-brown hover:bg-pink/10'
                }`}
              >
                🍽️ 厨房
              </Link>
              <Link
                to={`/diary/${roomCode}`}
                className={`px-4 py-2 rounded-2xl font-cute text-sm transition-all ${
                  isDiary
                    ? 'bg-pink text-white shadow-cute'
                    : 'text-brown hover:bg-pink/10'
                }`}
              >
                📖 日记
              </Link>
              <button
                onClick={exitRoom}
                className="px-3 py-2 rounded-2xl font-cute text-xs text-brown-light
                           hover:text-rose hover:bg-pink/10 transition-all"
              >
                离开
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
