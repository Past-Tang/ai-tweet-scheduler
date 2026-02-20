// main.ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router'; // 引入路由配置
// 创建 Vue 应用实例
const app = createApp(App);

// 使用 ElementPlus 和路由
app.use(ElementPlus);
app.use(router); // 使用路由

// 挂载应用
app.mount('#app');