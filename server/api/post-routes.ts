// server/api/post-routes.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data, error } = await supabase.from('posts').select('id')

  if (error) {
    console.error('取得文章路由失敗', error)
    return []
  }

  return data.map((post: { id: string }) => `/post/${post.id}`)
})
