<script setup>
import { useHead } from '#app'

useHead({
  titleTemplate: '%s - 安卓部落格',
  meta: [
    { name: 'author', content: 'Andrew Chou' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'google-site-verification',
      content: 'NRSu7JLVJg3AASfOMz_r7XU_d_3THDaTmfXxWMs4xiQ'
    }
  ]
})
</script>

<template>
  <NuxtPage />
</template>
