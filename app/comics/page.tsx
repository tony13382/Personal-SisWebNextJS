'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Comic = {
  id: string
  title: string
  cover: string
  tags: string[]
  folder_name: string
}

export default function ComicPage() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])
  const [comics, setComics] = useState<Comic[]>([])
  const [activeTag, setActiveTag] = useState<string>('全部')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('auth=true')
    if (!isLoggedIn) {
      router.push('/')
    } else {
      fetch('/api/comics')
        .then(res => res.json())
        .then(data => {
          setTags(['全部', ...data.tags])
          setComics(data.comics)
          setLoading(false)
        })
    }
  }, [])

  const filtered = comics
    .filter(comic => activeTag === '全部' || comic.tags.includes(activeTag))
    .sort((a, b) => a.title.localeCompare(b.title))

  const grouped = filtered.reduce<Record<string, Comic[]>>((acc, comic) => {
    if (!acc[comic.folder_name]) acc[comic.folder_name] = []
    acc[comic.folder_name].push(comic)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">漫畫分類</h1>

      {/* Tag Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-sm ${activeTag === tag
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grouped Comics */}
      {loading ? (
        <p>載入中...</p>
      ) : (
        Object.entries(grouped).map(([folder, items]) => (
          <div key={folder} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{folder}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map(comic => (
                <div
                  key={comic.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/comics/${comic.id}`)}
                >
                  <img
                    src={comic.cover}
                    alt={comic.title}
                    className="w-full h-auto rounded shadow hover:scale-105 transition"
                  />
                  <p className="text-sm mt-1 text-center">{comic.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
