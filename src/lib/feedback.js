import confetti from 'canvas-confetti'

// 소리 파일 없이 Web Audio로 효과음을 만들어요.
let ctx
function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, start, duration, type = 'sine', volume = 0.25) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t = ac.currentTime + start
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

export const settings = { sound: true, voice: true }

export const sfx = {
  // 딩-동!
  ding() {
    if (!settings.sound) return
    tone(1046.5, 0, 0.5)
    tone(784, 0.22, 0.7)
  },
  click() {
    if (!settings.sound) return
    tone(660, 0, 0.08, 'triangle', 0.15)
  },
  oops() {
    if (!settings.sound) return
    tone(330, 0, 0.15, 'triangle', 0.18)
    tone(262, 0.12, 0.22, 'triangle', 0.18)
  },
  fanfare() {
    if (!settings.sound) return
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.13, 0.35))
    tone(1318, 0.55, 0.9)
  },
  whoosh() {
    if (!settings.sound) return
    const ac = audio()
    if (!ac) return
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1600, ac.currentTime + 0.6)
    gain.gain.setValueAtTime(0.05, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.7)
    osc.connect(gain).connect(ac.destination)
    osc.start()
    osc.stop(ac.currentTime + 0.75)
  },
}

// 브라우저 음성(한국어)으로 안내를 읽어줘요.
// 친절한 여자 선생님 목소리: 기기에 있는 한국어 여성 음성을 골라 조금 천천히, 부드럽게 말해요.
const FEMALE_VOICES = ['yuna', 'sora', 'sunhi', 'heami', 'jimin', 'seoyeon', 'female', '여성', 'google 한국']
const MALE_VOICES = ['injoon', 'hyunsu', 'minjun', 'male', '남성']

let teacherVoice
function pickTeacherVoice() {
  const ko = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('ko'))
  if (!ko.length) return undefined
  const name = (v) => v.name.toLowerCase()
  const female = ko.filter((v) => FEMALE_VOICES.some((k) => name(v).includes(k)))
  const notMale = ko.filter((v) => !MALE_VOICES.some((k) => name(v).includes(k)))
  // 자연스러운 고음질(Natural/Premium/Enhanced) 음성을 먼저 써요.
  const nicest = (list) => list.find((v) => /natural|premium|enhanced|online/i.test(v.name)) || list[0]
  return nicest(female) || nicest(notMale) || ko[0]
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  teacherVoice = pickTeacherVoice()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    teacherVoice = pickTeacherVoice()
  })
}

// 기호를 소리 내기 좋게 바꿔요: [로그인] → 로그인, @ → 골뱅이
function toSpeech(text) {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{25CF}]/gu, '')
    .replace(/[[\]]/g, '')
    .replace(/@/g, ' 골뱅이 ')
    .replace(/!/g, '! ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function speak(text, { rate = 0.88 } = {}) {
  if (!settings.voice || !('speechSynthesis' in window) || !text) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(toSpeech(text))
  u.lang = 'ko-KR'
  u.rate = rate
  // 밝고 높은 톤: 여성 음성이면 1.3, 못 찾았으면 더 높여서 1.45 (최대 2)
  u.pitch = teacherVoice && FEMALE_VOICES.some((k) => teacherVoice.name.toLowerCase().includes(k)) ? 1.3 : 1.45
  u.volume = 1
  if (teacherVoice) u.voice = teacherVoice
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

export function celebrate(big = false) {
  const colors = ['#facc15', '#22c55e', '#3b82f6', '#ec4899', '#f97316']
  if (!big) {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.65 }, colors })
    return
  }
  const end = Date.now() + 1800
  ;(function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors })
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

// 입력값을 정답과 비교해서 아이에게 맞는 힌트를 골라줘요.
export function checkTyping(value, answer, { ignoreCase = false } = {}) {
  if (!value) return { state: 'empty' }
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
    return { state: 'korean', hint: '앗, 한글이 써졌어요! 키보드의 [한/영] 키를 눌러 영어로 바꿔요.' }
  }
  const v = ignoreCase ? value.toLowerCase() : value
  const a = ignoreCase ? answer.toLowerCase() : answer
  if (v === a) return { state: 'done' }
  if (a.startsWith(v)) return { state: 'ok' }
  if (!ignoreCase && answer.startsWith(value.toLowerCase())) {
    return { state: 'caps', hint: '대문자가 써졌어요! [Caps Lock] 키가 켜져 있는지 확인해요.' }
  }
  if (value.startsWith(answer)) {
    return { state: 'long', hint: '글자를 너무 많이 썼어요. [←Backspace] 키로 지워봐요.' }
  }
  return { state: 'wrong', hint: '글자가 조금 달라요. [←Backspace] 키로 지우고 다시 써봐요.' }
}
