<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '#app'
import { supabase } from '~/utils/supabase'
import BackToTop from '~/components/BackToTop.vue'
import NavMenu from '~/components/NavMenu.vue'

// Toast UI 樣式
import '@toast-ui/editor/dist/toastui-editor-viewer.css'


// 路由設定
const route = useRoute()
const postId = route.params.id
const router = useRouter()

// ✅ 點擊圖片 10 次跳轉編輯頁面
let clickCount = 0
let clickTimer: any

const handleSecretClick = () => {
  clickCount++

  clearTimeout(clickTimer)
  clickTimer = setTimeout(() => {
    clickCount = 0
  }, 3000)

  if (clickCount >= 10 && post.value?.id) {
    router.push(`/post/edit/${post.value.id}`) // ✅ 正確路由格式
  }
}


// 狀態
const menuOpen = ref(false)
const post = ref<any>(null)
const loading = ref(true)
const errorMsg = ref('')
const currentUrl = ref('')


// 分享到threads
const copyToClipboard = async () => {
  try {
    const url = window.location.href // ✅ 直接在 function 裡取得，不宣告全域變數
    await navigator.clipboard.writeText(url)
    alert('📋 已複製連結，請前往 Threads 貼上分享！')
    window.open('https://www.threads.net/', '_blank')
  } catch (err) {
    alert('❌ 複製失敗，請手動複製網址')
  }
}


// 拿網址（for 分享）
if (process.client) {
  currentUrl.value = window.location.href
}

// 文章資料
onMounted(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (data) {
    post.value = {
      ...data,
      tags: JSON.parse(data.tags || '[]')
    }
    console.log('post:', post.value)
  } else if (error) {
    errorMsg.value = '文章載入失敗：' + error.message
    console.error(error)
  }

  loading.value = false
})

// SEO
watch(post, () => {
  if (!post.value) return

  useHead({
    title: `${post.value.title}｜九又四分之三月台`,
    meta: [
      { name: 'description', content: post.value.desc || '歡迎閱讀我的部落格文章！' },
      { name: 'author', content: post.value.author || 'Andrew Chou' },
      { name: 'keywords', content: post.value.tags?.join(', ') || '攝影, 相機, 部落格' },

      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: post.value.title },
      { property: 'og:description', content: post.value.desc || '歡迎閱讀我的部落格文章！' },
      {
        property: 'og:image',
        content: post.value.image_url || 'https://daily-prophet-pi.vercel.app/og-default.png'
      },
      {
        property: 'og:url',
        content: `https://daily-prophet-pi.vercel.app/post/${postId}`
      },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: post.value.title },
      { name: 'twitter:description', content: post.value.desc || '歡迎閱讀我的部落格文章！' },
      {
        name: 'twitter:image',
        content: post.value.image_url || 'https://daily-prophet-pi.vercel.app/og-default.png'
      }
    ],
    link: [
      { rel: 'canonical', href: `https://daily-prophet-pi.vercel.app/post/${postId}` }
    ]
  })
})
</script>

<template>
  <div class="wrapper">
    <section class="post-header">
      <div class="post-banner">
        <img src="/posttitle.png" alt="安卓預言家日報標頭" class="paper-title-img" @click="handleSecretClick" />
      </div>
    </section>
 <!-- <NuxtLink v-if="post" :to="`/post/edit/${post.id}`" class="edit-btn">
    ✏️ 編輯文章
  </NuxtLink> -->



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

      <!-- 社群分享 -->
      <div class="social-share">
        <strong>分享：</strong>
        <a
          :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`"
          target="_blank"
          rel="noopener"
          class="share-icon fb"
          aria-label="Facebook"
        >
          <i class="fab fa-facebook-f"></i>
        </a>
        <a
          :href="`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`"
          target="_blank"
          rel="noopener"
          class="share-icon line"
          aria-label="LINE"
        >
          <i class="fab fa-line"></i>
        </a>
        <!-- Threads (手動複製 + 導向) -->
       <a
         href="https://www.threads.net/"
         target="_blank"
         rel="noopener"
         class="share-icon threads"
         aria-label="Threads"
         @click.prevent="copyToClipboard"
       >
         <i class="fab fa-threads"></i>
       </a>

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

.toastui-editor-contents h2 {
    font-size: 22px;
    line-height: 23px;
    border-bottom: 0px solid #ffffff !important;
    margin: 20px 0 13px 0;
    padding-bottom: 7px;
}

.toastui-editor-contents table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  margin: 1rem 0;
}

.toastui-editor-contents th {
  background-color: #3e3e3e;
  color: #fff;
  font-weight: bold;
  padding: 0.8rem;
  text-align: left;
}

.toastui-editor-contents td {
  background-color: #fdfcf9;
  padding: 0.8rem;
  border: 1px solid #ddd;
  color: #333;
  vertical-align: top;
}


.post {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: bold;
}
.wrapper {
  position: relative;
  max-width: 1200px;
  margin: 3rem auto 2rem;
  margin-top: 8%;
  padding: 0 1rem;
  font-family: 'Noto Sans TC', sans-serif;
  z-index: 0;
  background-color: rgb(254, 248, 241);
}

.wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* ✅ 關鍵：偽元素會撐滿 wrapper 的內容高度 */
  background-image: url('/paperboard-texture.jpg');
  background-size: auto;
  background-repeat: repeat;
  opacity: 0.4;
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
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #ffffff;
  background-color: rgb(196, 0, 0);
  text-decoration: none;
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.back-btn:hover {
  background-color: #3e1f0d;
  color: #fff;
}

.post-header {
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin: 1rem auto 0; */
  padding-top: 30px; 
  max-width: 18%;
  margin-top: 0rem;
}

@media (max-width: 600px) {
  .post-header {
    margin-top: 6rem;
    margin-bottom: 0;
    padding-top: 3rem;
    max-width: 40%;
    /* margin: 1rem auto 0;  */
    text-align: center;
  }
}

/* 社群分享 */
.social-share {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.social-share strong {
  margin-right: 0.5rem;
  color: #3e1f0d;
}

.share-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: transform 0.2s ease, opacity 0.3s ease;
}

.share-icon:hover {
  transform: scale(1.1);
  opacity: 0.85;
}

.share-icon.fb {
  background-color: #3b5998;
}

.share-icon.line {
  background-color: #00c300;
}

.share-icon.threads{
  background-color: #000000;
}



</style>
