import { NextRequest, NextResponse } from 'next/server'

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2021-05-13'
const NOTION_TOKEN = "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"
const TAG_DB_ID = '1cb57efa8a9b80bf8b19e630f0875c38'

async function fetchTagTypeMap() {
    const res = await fetch(`${NOTION_API}/databases/${TAG_DB_ID}/query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
    })

    const json = await res.json()
    const typeMap: Record<string, string> = {}
    for (const item of json.results) {
        const title = item.properties.name.title?.[0]?.text?.content
        if (title) {
            typeMap[item.id] = title
        }
    }

    return typeMap
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const page_id = params.id
    if (!page_id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    try {
        const typeMap = await fetchTagTypeMap()

        // 取得頁面基本資訊
        const pageRes = await fetch(`${NOTION_API}/pages/${page_id}`, {
            headers: {
                Authorization: `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
            },
        })
        const pageData = await pageRes.json()

        const title = pageData.properties.name.title?.[0]?.text?.content || ''
        const tagIds = pageData.properties.tags.relation || []
        const tags = tagIds.map((tag: any) => typeMap[tag.id]).filter(Boolean)
        const memo =
            pageData.properties.memo.rich_text?.[0]?.text?.content || ''

        // 取得圖片 blocks
        const blocksRes = await fetch(`${NOTION_API}/blocks/${page_id}/children`, {
            headers: {
                Authorization: `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
            },
        })
        const blocksData = await blocksRes.json()

        const imgs = blocksData.results
            .filter((b: any) => b.type === 'image')
            .map((b: any) => b.image.file.url)

        return NextResponse.json({
            title,
            tags,
            memo,
            imgs,
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
