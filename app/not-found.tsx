import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center bg-black/30 backdrop-blur-lg p-8 rounded-xl border border-white/10 max-w-lg">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-white mb-6">页面未找到</h2>
        <p className="text-indigo-200 mb-8">
          抱歉，您访问的页面似乎不存在或已被移除。
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:scale-105"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
} 