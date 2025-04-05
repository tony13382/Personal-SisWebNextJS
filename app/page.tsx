'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (password === '1234') {
      document.cookie = 'auth=true; path=/'
      router.push('/home')
    } else {
      setError('密碼錯誤')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">登入</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 mb-4"
          placeholder="請輸入密碼"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
          登入
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}