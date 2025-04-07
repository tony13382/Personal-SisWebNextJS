'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

// 單一圖片卡片元件，避免 useInView 違反 Hook 規則
function WallImageCard({
  img,
  onClick,
}: {
  img: { name: string; url: string }
  onClick: (url: string) => void
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="mb-4 break-inside-avoid">
      {inView && (
        <img
          src={img.url}
          alt={img.name}
          className="w-full rounded shadow cursor-pointer hover:opacity-90 transition"
          onClick={() => onClick(img.url)}
        />
      )}
    </div>
  )
}

type ImgItem = {
  name: string
  tags: string[]
  url: string
}

export default function WallImgsPage() {
  const router = useRouter()
  const [allTags, setAllTags] = useState<string[]>([])
  const [imgs, setImgs] = useState<ImgItem[]>([])
  const [activeTag, setActiveTag] = useState<string>('全部')
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('auth=true')
    if (!isLoggedIn) {
      router.push('/')
    } else {
      fetch('/api/wallimgs')
        .then(res => res.json())
        .then(data => {
          setAllTags(['全部', ...data.tags])
          setImgs(data.imgs)
          setLoading(false)
        })
    }
  }, [])

  const filteredImgs = imgs
    .filter(img => activeTag === '全部' || img.tags.includes(activeTag))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 p-6">
      {/* 返回按鈕 */}
      <button
        onClick={() => router.push('/home')}
        className="mb-4 text-sm underline text-blue-600 hover:text-blue-800"
      >
        ← 返回頁面
      </button>

      <h1 className="text-2xl font-bold mb-4">圖牆</h1>

      {/* Tag Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-sm ${activeTag === tag
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry Image Grid */}
      {loading ? (
        <p>載入中...</p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredImgs.map((img, idx) => (
            <WallImageCard
              key={img.url || `${img.name}-${idx}`}
              img={img}
              onClick={setSelectedImg}
            />
          ))}
        </div>
      )}

      {/* Modal for fullscreen preview */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          {/* 點擊背景關閉 */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedImg(null)}
          />

          {/* 圖片與關閉按鈕區域 */}
          <div className="relative z-10">
            {/* 關閉按鈕 */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-2 left-2 bg-white text-black rounded-full p-2 hover:bg-gray-200 shadow"
            >
              ✕
            </button>

            <img
              src={selectedImg}
              alt="Preview"
              className="max-w-full max-h-screen object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
