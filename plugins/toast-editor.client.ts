// plugins/toast-editor.client.ts
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

export default defineNuxtPlugin(() => {
  console.log('✅ Toast Editor 插件已載入')

  return {
    provide: {
      toastEditor: Editor
    }
  }
})
