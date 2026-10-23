import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenSquare, Inbox, Send, Star, Trash2, FileText, Check, X } from 'lucide-react'
import MockWindow from '../components/MockWindow'
import HighlightGuide from '../components/HighlightGuide'
import { checkTyping, sfx } from '../lib/feedback'

const TEACHER = 'teacher@school.com'
const INBOX = [
  ['담임 선생님', '오늘의 숙제: 가을 나뭇잎 관찰하기 🍁', '10:20'],
  ['학교 도서관', '새로 들어온 그림책을 소개합니다', '어제'],
  ['하늘계정', '로그인 마스터 연습을 환영해요!', '어제'],
]

export default function Step5SendMail({ say, nudge, onClear, student }) {
  const [phase, setPhase] = useState('inbox') // inbox → compose → flying
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('선생님, 숙제를 다 했어요! 확인 부탁드려요. 😊')
  const toRef = useRef(null)
  const subjectRef = useRef(null)
  const suggestion = `${student.klass} ${student.name} 과제 제출합니다`

  const toCheck = checkTyping(to, TEACHER, { ignoreCase: true })
  const toDone = toCheck.state === 'done'
  const subjectDone = subject.trim().length >= 2
  const target = phase === 'inbox' ? 'write' : !toDone ? 'to' : !subjectDone ? 'subject' : 'send'

  useEffect(() => {
    say('로그인 성공! 여기는 내 메일함이에요. 📬 선생님께 숙제 완료 메일을 보내볼까요? 반짝이는 [메일 쓰기]를 눌러요.')
  }, [say])

  const openCompose = (e) => {
    e.stopPropagation()
    sfx.click()
    setPhase('compose')
    say('[받는 사람] 칸에 선생님 이메일 teacher@school.com 을 써요. 아래 이름표를 눌러도 돼요!')
    setTimeout(() => toRef.current?.focus(), 250)
  }

  const onTo = (v) => {
    setTo(v)
    const c = checkTyping(v, TEACHER, { ignoreCase: true })
    if (c.state === 'done') afterTo()
    else if (c.hint) say(c.hint, 'oops')
  }

  const afterTo = () => {
    sfx.click()
    say('받는 사람 완성! 이제 [제목] 칸에 무슨 메일인지 써요. 아래 추천 제목을 눌러도 돼요.', 'happy')
    setTimeout(() => subjectRef.current?.focus(), 250)
  }

  const onSubject = (v) => {
    setSubject(v)
    if (v.trim().length >= 2) say('좋아요! 내용도 확인하고, 파란색 [보내기] 버튼을 눌러요!')
  }

  const send = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!toDone) {
      nudge('받는 사람이 비어 있거나 달라요. teacher@school.com 을 써봐요!')
      toRef.current?.focus()
      return
    }
    if (!subjectDone) {
      nudge('제목이 없으면 선생님이 무슨 메일인지 몰라요. 제목을 써봐요!')
      subjectRef.current?.focus()
      return
    }
    sfx.whoosh()
    setPhase('flying')
    say('슝~ 메일이 종이비행기처럼 날아가요! ✈️', 'happy')
    setTimeout(onClear, 1800)
  }

  return (
    <div className="relative">
      <MockWindow
        url="https://mail.chorok-portal.kr/inbox (연습용)"
        onBackgroundClick={() => nudge('반짝이는 곳을 눌러야 해요! 노란 테두리를 찾아봐요.')}
      >
        <div className="flex min-h-[460px] bg-white">
          {/* 왼쪽 메뉴 */}
          <aside className="hidden w-48 shrink-0 border-r bg-gray-50 p-3 sm:block" onClick={(e) => e.stopPropagation()}>
            <HighlightGuide active={target === 'write'} tip="메일 쓰기!">
              <button
                onClick={openCompose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#03c75a] py-3 text-lg font-black text-white hover:bg-[#02b350]"
              >
                <PenSquare size={20} /> 메일 쓰기
              </button>
            </HighlightGuide>
            <ul className="mt-6 space-y-1 text-sm text-gray-700">
              <li className="flex items-center gap-2 rounded-lg bg-green-100 px-2 py-1.5 font-bold"><Inbox size={16} /> 받은메일함 <span className="ml-auto text-[#03c75a]">3</span></li>
              <li className="flex items-center gap-2 px-2 py-1.5"><Send size={16} /> 보낸메일함</li>
              <li className="flex items-center gap-2 px-2 py-1.5"><Star size={16} /> 중요 메일</li>
              <li className="flex items-center gap-2 px-2 py-1.5"><FileText size={16} /> 임시보관함</li>
              <li className="flex items-center gap-2 px-2 py-1.5"><Trash2 size={16} /> 휴지통</li>
            </ul>
          </aside>

          <main className="flex-1 p-3 sm:p-5">
            {/* 작은 화면용 메일 쓰기 버튼 */}
            {phase === 'inbox' && (
              <div className="mb-4 sm:hidden" onClick={(e) => e.stopPropagation()}>
                <HighlightGuide active tip="메일 쓰기!">
                  <button onClick={openCompose} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#03c75a] py-3 text-lg font-black text-white">
                    <PenSquare size={20} /> 메일 쓰기
                  </button>
                </HighlightGuide>
              </div>
            )}

            {phase === 'inbox' ? (
              <>
                <h3 className="mb-3 text-lg font-bold">받은메일함</h3>
                <ul className="divide-y rounded-xl border">
                  {INBOX.map(([from, title, time]) => (
                    <li key={title} className="flex items-center gap-3 px-3 py-3 text-sm">
                      <span className="w-24 shrink-0 truncate font-bold">{from}</span>
                      <span className="flex-1 truncate text-gray-700">{title}</span>
                      <span className="shrink-0 text-xs text-gray-400">{time}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <form onSubmit={send} onClick={(e) => e.stopPropagation()} autoComplete="off" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">메일 쓰기</h3>
                  <HighlightGuide active={target === 'send'} tip="보내기!" tipSide="top">
                    <button type="submit" className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-lg font-black text-white ${target === 'send' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-600/50'}`}>
                      <Send size={18} /> 보내기
                    </button>
                  </HighlightGuide>
                </div>

                <HighlightGuide active={target === 'to'}>
                  <label className="flex items-center gap-3 rounded-lg border-2 border-gray-200 px-3 py-2 focus-within:border-sky-500">
                    <span className="w-16 shrink-0 font-bold text-gray-600">받는 사람</span>
                    <input
                      ref={toRef}
                      value={to}
                      onChange={(e) => onTo(e.target.value)}
                      placeholder="이메일 주소"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="email"
                      className="w-full py-1 text-lg outline-none"
                    />
                    {toDone && <Check className="text-green-600" />}
                  </label>
                </HighlightGuide>
                {target === 'to' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTo(TEACHER)
                      afterTo()
                    }}
                    className="ml-2 inline-flex items-center gap-2 rounded-full border-2 border-sky-200 bg-sky-50 px-3 py-1.5 text-sm hover:bg-sky-100"
                  >
                    👩‍🏫 담임 선생님 <span className="font-mono text-sky-700">{TEACHER}</span>
                  </button>
                )}

                <HighlightGuide active={target === 'subject'}>
                  <label className="flex items-center gap-3 rounded-lg border-2 border-gray-200 px-3 py-2 focus-within:border-sky-500">
                    <span className="w-16 shrink-0 font-bold text-gray-600">제목</span>
                    <input
                      ref={subjectRef}
                      value={subject}
                      onChange={(e) => onSubject(e.target.value)}
                      placeholder="무슨 메일인지 짧게 써요"
                      className="w-full py-1 text-lg outline-none"
                    />
                    {subject && (
                      <button type="button" onClick={() => setSubject('')} className="text-gray-400 hover:text-gray-600" title="지우기">
                        <X size={18} />
                      </button>
                    )}
                  </label>
                </HighlightGuide>
                {target === 'subject' && (
                  <button
                    type="button"
                    onClick={() => onSubject(suggestion)}
                    className="ml-2 inline-flex items-center gap-2 rounded-full border-2 border-amber-200 bg-amber-50 px-3 py-1.5 text-sm hover:bg-amber-100"
                  >
                    💡 추천 제목: <b>{suggestion}</b>
                  </button>
                )}

                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-lg border-2 border-gray-200 p-3 text-lg outline-none focus:border-sky-500"
                />
              </form>
            )}
          </main>
        </div>
      </MockWindow>

      <AnimatePresence>
        {phase === 'flying' && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-8xl"
              initial={{ x: -120, y: 120, rotate: -10, scale: 0.6 }}
              animate={{ x: [-120, 0, 260, 700], y: [120, 0, -120, -500], rotate: [-10, 0, -15, -25], scale: [0.6, 1.2, 1, 0.6] }}
              transition={{ duration: 1.7, ease: 'easeInOut' }}
            >
              ✈️
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
