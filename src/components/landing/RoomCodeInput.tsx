import { useState } from 'react'
import { motion } from 'framer-motion'
import { isValidRoomCode, normalizeRoomCode } from '@/services/roomService'
import CuteButton from '@/components/shared/CuteButton'

interface RoomCodeInputProps {
  onEnter: (code: string) => void
  loading: boolean
  error: string | null
}

export default function RoomCodeInput({ onEnter, loading, error }: RoomCodeInputProps) {
  const [code, setCode] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizeRoomCode(code)

    if (!normalized) {
      setValidationError('请输入房间码哦～')
      return
    }
    if (!isValidRoomCode(normalized)) {
      setValidationError('房间码是 2-12 位字母数字～')
      return
    }

    setValidationError(null)
    onEnter(normalized)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto px-4"
    >
      <div className="card-cute p-6 md:p-8 space-y-5">
        <div className="text-center">
          <span className="text-4xl">🔑</span>
          <h2 className="font-cute text-2xl text-chocolate mt-2">输入房间码</h2>
          <p className="font-body text-sm text-brown-light mt-1">
            输入属于你们的秘密暗号，进入甜蜜厨房～
          </p>
          <p className="font-body text-xs text-pink-dark mt-1">
            💡 可以是你们的纪念日、昵称，什么都行～
          </p>
        </div>

        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setValidationError(null)
            }}
            placeholder="例如：20240520、baobao"
            className="input-sweet text-center text-xl font-cute tracking-widest"
            maxLength={12}
            autoFocus
            disabled={loading}
          />
          {(validationError || error) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose text-center mt-2 font-body"
            >
              {validationError || error}
            </motion.p>
          )}
        </div>

        <CuteButton
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
          icon="🚪"
        >
          进入厨房
        </CuteButton>
      </div>
    </motion.form>
  )
}
