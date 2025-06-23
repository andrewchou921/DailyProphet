<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead, useRouter } from '#app'
import { supabase } from '~/utils/supabase'

const showMenu = ref(false)
const posts = ref<any[]>([])

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })

  if (data) posts.value = data
  if (error) console.error(error)
})

useHead({
  title: '安卓の部落格',
  meta: [{ name: 'description', content: '歡迎來到安卓的技術與生活部落格！' }]
})
</script>

<template>
  <div class="wrapper">
    <!-- 導覽列 -->
    <header class="navbar">
      <div class="logo">
        <img src="/logo-banner.png" alt="LOGO" />
      </div>
      <button class="menu-toggle" @click="toggleMenu">☰</button>
      <nav class="menu" :class="{ open: showMenu }">
        <a href="#" @click="showMenu = false">學習筆記</a>
        <a href="#" @click="showMenu = false">生活紀錄</a>
        <a
            href="https://andrewchou921.github.io/work/"
            class="portfolio-btn"
            @click="showMenu = false"
            target="_blank"
            rel="noopener noreferrer">
            前往作品集
        </a>
      </nav>
      <div class="overlay" v-if="showMenu" @click="showMenu = false"></div>
    </header>

<section class="paper-header">
  <div class="paper-banner">
    <img src="/title.svg" alt="安卓預言家日報標頭" class="paper-title-img" />
  </div>
</section>



    <!-- 主標題 -->
    <section class="card-section">
    <main>
      <NuxtLink to="/post">文章</NuxtLink>
      <NuxtLink to="/admin">新增文章</NuxtLink>
      <!-- 最新文章 -->
      <section class="latest-post" v-if="posts.length">
        <NuxtLink :to="`/post/${posts[0].id}`" class="thumbnail">
          <img :src="posts[0].image_url || '/default.jpg'" alt="封面圖片" />
        </NuxtLink>
        <div class="latest-content">
          <p class="date">📌 最新 ｜ {{ posts[0].date }}</p>
          <h2>
            <NuxtLink :to="`/post/${posts[0].id}`">{{ posts[0].title }}</NuxtLink>
          </h2>
          <p class="desc">{{ posts[0].content.slice(0, 40) }}...</p>
          <div class="author">
            <div class="avatar"></div>
            <span>{{ posts[0].author }}</span>
          </div>
        </div>
      </section>

      <!-- 其他文章 -->
      <section class="card-grid">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/post/${post.id}`"
          class="card"
        >
          <div class="thumbnail">
            <img :src="post.image_url || '/default.jpg'" alt="封面圖" />
          </div>
          <p class="date">📌 類型 ｜ {{ post.date }}</p>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="desc">{{ post.content.slice(0, 40) }}...</p>
          <div class="author">
            <div class="avatar"></div>
            <span>{{ post.author }}</span>
          </div>
        </NuxtLink>
      </section>

      <div class="pagination">
        <button v-for="n in 4" :key="n">{{ n }}</button>
      </div>
    </main>
    </section>

    <footer>Copyright © Andrew Portfolio Website 2025</footer>
    <button @click="scrollToTop" class="back-to-top">
      <img src="/back-to-top-golden-snitch.png" alt="回頂部" class="snitch-icon" />
    </button>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card-section {
  background-color: #ead2ac;
  /* background-image: url('/public/grunge.jpg');  ✅ 你的圖片路徑  */
  width: 100%;
  padding: 0;
  position: relative;  /* ✅ 加這行 z-index 才有效 */
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

/* 導覽列 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem; /* 原本是 3rem，改小讓整體內容靠近邊緣 */
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: #3e1f0d;
  color: #fff;
  font-family: 'Georgia', serif;
  border-bottom: 1px solid #eaeaea;
}

.logo img {
  height: 70px; /* 或其他你想要的高度 */
  object-fit: contain;
}

/* 手機板：畫面寬度小於 600px 時套用 */
@media (max-width: 600px) {
  .logo img {
    height: 50px;
  }
}

.menu {
  display: flex;
  color: #fff;
  gap: 1.5rem;
  align-items: center;
  font-family: 'Noto Sans TC', sans-serif;
}

.menu a {
  text-decoration: none;
  color: #fff;
  font-size: 0.95rem;
}

.portfolio-btn {
  background: #c40000;
  color: white !important;
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
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


/* 文章資訊 */
.latest-content .date {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.latest-content h2 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.latest-content .desc {
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 1rem;
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
  margin: 0.5rem 0;
}

.card .author {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: bold;
  font-size: 0.85rem;
}

.card .avatar {
  width: 32px;
  height: 32px;
  background: #3e1f0d;
  border-radius: 50%;
}

/* 分頁 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.pagination button {
  width: 32px;
  height: 32px;
  border: none;
  background: #eee;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
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
  margin: 4rem auto 3rem;
  padding-top: 6rem;
  width: 100%;
  padding-top: 100px; /* 或根據 navbar 高度給 padding */
}

@media (max-width: 600px) {
  .paper-header {
    margin-top: 3rem;
    padding-top: 4rem;
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
  opacity: 0.1; /* 雜訊強度 */
  pointer-events: none;
  z-index: 0;
    animation: noiseMove 25s linear infinite;
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


</style>
