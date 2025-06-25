<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '~/utils/supabase'
import BackToTop from '~/components/BackToTop.vue'
import NavMenu from '~/components/NavMenu.vue'


// 套用 Toast UI Viewer 樣式
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

// 頂部按鈕消失
const menuOpen = ref(false)

const route = useRoute()
const postId = route.params.id

const post = ref(null)
const loading = ref(true)
const errorMsg = ref('')

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


onMounted(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (data) {
    post.value = data
  } else if (error) {
    errorMsg.value = '文章載入失敗：' + error.message
    console.error(error)
  }

  if (data) {
  post.value = {
    ...data,
    tags: JSON.parse(data.tags || '[]')  // ✅ 加這行解析 tags
  }
}

  loading.value = false
})
</script>

<template>
  
  <div class="wrapper">
    <NavMenu :onMenuToggle="(val) => (menuOpen = val)" />
    <div v-if="loading">載入中...</div>

    <div v-else-if="errorMsg">
      <p style="color: red">{{ errorMsg }}</p>
    </div>

    <main v-else class="post">
      <NuxtLink to="/" class="back-btn">← 返回首頁</NuxtLink>
      <h1 class="post-title">{{ post.title }}</h1>
      <p class="post-meta">
        📌 {{ post.tags?.[0] || '未分類' }} ｜ {{ post.date }} ｜ {{ post.author }}
      </p>
      <img v-if="post.image_url" :src="post.image_url" alt="文章圖片" class="post-image" />

      <!-- 使用 html 欄位渲染 -->
      <article class="post-content toastui-editor-contents" v-html="post.html" />

      <div class="tag-area" v-if="post.tags">
        <strong>標籤：</strong>
        <span
          class="tag"
          v-for="tag in Array.isArray(post.tags) ? post.tags : post.tags.split(',')"
          :key="tag"
        >
          {{ tag }}
        </span>
      </div>
    </main>
  </div>
   <BackToTop :hidden="menuOpen" />
  <footer>Copyright © Andrew Portfolio Website 2025</footer>
</template>

<style scoped>

.toastui-editor-contents {
  font-family: 'Noto Sans TC', sans-serif !important;
}


.post {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: bold;
}
.wrapper {
  position: relative;
  max-width: 1200px;
  margin: 6rem auto 2rem;
  padding: 0 1rem;
  font-family: 'Noto Sans TC', sans-serif;
  z-index: 0;
  background-color: rgb(254, 248, 241);
}

.wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/paperboard-texture.jpg'); 
  background-size: cover;
  opacity: 0.6; /* ✅ 透明度：0（完全透明）～1（完全不透明） */
  background-repeat: no-repeat;
  background-blend-mode: multiply;
  z-index: -1;
}

.post-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.post-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.post-meta {
  font-size: 0.875rem;
  color: #777;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
}

.post-content {
  margin-bottom: 2rem;
  line-height: 1.8;
  color: #444;
  font-size: 1rem;
}

.tag-area {
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgb(62, 31, 13);
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.875rem;
  color: #fff;
}

footer {
  text-align: center;
  padding: 1.5rem 0;
  font-size: 0.875rem;
  color: #ffffff;
  font-family: 'Noto Sans TC', sans-serif;
}

/* 返回按鈕 */
.back-btn {
  display: inline-block;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #ffffff;
  background-color: rgb(196, 0, 0);
  text-decoration: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.back-btn:hover {
  background-color: #3e1f0d;
  color: #fff;
}



</style>
