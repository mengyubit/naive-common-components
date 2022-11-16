import { createApp } from 'vue'
import App from './App.vue'
import naiveUI from "naive-ui"
async function bootstrap() {

  const app = createApp(App)
  app.use(naiveUI)
  app.mount("#app")
}

bootstrap()
