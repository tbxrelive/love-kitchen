import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '@/contexts/RoomContext'
import { useAuth } from '@/contexts/AuthContext'
import BrandLogo from '@/components/landing/BrandLogo'
import RoomCodeInput from '@/components/landing/RoomCodeInput'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function LandingPage() {
  const { userId, loading: authLoading, error: authError } = useAuth()
  const { enterRoom, setMyName, myName } = useRoom()
  const navigate = useNavigate()
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNameInput, setShowNameInput] = useState(!myName)

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (myName.trim()) {
      setShowNameInput(false)
    }
  }

  const handleEnterRoom = async (code: string) => {
    if (!myName.trim()) {
      setShowNameInput(true)
      return
    }
    setJoining(true)
    setError(null)
    try {
      const result = await enterRoom(code)
      if (result.success) {
        navigate(`/kitchen/${code}`)
      } else {
        setError(result.error || '进入厨房失败，再试试看～')
      }
    } catch {
      setError('网络错误，请检查后重试～')
    } finally {
      setJoining(false)
    }
  }

  if (authLoading) {
    return <LoadingSpinner text="正在进入厨房..." />
  }

  if (authError) {
    return (
      <div className="min-h-dvh bg-love flex flex-col items-center justify-center p-4">
        <div className="card-cute p-6 text-center">
          <span className="text-5xl">😢</span>
          <h2 className="font-cute text-2xl text-chocolate mt-2">连接失败</h2>
          <p className="font-body text-sm text-rose mt-1">{authError}</p>
          <button onClick={() => window.location.reload()} className="btn-sweet mt-4">重新加载</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-love flex flex-col items-center justify-center">
      <BrandLogo />

      {/* Name input (shown on first visit) */}
      {showNameInput ? (
        <form onSubmit={handleNameSubmit} className="w-full max-w-md px-4">
          <div className="card-cute p-6 space-y-4 text-center">
            <span className="text-5xl">👋</span>
            <h2 className="font-cute text-2xl text-chocolate">先告诉我你的昵称吧～</h2>
            <p className="font-body text-sm text-brown-light">
              让 TA 知道是谁在点菜～
            </p>
            <input
              type="text"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="例如：宝宝、亲爱的"
              className="input-sweet text-center font-cute text-lg"
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              disabled={!myName.trim()}
              className="btn-sweet w-full"
            >
              好嘞～
            </button>
          </div>
        </form>
      ) : (
        <RoomCodeInput onEnter={handleEnterRoom} loading={joining} error={error} />
      )}

      {/* PWA install hint */}
      <p className="mt-8 text-center font-body text-sm text-brown-light px-4">
        📱 点击浏览器「分享」按钮 →「添加到主屏幕」<br />
        就能像 App 一样使用啦～
      </p>
    </div>
  )
}
