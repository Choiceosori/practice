import { useEffect } from 'react'
import { Search, Cloud, Newspaper, ShoppingBag, Mail, Gamepad2 } from 'lucide-react'
import MockWindow from '../components/MockWindow'
import HighlightGuide from '../components/HighlightGuide'

const NEWS = ['우리 동네 도서관, 주말 그림책 축제 열려요', '가을 운동회 날씨는 맑음! ☀️', '반려동물과 산책할 때 지켜야 할 약속', '어린이 과학관 새 전시관 문 열어']

export default function Step1PortalHome({ say, nudge, onClear }) {
  useEffect(() => {
    say('인터넷 세상에서 나를 증명하는 [로그인] 버튼을 찾아보아요! 노랗게 반짝이는 초록 상자를 눌러봐요.')
  }, [say])

  const wrong = () => nudge('거기는 로그인 버튼이 아니에요. 노랗게 반짝이는 초록색 [로그인] 상자를 찾아봐요!')

  return (
    <MockWindow url="https://www.chorok-portal.kr (연습용)" onBackgroundClick={wrong}>
      <div className="bg-[#f5f6f7] p-3 sm:p-5">
        {/* 상단 로고 + 검색창 */}
        <div className="mx-auto mb-4 flex max-w-3xl items-center gap-3">
          <div className="font-black tracking-tight text-[#03c75a] sm:text-3xl text-2xl">초록포털</div>
          <div className="flex flex-1 items-center rounded-full border-2 border-[#03c75a] bg-white px-4 py-2">
            <input
              readOnly
              placeholder="검색어를 입력해 주세요."
              className="w-full bg-transparent text-sm outline-none"
              tabIndex={-1}
            />
            <Search className="text-[#03c75a]" size={20} />
          </div>
        </div>

        {/* 아이콘 메뉴 */}
        <div className="mx-auto mb-4 flex max-w-3xl justify-center gap-4 text-xs text-gray-600 sm:gap-8">
          {[
            [Mail, '메일'],
            [Newspaper, '뉴스'],
            [ShoppingBag, '쇼핑'],
            [Gamepad2, '게임'],
            [Cloud, '날씨'],
          ].map(([Icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Icon size={20} className="text-[#03c75a]" />
              </span>
              {label}
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-[1fr_260px]">
          {/* 로그인 상자: 모바일에선 위로 */}
          <div className="order-first md:order-last">
            <HighlightGuide active tip="여기를 눌러요!">
              <div className="rounded-xl border bg-white p-4">
                <p className="mb-3 text-sm text-gray-600">초록포털을 더 안전하고 편리하게 이용하세요</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                  }}
                  className="w-full cursor-pointer rounded-lg bg-[#03c75a] py-3 text-lg font-black text-white hover:bg-[#02b350]"
                >
                  초록포털 로그인
                </button>
                <div className="mt-2 flex justify-center gap-2 text-xs text-gray-400">
                  <span>아이디 찾기</span>|<span>비밀번호 찾기</span>|<span>회원가입</span>
                </div>
              </div>
            </HighlightGuide>
          </div>

          <div className="space-y-4">
            <div className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-r from-sky-300 to-indigo-300 font-cute text-xl text-white sm:text-2xl">
              🎨 가을 그림 그리기 대회
            </div>
            <div className="rounded-xl bg-white p-4">
              <h3 className="mb-2 font-bold">📰 오늘의 소식</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {NEWS.map((n) => (
                  <li key={n} className="truncate">
                    · {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MockWindow>
  )
}
