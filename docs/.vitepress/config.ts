import nav  from './configs/nav'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Guide Component',
  description: 'Life is short, Keep it simple.',
  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],

  themeConfig: {
   
    nav,

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    algolia: {
      appId: '8J64VVRP8K',
      apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
      indexName: 'vitepress'
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    }
  },
  
})
