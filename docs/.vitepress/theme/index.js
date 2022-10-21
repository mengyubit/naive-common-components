import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import { VTour } from '@naive-ui-common/guide'
import NaiveUi from 'naive-ui'
import './index.scss'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.use(NaiveUi)
    app.component('VTour', VTour)
  }
}
