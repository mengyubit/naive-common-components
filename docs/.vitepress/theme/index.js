import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import { VTour } from 'guide'
export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component(VTour.name, VTour)
  }
}
