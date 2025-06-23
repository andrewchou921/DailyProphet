<script setup lang="ts">
const props = defineProps<{ hidden?: boolean }>()

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <button
    @click="scrollToTop"
    class="back-to-top"
    :class="{ hidden: props.hidden }"
  >
    <img src="/back-to-top-golden-snitch.png" alt="回頂部" class="snitch-icon" />
  </button>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 0;
  right: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.back-to-top.hidden {
  opacity: 0;
  pointer-events: none;
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
    right: 0;
    bottom: 0;
    width: 100px;
  }

  .back-to-top img.snitch-icon {
    width: 120px;
  }
}
</style>
