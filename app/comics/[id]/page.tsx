'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type ComicDetail = {
    title: string
    tags: string[]
    memo?: string
    imgs: string[]
}

export default function ComicDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [data, setData] = useState<ComicDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImg, setSelectedImg] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        const isLoggedIn = document.cookie.includes('auth=true')
        if (!isLoggedIn) {
            router.push('/')
        } else {
            fetch(`/api/comics/${id}`)
                .then(res => res.json())
                .then(setData)
                .finally(() => setLoading(false))
        }
    }, [id])

    if (loading) return <div className="p-6">載入中...</div>
    if (!data) return <div className="p-6">找不到漫畫資料</div>

    return (
        <div className="min-h-screen bg-white p-6">
            {/* 返回按鈕 */}
            <button
                onClick={() => router.push('/comics')}
                className="mb-4 text-sm underline text-blue-600 hover:text-blue-800"
            >
                ← 返回漫畫列表
            </button>

            {/* 標題與標籤 */}
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                {data.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                        {tag}
                    </span>
                ))}
            </div>

            {/* 備註 */}
            {data.memo && (
                <p className="text-gray-600 mb-6 whitespace-pre-line">{data.memo}</p>
            )}

            {/* 漫畫圖片 */}
            <div className="space-y-6">
                {data.imgs.map((url, idx) => (
                    <img
                        key={`${url}-${idx}`}
                        src={url}
                        alt={`漫畫第 ${idx + 1} 頁`}
                        className="w-full rounded shadow cursor-pointer hover:opacity-80 transition"
                        onClick={() => setSelectedImg(url)}
                    />
                ))}
            </div>

            {/* Modal 放大圖 */}
            {selectedImg && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setSelectedImg(null)}
                >
                    <img
                        src={selectedImg}
                        alt="放大圖片"
                        className="max-w-full max-h-full object-contain rounded"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
