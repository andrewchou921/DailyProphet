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
  ],
  script: [
    {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=G-L875TBWW6W'
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-L875TBWW6W');
      `
    }
  ]
})
</script>

<template>
  <NuxtPage />
</template>
