<!-- /pages/post/index.vue -->
<template>
  <div class="container">
    <h1>所有貼文</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="`/post/${post.id}`">
          {{ post.title }} - {{ post.date }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '~/utils/supabase'

const posts = ref<any[]>([])

onMounted(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })

  if (data) posts.value = data
  if (error) console.error(error)
})
</script>

<style scoped>
.container {
  padding: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 1rem;
}
</style>
