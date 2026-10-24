import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { speak } from '../lib/feedback'

function EmailParts() {
  return (
    <div className="mx-auto mt-4 flex w-fit flex-wrap items-end justify-center gap-1 font-mono text-2xl font-black sm:text-3xl">
      <span className="flex flex-col items-center">
        <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-700">class1</span>
        <span className="mt-1 font-cute text-sm font-normal text-sky-700">이름 (누구)</span>
      </span>
      <span className="flex flex-col items-center">
        <span className="rounded-lg bg-orange-200 px-2 py-1 text-orange-600">@</span>
        <span className="mt-1 font-cute text-sm font-normal text-orange-600">~에 사는</span>
      </span>
      <span className="flex flex-col items-center">
        <span className="rounded-lg bg-green-100 px-2 py-1 text-green-700">school.com</span>
        <span className="mt-1 font-cute text-sm font-normal text-green-700">동네 (어디)</span>
      </span>
    </div>
  )
}

// 단계 시작 전 "왜 그럴까요?" 설명 카드
export default function WhyCard({ why, onDone }) {
  const [page, setPage] = useState(0)
  const slide = why.slides[page]
  const last = page === why.slides.length - 1

  useEffect(() => {
    speak(page === 0 ? `${why.title} ${slide.text}` : slide.text)
  }, [page, slide.text, why.title])

  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border-4 border-sky-300 bg-white p-5 text-center shadow-2xl sm:p-7"
      >
        <p className="font-cute text-lg text-sky-600">🐰 토토 선생님의 이야기</p>
        <h2 className="mt-1 font-cute text-2xl text-gray-900 sm:text-3xl">{why.title}</h2>

        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="min-h-[230px]">
            <div className="mt-4 text-6xl sm:text-7xl">{slide.emoji}</div>
            <p className="mt-4 font-cute text-xl leading-relaxed text-gray-800 sm:text-2xl">{slide.text}</p>
            {slide.visual === 'email' && <EmailParts />}
            {slide.tip && <p className="mx-auto mt-4 w-fit rounded-full bg-yellow-100 px-4 py-1.5 font-cute text-amber-800">💡 {slide.tip}</p>}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-center gap-2">
          {why.slides.map((_, i) => (
            <span key={i} className={`h-2.5 rounded-full transition-all ${i === page ? 'w-6 bg-sky-500' : 'w-2.5 bg-gray-300'}`} />
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="rounded-2xl p-3 text-gray-500 hover:bg-gray-100 disabled:invisible"
            title="이전"
          >
            <ArrowLeft />
          </button>
          <button onClick={() => speak(slide.text)} className="rounded-2xl p-3 text-gray-500 hover:bg-gray-100" title="다시 듣기">
            <RotateCcw />
          </button>
          {last ? (
            <button autoFocus onClick={onDone} className="glow flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 font-cute text-xl text-white hover:bg-green-600 sm:text-2xl">
              알겠어요! 미션 시작
            </button>
          ) : (
            <button autoFocus onClick={() => setPage((p) => p + 1)} className="glow flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3 font-cute text-xl text-white hover:bg-sky-600 sm:text-2xl">
              다음 이야기 <ArrowRight />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
