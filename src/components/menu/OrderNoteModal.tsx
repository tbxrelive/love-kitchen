import { useState } from 'react'
import type { Dish } from '@/types'
import CuteModal from '@/components/shared/CuteModal'
import CuteButton from '@/components/shared/CuteButton'

interface OrderNoteModalProps {
  dish: Dish | null
  open: boolean
  onClose: () => void
  onConfirm: (note: string) => void
}

const SWEET_PLACEHOLDERS = [
  '宝宝少放辣，亲亲～',
  '多加一份爱 💕',
  '要超级好吃的那种！',
  '给亲爱的点的，用心做哦～',
  '不要太咸，爱你！',
  '记得多放葱～',
  '今天想吃甜的 🥰',
]

export default function OrderNoteModal({ dish, open, onClose, onConfirm }: OrderNoteModalProps) {
  const [note, setNote] = useState('')
  const [placeholder] = useState(() =>
    SWEET_PLACEHOLDERS[Math.floor(Math.random() * SWEET_PLACEHOLDERS.length)]
  )

  if (!dish) return null

  return (
    <CuteModal open={open} onClose={onClose} title="写个小纸条 💌">
      <div className="space-y-4">
        {/* Order preview */}
        <div className="card-cute bg-cream-dark flex items-center gap-3 p-4">
          <span className="text-4xl">{dish.emoji}</span>
          <div>
            <p className="font-cute text-lg text-chocolate">{dish.name}</p>
            <p className="font-body text-sm text-brown-light">给 TA 写句甜甜的话吧～</p>
          </div>
        </div>

        {/* Note input */}
        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={placeholder}
            className="input-sweet min-h-[80px] resize-none"
            maxLength={100}
            autoFocus
            rows={3}
          />
          <p className="text-right text-xs text-brown-light mt-1 font-body">
            {note.length}/100
          </p>
        </div>

        {/* Quick notes */}
        <div className="flex flex-wrap gap-2">
          {SWEET_PLACEHOLDERS.slice(0, 4).map((quick) => (
            <button
              key={quick}
              onClick={() => setNote(quick)}
              className="px-3 py-1.5 rounded-2xl bg-peach-light text-xs font-body text-brown
                         hover:bg-peach transition-colors"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <CuteButton
          onClick={() => onConfirm(note || '')}
          className="w-full"
          size="lg"
          icon="💕"
        >
          好想吃这个～
        </CuteButton>
      </div>
    </CuteModal>
  )
}
