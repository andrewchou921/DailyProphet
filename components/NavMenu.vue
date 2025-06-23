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
</script>

<template>
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
        rel="noopener noreferrer"
      >
        前往作品集
      </a>
    </nav>
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
  padding: 1rem 1.5rem;
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: #3e1f0d;
  color: #fff;
  font-family: 'Georgia', serif;
  border-bottom: 1px solid #eaeaea;
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

/* 漢堡按鈕樣式 */
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

/* 手機版選單樣式 */
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
