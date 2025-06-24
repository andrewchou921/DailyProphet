<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '~/utils/supabase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const router = useRouter()

const login = async () => {
  loading.value = true
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMessage.value = '❌ 登入失敗：' + error.message
  } else {
    router.push('/admin') // ✅ 登入成功導向 admin 頁面
  }

  loading.value = false
}
</script>

<template>
  <div class="login-wrapper">
    <h1>🔐 登入管理後台</h1>
    <div class="form-field">
      <label>Email</label>
      <input v-model="email" type="email" placeholder="請輸入 Email" />
    </div>
    <div class="form-field">
      <label>密碼</label>
      <input v-model="password" type="password" placeholder="請輸入密碼" />
    </div>
    <button :disabled="loading" @click="login">
      {{ loading ? '登入中...' : '登入' }}
    </button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-wrapper {
  max-width: 400px;
  margin: 6rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  font-family: 'Noto Sans TC', sans-serif;
}
.form-field {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}
button {
  background: black;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
