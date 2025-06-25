// server/api/post-routes.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.from('posts').select('id')

  if (error) {
    console.error('取得文章路由失敗', error)
    return { data: [] }
  }

  const routes = data.map((post: { id: string }) => `/post/${post.id}`)
  return { data: routes }
})
