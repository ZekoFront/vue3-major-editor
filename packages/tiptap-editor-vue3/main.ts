import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
// 引入组件
import EditorTiptapVue3 from "./src/index";
import "./src/style/index.css";

const app = createApp(App)
const pinia = createPinia()
app.use(EditorTiptapVue3)
app.use(pinia)
document.title = "Vue3组件库"
app.mount("#app")