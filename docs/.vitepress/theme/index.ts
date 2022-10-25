import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import * as pkg from 'naive-ui-guide'
import NaiveUi from 'naive-ui'
import './index.scss'
const VTour = pkg.VTour

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.use(NaiveUi)
    app.component('VTour', VTour)
  }
}
