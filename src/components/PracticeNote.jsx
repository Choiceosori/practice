// 연습용 정보가 적힌 메모지
export default function PracticeNote({ items, title = '연습용 쪽지' }) {
  return (
    <div className="mx-auto w-fit -rotate-1 rounded-md bg-yellow-200 px-5 py-3 shadow-md">
      <p className="mb-1 text-center font-cute text-amber-800">📌 {title}</p>
      <dl className="space-y-1">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-baseline gap-2">
            <dt className="w-20 shrink-0 text-right text-sm font-bold text-amber-700">{label}</dt>
            <dd className="font-mono text-xl font-black tracking-wider text-gray-900 sm:text-2xl">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
