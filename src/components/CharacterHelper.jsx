import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { speak } from '../lib/feedback'

// 말풍선 도우미 '토토'
export default function CharacterHelper({ message, mood = 'normal' }) {
  const face = mood === 'oops' ? '🙀' : mood === 'happy' ? '🥳' : '🐰'
  const bubble =
    mood === 'oops'
      ? 'border-rose-300 bg-rose-50 text-rose-800'
      : mood === 'happy'
        ? 'border-green-300 bg-green-50 text-green-800'
        : 'border-sky-300 bg-white text-gray-800'

  return (
    <div className="flex items-end gap-2 sm:gap-3" aria-live="polite">
      <div className="bounce-soft shrink-0 select-none text-5xl sm:text-6xl" aria-hidden>
        {face}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`relative mb-3 flex-1 rounded-2xl border-4 px-4 py-3 font-cute text-lg leading-snug shadow-sm sm:text-xl ${bubble}`}
        >
          {message}
          <button
            onClick={() => speak(message)}
            className="ml-2 inline-flex translate-y-0.5 items-center rounded-full p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600"
            title="다시 듣기"
          >
            <RotateCcw size={16} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
