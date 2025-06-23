<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { supabase } from '~/utils/supabase'

const title = ref('')
const summary = ref('') // ✅ 新增 summary 欄位
const content = ref('')
const htmlContent = ref('')
const date = ref('')
const author = ref('')
const tags = ref('')
const imageFile = ref<File | null>(null)
const loading = ref(false)

let editorInstance: any
const { $toastEditor } = useNuxtApp()
const router = useRouter()

const successMessage = ref('')
const errorMessage = ref('')

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#>*_~\-]+/g, '')
    .replace(/\n/g, ' ')
    .trim()
}

onMounted(() => {
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
  } else {
    console.error('❌ toastEditor 尚未載入')
  }

  date.value = new Date().toISOString().split('T')[0]
})

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    imageFile.value = target.files[0]
  }
}

const submitPost = async () => {
  if (loading.value) return
  loading.value = true

  if (!title.value || !content.value || !date.value || !author.value) {
    errorMessage.value = '❌ 請填寫所有必填欄位'
    successMessage.value = ''
    loading.value = false
    return
  }

  if (imageFile.value && imageFile.value.size > 2 * 1024 * 1024) {
    errorMessage.value = '❌ 圖片大小不能超過 2MB'
    loading.value = false
    return
  }

  let imageUrl = ''
  if (imageFile.value) {
    const fileName = `${Date.now()}_${imageFile.value.name}`
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, imageFile.value)

    if (uploadError) {
      errorMessage.value = '❌ 圖片上傳失敗：' + uploadError.message
      loading.value = false
      return
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(fileName)
    imageUrl = data.publicUrl
  }

  // ✅ 使用手動 summary，若沒填則自動產生
  const finalSummary = summary.value.trim() || stripMarkdown(content.value).slice(0, 100)

  const { error } = await supabase.from('posts').insert([{
    title: title.value,
    summary: finalSummary,
    content: content.value,
    html: htmlContent.value,
    date: date.value,
    author: author.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
    image_url: imageUrl
  }])

  if (error) {
    errorMessage.value = error.message
    successMessage.value = ''
  } else {
    successMessage.value = '✅ 文章發布成功！'
    errorMessage.value = ''
    title.value = ''
    summary.value = ''
    content.value = ''
    htmlContent.value = ''
    date.value = new Date().toISOString().split('T')[0]
    author.value = ''
    tags.value = ''
    imageFile.value = null
    editorInstance.setMarkdown('')
    setTimeout(() => {
      router.push('/posts')
    }, 1500)
  }

  loading.value = false
}
</script>

<template>
  <div class="form-container">
    <h1>新增文章</h1>

    <div class="form-field">
      <label>標題 *</label>
      <input v-model="title" type="text" />
    </div>

    <div class="form-field">
      <label>描述 / 摘要（可選填）</label>
      <textarea v-model="summary" rows="3" placeholder="請輸入文章描述..."></textarea>
    </div>

    <div class="form-field">
      <label>內容（支援 Markdown） *</label>
      <div id="editor" />
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

    <div class="form-field">
      <label>上傳封面圖片</label>
      <input type="file" accept="image/*" @change="handleImageChange" />
    </div>

    <button :disabled="loading" @click="submitPost">
      {{ loading ? '發佈中...' : '🚀 發佈文章' }}
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
