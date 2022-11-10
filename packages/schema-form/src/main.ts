import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naiveUI from "naive-ui"

async function bootstrap() {
  const app = createApp(App)

  app.use(naiveUI)

  app.mount("#app")
}

void bootstrap()

