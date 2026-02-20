import { createRouter, createWebHistory } from 'vue-router'; // Vue 3 的 Vue Router 导入方式
import Home from '../App.vue'; // 导入首页组件（注意路径和文件名）

// 定义路由
const routes = [
  {
    path: '/', // 根路径
    component: Home, // 渲染 Home 组件
  },

];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 history 模式
  routes,
});

export default router;