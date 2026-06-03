import { useRoom } from '@/contexts/RoomContext'

export default function PartnerIndicator() {
  const { room, partnerUid } = useRoom()

  if (!room) return null

  const isPartnerOnline = !!partnerUid

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
        isPartnerOnline ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-gray-300'
      }`} />
      <span className="text-xs font-body text-brown-light">
        {isPartnerOnline ? 'TA 在线 💕' : '等待中...'}
      </span>
    </div>
  )
}
