<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { supabase } from '~/utils/supabase'

const router = useRouter()
const route = useRoute()
const postId = route.params.id as string

const title = ref('')
const summary = ref('')
const content = ref('')
const htmlContent = ref('')
const date = ref('')
const author = ref('')
const tags = ref('')
const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const loading = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

let editorInstance: any
const { $toastEditor } = useNuxtApp()

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#>*_~\-]+/g, '')
    .replace(/\n/g, ' ')
    .trim()
}

onMounted(async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()
  if (!session) {
    router.push('/login')
    return
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (error || !data) {
    errorMessage.value = '❌ 找不到文章或載入失敗'
    return
  }

  title.value = data.title
  summary.value = data.summary || ''
  content.value = data.content
  htmlContent.value = data.html
  date.value = data.date
  author.value = data.author
  tags.value = (data.tags || []).join(',')
  imageUrl.value = data.image_url || ''

  await nextTick()
  if ($toastEditor) {
    editorInstance = new $toastEditor({
      el: document.querySelector('#editor')!,
      height: '300px',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      events: {
        change: () => {
          content.value = editorInstance.getMarkdown()
          htmlContent.value = editorInstance.getHTML()
        }
      }
    })
    editorInstance.setMarkdown(data.content)
  }
})

const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  imageFile.value = file
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `post-images/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(filePath, file)

  if (uploadError) {
    errorMessage.value = '❌ 圖片上傳失敗'
    return
  }

  imageUrl.value = supabase.storage.from('post-images').getPublicUrl(filePath).data.publicUrl
}

const handleInsertImage = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files?.length) return

  const files = Array.from(target.files)
  let markdownToInsert = ''

  for (const [index, file] of files.entries()) {
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = `❌ 圖片 ${file.name} 太大（限 2MB）`
      continue
    }

    const fileName = `${Date.now()}_${index}_${file.name.slice(0, 30)}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file)

    if (uploadError) {
      errorMessage.value = `❌ 上傳 ${file.name} 失敗：${uploadError.message}`
      continue
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(fileName)
    const imageUrl = data.publicUrl
    markdownToInsert += `\n\n![圖片](${imageUrl})\n\n`
  }

  if (markdownToInsert) {
    content.value += markdownToInsert
    editorInstance.setMarkdown(content.value)
  }
}

const updatePost = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const { error } = await supabase
    .from('posts')
    .update({
      title: title.value,
      summary: summary.value,
      content: content.value,
      html: htmlContent.value,
      date: date.value,
      author: author.value,
      tags: tags.value.split(',').map(tag => tag.trim()),
      image_url: imageUrl.value || null
    })
    .eq('id', postId)

  loading.value = false

  if (error) {
    errorMessage.value = '❌ 更新失敗：' + error.message
  } else {
    successMessage.value = '✅ 文章已成功更新！'
  }
}
</script>

<template>
  <div class="form-container">
    <h1>編輯文章</h1>

    <div class="form-field">
      <label>標題 *</label>
      <input v-model="title" type="text" />
    </div>

    <div class="form-field">
      <label>描述 / 摘要</label>
      <textarea v-model="summary" rows="3" />
    </div>

    <div class="form-field">
      <label>內容 *</label>
      <div id="editor" />
    </div>

    <div class="form-field">
      <label>插入圖片到內容（可多選）</label>
      <input type="file" accept="image/*" multiple @change="handleInsertImage" />
    </div>

    <div class="form-field">
      <label>封面圖片</label>
      <input type="file" accept="image/*" @change="handleImageChange" />
      <img v-if="imageUrl" :src="imageUrl" style="margin-top:1rem; max-width:200px" />
    </div>

    <div class="form-field">
      <label>日期 *</label>
      <input v-model="date" type="date" />
    </div>

    <div class="form-field">
      <label>作者 *</label>
      <input v-model="author" type="text" />
    </div>

    <div class="form-field">
      <label>標籤（用 , 分隔）</label>
      <input v-model="tags" type="text" />
    </div>

    <button :disabled="loading" @click="updatePost">
      {{ loading ? '更新中...' : '💾 更新文章' }}
    </button>

    <p v-if="successMessage" style="color: green; margin-top: 1rem">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red; margin-top: 1rem">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 6rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  font-family: 'Noto Sans TC', sans-serif;
}
.form-field {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}
input, textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}
button {
  background: black;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
