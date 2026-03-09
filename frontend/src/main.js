// Vue 3 应用入口文件
import { createApp } from 'vue' // Vue 核心库
import { createPinia } from 'pinia' // 状态管理库
import App from './App.vue' // 根组件
import router from './router' // 路由配置
import './assets/style.css' // 全局样式

// 创建 Vue 应用实例
const app = createApp(App)

// 使用 Pinia 进行全局状态管理
app.use(createPinia())

// 使用 Vue Router 进行路由管理
app.use(router)

// 挂载应用到 DOM 中 id 为 'app' 的元素
app.mount('#app')
