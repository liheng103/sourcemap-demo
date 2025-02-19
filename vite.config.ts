import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 用于嵌入形式的开发,表示项目的资源路径将相对于 HTML 文件的位置
  plugins: [vue(), vueJsx(), vueDevTools()],
  // https://vitejs.cn/vite3-cn/config/build-options.html#build-emptyoutdir
  build: {
    outDir: 'dist', // 指定输出路径（相对于 项目根目录).
    emptyOutDir: true, // 若 outDir 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
