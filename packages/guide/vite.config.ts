import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"

import path from "path"

import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({
  plugins: [vue(), vueJsx(),  AutoImport({
    imports: [
      "vue",
      "vue-router"
    ],
    dts: "src/types/auto-imports.d.ts"
  })],
  resolve: {
    // 导入别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
 
  build: {
    target: "es2015",
    outDir: 'dist/lib',
    lib: {
      entry: path.resolve(__dirname, './src/lib/index.ts'),
      name: 'naive-ui-guide'
    },
    rollupOptions: {
      external: ['vue', 'naive-ui'],
      output: {
        globals: {
          vue: 'Vue',
          'naive-ui': 'naive',
        }
      }
    }
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
