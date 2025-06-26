// server/api/generate-sitemap.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data, error } = await supabase.from('posts').select('id')

  if (error || !data) {
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return '❌ sitemap 產生失敗'
  }

  // ✅ 使用你部署用的網域
  const DOMAIN = 'https://daily-prophet.vercel.app'

  const urls = data.map((post: { id: string }) =>
    `<url><loc>${DOMAIN}/post/${post.id}</loc></url>`
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${DOMAIN}/</loc></url>
${urls.join('\n')}
</urlset>`

  // ✅ 輸出 sitemap.xml 到 public/
  fs.writeFileSync(path.resolve('public/sitemap.xml'), xml)

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return '✅ sitemap.xml 已成功產生'
})
