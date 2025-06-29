<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useHead, useRouter } from '#app'
import { supabase } from '~/utils/supabase'
import NavMenu from '~/components/NavMenu.vue'
import BackToTop from '~/components/BackToTop.vue'



const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

// 篩選標籤
const selectedCategory = ref('全部')

const filteredPosts = computed(() => {
  if (selectedCategory.value === '全部') return posts.value
  return posts.value.filter(post => post.tags?.[0] === selectedCategory.value)
})


function handleCategoryChange(category: string) {
  selectedCategory.value = category
}

// 🔧 你的分頁變數（如果還沒定義）
const currentPage = ref(1)
const postsPerPage = 3 //分頁貼文數量

// 🔧 分頁後的貼文
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

// ✅ 用來捲動的區塊參考
const postSection = ref<HTMLElement | null>(null)

// ✅ 點擊分頁按鈕時會更新分頁並滾動到文章區
function goToPage(page: number) {
  currentPage.value = page
  nextTick(() => {
    postSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}


// 頂部按鈕消失
const menuOpen = ref(false)

const showMenu = ref(false)
const posts = ref<any[]>([])

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// tags 字串轉陣列
onMounted(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })

  if (data) {
    posts.value = data.map(post => {
      return {
        ...post,
        tags: JSON.parse(post.tags || '[]') // ✅ 解析 tags 字串為陣列
      }
    })
  }
  if (error) console.error(error)
})


// onMounted(async () => {
//   const { data, error } = await supabase
//     .from('posts')
//     .select('*')
//     .order('date', { ascending: false })

//   if (data) posts.value = data
//   if (error) console.error(error)
// })

useHead({
  title: '九又四分之三月台',
  meta: [{ name: 'description', content: '歡迎來到安卓的技術與生活部落格！' }]
})
</script>

<template>
  <div class="wrapper">
    <NavMenu :onMenuToggle="(val) => (menuOpen = val)" @categorySelected="handleCategoryChange" />

    <section class="paper-header">
      <div class="paper-banner">
        <img src="/title.png" alt="安卓預言家日報標頭" class="paper-title-img" />
      </div>
    </section>

    <!-- 主標題 -->
    <section class="card-section" ref="postSection">
      <main>
        <!-- <NuxtLink to="/post">文章</NuxtLink>
        <NuxtLink to="/admin">新增文章</NuxtLink> -->

        <!-- ✅ 最新文章（只顯示篩選後的第一篇） -->
        <Transition name="fade">
          <section class="latest-post" v-if="filteredPosts.length&& currentPage === 1 && selectedCategory === '全部'">
            <NuxtLink :to="`/post/${filteredPosts[0].id}`" class="thumbnail">
              <img :src="filteredPosts[0].image_url || '/default.jpg'" alt="封面圖片" />
            </NuxtLink>
            <div class="latest-content">
              <p class="date">
                🎩 {{ filteredPosts[0].tags?.[0] || '未分類' }} ｜ {{ filteredPosts[0].date }}
              </p>
              <h2>
                <NuxtLink :to="`/post/${filteredPosts[0].id}`">
                  {{ filteredPosts[0].title }}
                </NuxtLink>
              </h2>
              <p class="desc">
                {{ filteredPosts[0].summary || filteredPosts[0].content.slice(0, 40) }}...
              </p>
              <div class="author">
                <div class="avatar-wrapper">
                  <img
                    class="avatar-img"
                    :src="filteredPosts[0].author_image || '/author.jpg'"
                    alt="作者頭像" />
                </div>
                <span class="author-name">{{ filteredPosts[0].author }}</span>
              </div>
            </div>
          </section>
        </Transition>

        <!-- ✅ 其他文章區塊 -->
        <TransitionGroup name="fade" tag="section" class="card-grid">
          <NuxtLink
            v-for="post in paginatedPosts"
            :key="post.id"
            :to="`/post/${post.id}`"
            class="card"
          >
            <div class="thumbnail">
              <img :src="post.image_url || '/default.jpg'" alt="封面圖" />
            </div>
            <p class="date">
              ✨ {{ post.tags?.[0] || '未分類' }} ｜ {{ post.date }}
            </p>
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="desc">{{ post.summary || post.content.slice(0, 40) }}...</p>
            <div class="author">
              <div class="avatar-wrapper">
                <img
                  class="avatar-img"
                  :src="post.author_image || '/author.jpg'"
                  alt="作者頭像" />
              </div>
              <span class="author-name">{{ post.author }}</span>
            </div>
          </NuxtLink>
        </TransitionGroup>

        <!-- ✅ 分頁按鈕 -->
        <div class="pagination">
          <button
            v-for="n in totalPages"
            :key="n"
            :class="{ active: currentPage === n }"
            @click="goToPage(n)"
          >
            {{ n }}
          </button>
        </div>
      </main>
    </section>

    <footer>Copyright © Andrew Portfolio Website 2025</footer>
    <BackToTop :hidden="menuOpen" />
  </div>
