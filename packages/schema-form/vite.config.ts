import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"

import path from "path"

import AutoImport from 'unplugin-auto-import/vite'
import { fixVue3NoMatchingExportDefaultPlugin } from './plugin'

﻿

export default defineConfig({
  plugins: [vue(), vueJsx(),  AutoImport({
    imports: [
      "vue",
      "vue-router"
    ],
    dts: "src/types/auto-imports.d.ts"
  }), 
  fixVue3NoMatchingExportDefaultPlugin({})],
  resolve: {
    // 导入别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/lib/components")
    }
  },
 
  build: {
    target: "es2015",
    minify: false,
    sourcemap: true,
    outDir: 'dist/lib',
    lib: {
      entry: path.resolve(__dirname, './src/lib/index.ts'),
      name: 'naive-ui-schema-form'
    },
    rollupOptions: {
      external: ['vue', 'naive-ui'],
      output: {
        sourcemap: true,
        esModule: true,
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
