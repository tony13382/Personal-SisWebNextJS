'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('auth=true')
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [])

  const handleLogout = () => {
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4 p-8">
      <div className="bg-white shadow-md rounded-lg p-10 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold">歡迎！請選擇頁面</h1>
        <div className="flex space-x-4 py-8 w-full">
          <button
            onClick={() => router.push('/wallimgs')}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white p-5 rounded-xl text-3xl"
          >
            <i className="bi bi-images mb-2 block"></i>
            圖 牆
          </button>
          <button
            onClick={() => router.push('/comics')}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white p-5 rounded-xl text-3xl"
          >
            <i className="bi bi-book-half mb-2 block"></i>
            漫 畫
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm underline text-gray-600 hover:text-gray-800"
        >
          登出
        </button>
      </div>
    </div>
  )
}