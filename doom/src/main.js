import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/utils/Typora.css'
import MathJax from './utils/Mathjax'


if (MathJax.isMathjaxConfig === false){
    MathJax.initMathjaxConfig()
  }

const app = createApp(App);
app.config.globalProperties.MathJax = MathJax
app.use(router).use(ElementPlus);
app.mount('#app');
