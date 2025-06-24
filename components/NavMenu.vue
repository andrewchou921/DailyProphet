<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  onMenuToggle?: (val: boolean) => void
}>()

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// 每當 showMenu 改變時，通知父層
watch(showMenu, (val) => {
  props.onMenuToggle?.(val)
})

// 點完關掉選單
const emit = defineEmits(['categorySelected'])

const selectCategory = (category: string) => {
  emit('categorySelected', category)
  showMenu.value = false 
}

</script>

<template>
  <header class="navbar">
    <div class="logo">
      <img src="/logo-banner.png" alt="LOGO" />
    </div>

    <!-- ✅ 漢堡圖示按鈕 -->
    <button class="menu-toggle" @click="toggleMenu">
      <img src="/icons/gryffindor.png" alt="Gryffindor Menu" class="gryffindor-icon" />
    </button>

    <nav class="menu" :class="{ open: showMenu }">
     <!-- ✅ 用 selectCategory 發送事件 -->
     <a href="#" @click.prevent="selectCategory('全部')">全部貼文</a>
     <a href="#" @click.prevent="selectCategory('學習筆記')">學習筆記</a>
     <a href="#" @click.prevent="selectCategory('生活紀錄')">生活紀錄</a>
      <a
        href="https://andrewchou921.github.io/work/"
        class="portfolio-btn"
        @click="showMenu = false"
        target="_blank"
        rel="noopener noreferrer"
      >
        前往作品集
      </a>
    </nav>

    <!-- ✅ 點選遮罩也會關閉選單 -->
    <div class="overlay" v-if="showMenu" @click="showMenu = false"></div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem 0 1.5rem;
  background-color: #3e1f0d;
  color: #fff;
  font-family: 'Georgia', serif;
  border-bottom: 1px solid #eaeaea;
}

.navbar {
  padding-top: 0 !important;
}

.logo img {
  height: 70px;
  object-fit: contain;
}

@media (max-width: 600px) {
  .logo img {
    height: 50px;
  }
}

/* 主要導覽選單 */
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

/* 漢堡圖示按鈕（預設隱藏） */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  z-index: 300;
}

/* 圖示樣式 */
.menu-toggle img.gryffindor-icon {
  width: 40px;
  height: auto;
  border-radius: 50%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}



/* 手機版選單 */
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
</style>