</template>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card-title{
 margin-bottom: 0%;
 margin-top: 0% !important;
}

.card-section {
  /* background-color: #ead2ac; */
  /* background-image: url('/public/grunge.jpg');  ✅ 你的圖片路徑  */
  width: 100%;
  padding: 0;
  position: relative;  
  z-index: 1;
}

main {
  max-width: 1200px;
  margin: auto;
  padding: 0rem 1rem 2rem !important; /* 👈 這裡就是造成 padding 太大的主因 */
}

body {
  font-family: 'Noto Serif TC', serif;
  background-color: #ead2ac;
  color: #3e1f0d;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

.wrapper {
  font-family: 'Noto Sans TC', Arial, sans-serif;
  background-color: #ead2ac; /* 與 body 一樣 */
  width: 100%;
}


.logo img {
  height: 70px; /* 或其他你想要的高度 */
  object-fit: contain;
}



.title {
  font-size: 2.5rem;
  text-align: left;
  font-weight: bold;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}

/* 最新文章區塊 */
.latest-post {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 2rem;
  background: #d7b892;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  position: relative;
  /* border: 3px solid #3e1f0d; */
  color: #3e1f0d;
  justify-content: space-between; /* ⬅️ 關鍵：確保底部作者資訊對齊 */
}

.latest-post .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #ccc;
  border-radius: 6px;
  overflow: hidden;
}


.latest-post .thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  z-index: 0;
}

/* ✅ 最新貼文：加入模糊遮罩 + 濾鏡 + 放大效果 */
.latest-post .thumbnail {
  position: relative;
  overflow: hidden;
}

.latest-post .thumbnail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
  transition: opacity 0.3s ease;
  opacity: 0;
  z-index: 1;
}

.latest-post .thumbnail:hover::before {
  opacity: 1;
}

.latest-post .thumbnail img {
  transition: transform 0.5s ease, filter 0.5s ease;
  filter: brightness(0.95) contrast(1);
}

.latest-post .thumbnail:hover img {
  transform: scale(1.05);
  filter: brightness(1) contrast(1.1);
}


/* 文章資訊 */
.latest-content .date {
  font-size: 1rem;
  color: rgb(62, 31, 13);
  margin-bottom: 0.5rem;
}

.latest-content h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.latest-content .desc {
  font-size: 0.9rem;
  color: rgb(62, 31, 13);
  margin-bottom: 1rem;
}
/* 手機版最新貼文不要顯示 */
@media (max-width: 600px) {
  .latest-post {
    display: none;
  }
}


/* 卡片區 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.card {
  background: #d7b892;
  padding: 1.5rem;
  border-radius: 10px;
  /* border: 3px solid #3e1f0d; */
  color: #3e1f0d;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease;
  z-index: 1;
  justify-content: space-between; /* ⬅️ 關鍵：確保底部作者資訊對齊 */
}

.card:hover {
  transform: translateY(-4px);
}

.card .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #ccc;
  border-radius: 12px;
  overflow: hidden;
}

/* 滑鼠滑入圖片放大（zoom-in）效果 */
.card .thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card .thumbnail img,
.latest-post .thumbnail img {
  transition: transform 0.6s ease;
}

.card .thumbnail:hover img,
.latest-post .thumbnail:hover img {
  transform: scale(1.08); /* 放大 8% */
}

/* 加入模糊遮罩 + 放大 + 漸變濾鏡（高級雜誌風格） */
.card .thumbnail {
  position: relative;
  overflow: hidden;
}

.card .thumbnail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
  transition: opacity 0.3s ease;
  opacity: 0;
  z-index: 1;
}

.card .thumbnail:hover::before {
  opacity: 1;
}

.card .thumbnail img {
  transition: transform 0.5s ease, filter 0.5s ease;
  filter: brightness(0.95) contrast(1);
}

.card .thumbnail:hover img {
  transform: scale(1.05);
  filter: brightness(1) contrast(1.1);
}


.card .meta {
  font-size: 0.75rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.card .category {
  background: #3e1f0d;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.card h3 {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.card .desc {
  font-size: 0.9rem;
  color: #3e1f0d;
  margin: 0rem 0;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0rem;
}

.avatar-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #3e1f0d;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.author-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #3e1f0d;
}


/* 分頁按鈕 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.pagination button {
  width: 40px;
  height: 40px;
  border: none;
  background: rgb(196, 0, 0);
  border-radius: 6px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease; /* ✅ 重點 */
}
.pagination button:hover {
  background-color: #3e1f0d;
  color: #fff;
}

