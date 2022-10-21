import { sidebarGuide } from "./configs/sidebar"
const nav = require('./configs/nav')
const { demoBlockPlugin } = require('vitepress-theme-demoblock')

module.exports = {
  title: 'Guide Component',
  description: 'Life is short, Keep it simple.',
  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],

  themeConfig: {
   
    nav,

    sidebar: {
      '/guide/': sidebarGuide()
    },

    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
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
  markdown: {
     // options for markdown-it-anchor
     anchor: { permalink: false },

     // options for markdown-it-toc
     toc: { includeLevel: [1, 2] }
     
  },
}