.pagination button.active {
  background: #3e1f0d;
  color: white;
}

/* 頁尾與返回 */
footer {
  padding: 1rem;
  font-size: 0.75rem;
  text-align: center;
  background: rgb(62, 31, 13);
  color: #fff;
  border-top: 1px solid #3e1f0d;
}

/* 回到頂部按鈕 */
.back-to-top {
  position: fixed;
  bottom: 0rem;
  right: 0rem; 
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.back-to-top img.snitch-icon {
  width: 160px;
  height: auto;
  transition: transform 0.3s ease;
}

.back-to-top:hover img.snitch-icon {
  transform: scale(1.1) rotate(10deg);
}
@media (max-width: 600px) {
  .back-to-top {
    right: 0rem;
    bottom: 0%;
    width: 100px;
  }
  .back-to-top img.snitch-icon {
  width: 120px;
  height: auto;
  transition: transform 0.3s ease;
}
}


/* 響應式設計 */
@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .latest-post {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .portfolio-btn {
    width: 100%;
    text-align: center;
  }
}

/* 漢堡選單 */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  margin-left: auto;
  z-index: 300;
  color: #F0DBC0;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .menu {
    position: fixed;
    top: 0;
    right: -260px;
    width: 240px;
    height: 100vh;
    background: #37231B;
    flex-direction: column;
    padding: 2rem 1.5rem;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
    gap: 1rem;
    transition: right 0.3s ease-in-out;
    z-index: 250;
    display: flex;
  }

  .menu.open {
    right: 0;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 200;
  }
}

/* 超連結移除 */
.card {
  text-decoration: none !important;
  color: inherit !important;
}
.card:hover {
  text-decoration: none !important;
  color: inherit !important;
}


.card a,
.latest-post a,
.latest-post h2 a,
.card h3 a,
.card .desc a,
.latest-content .desc a,
.latest-content a {
  text-decoration: none !important;
  color: inherit !important;
  font-weight: inherit;
  cursor: pointer;
  display: inline;
  border: none !important;
  background: none;
}

.card a:hover,
.latest-post a:hover,
.latest-post h2 a:hover,
.card h3 a:hover,
.card .desc a:hover,
.latest-content .desc a:hover,
.latest-content a:hover {
  text-decoration: none !important;
  color: inherit !important;
}

.latest-post h2 a:hover,
.card h3 a:hover,
.card .desc a:hover,
.latest-content .desc a:hover {
  text-decoration: none;
}
.paper-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem auto 3rem;
  padding-top: 6rem;
  margin-bottom: 4rem;
  width: 100%;
  padding-top: 100px; /* 或根據 navbar 高度給 padding */
}

@media (max-width: 600px) {
  .paper-header {
    margin-top: 3rem;
    padding-top: 4rem;
    margin-bottom: 3rem;
  }
}

.paper-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.paper-title-img {
  width: 100%;
  max-width: 1000px;
  height: auto;
  object-fit: contain;
}

.paper-title-text {
  font-size: 2.2rem;
  font-weight: bold;
  margin-top: 1rem;
  color: #3e1f0d;
  font-family: 'Noto Serif TC', serif;
}

/* 手機版 */
@media (max-width: 600px) {
  .paper-title-img {
    width: 95%;
  }

  .paper-title-text {
    font-size: 1.5rem;
  }
}

..paper-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4rem auto 3rem;
  padding-top: 6rem;
  width: 100%;
  position: relative;
  background-color: #ead2ac;
  filter: contrast(0.96) brightness(1.03); /* 模擬紙張對比與亮度 */
}

@media (max-width: 600px) {
  .paper-header {
    margin-top: 3rem;
    padding-top: 4rem;
  }
}

.paper-header::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/rpbg.png'); /* 雜訊圖片路徑 */
  background-size: cover;
  background-size: 1400px auto; /* ✅ 雜訊圖片縮小 */
  opacity: 0.04; /* 雜訊強度 */
  pointer-events: none;
  z-index: 0;
    animation: noiseMove 11s linear infinite;
}

.paper-banner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.paper-title-img {
  width: 100%;
  max-width: 1000px;
  height: auto;
  object-fit: contain;
}

.paper-title-text {
  font-size: 2.2rem;
  font-weight: bold;
  margin-top: 1rem;
  color: #3e1f0d;
  font-family: 'Noto Serif TC', serif;
}

@media (max-width: 600px) {
  .paper-title-img {
    width: 95%;
  }

  .paper-title-text {
    font-size: 1.5rem;
  }
}

/* 動畫關鍵幀 */
@keyframes noiseMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 100px;
  }
}

/* 淡入淡出動畫樣式 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}




</style>
