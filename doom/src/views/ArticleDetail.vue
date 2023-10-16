<template>
  <div class="page-container">
    <BlogHeader />
    <div v-if="art.article !== null && art.article.is_html !== true" class="cards-container">
      <el-card class="left-card">
        <template #header>
          <el-text class="header-content">目录</el-text>
        </template>
        
        <div v-html="art.article.toc_html" class="toc"></div>
      </el-card>
      
      <el-card class="right-card">
        <template #header>
          <div class="card-header">
            <div class="left-content">
              <img src="../assets/injoker.png" class="avatar" alt=""/>
              <el-text class="header-content">{{ art.article.author.username }}</el-text>
            </div>
            <div  v-show="isSuperUser" class="center-content">
              <router-link :to="{ name: 'ArticleEdit', params: { id: art.article.id } }" class="header-content">
                更新与删除
              </router-link>
            </div>
            <div class="right-content">
              <el-text class="article-date">{{ formatted_time(art.article.created) }}</el-text>
            </div>
          </div>
        </template>

        <div class="card-main">
          <span id="title"  class="article-title">{{ art.article.title }}</span>
          <el-divider />
          <div ref="mathJaxEl" v-html="art.article.body_html" class="article-body">
          </div>
          <Comments :article="art.article" />
        </div>
      </el-card>

    </div>
    <div v-if="art.article !== null && art.article.is_html === true" class="cards-container">
      <el-card class="left-card">
        <template #header>
          <el-text class="header-content">目录</el-text>
        </template>
        
        <div v-html="art.article.html_toc" class="toc"></div>
      </el-card>
      
      <el-card class="right-card">
        <template #header>
          <div class="card-header">
            <div class="left-content">
              <img src="../assets/injoker.png" class="avatar" alt=""/>
              <el-text class="header-content">{{ art.article.author.username }}</el-text>
            </div>
            <div  v-show="isSuperUser" class="center-content">
              <router-link :to="{ name: 'ArticleEdit', params: { id: art.article.id } }" class="header-content">
                更新与删除
              </router-link>
            </div>
            <div class="right-content">
              <el-text class="article-date">{{ formatted_time(art.article.created) }}</el-text>
            </div>
          </div>
        </template>

        <div class="card-main">
          <span id="title"  class="article-title">{{ art.article.title }}</span>
          <el-divider />
          <div v-html="art.article.html_content" class="article-body">
          </div>
          <Comments :article="art.article" />
        </div>
      </el-card>

    </div>
    <div class="footer-wrapper">
      <BlogFooter />
    </div>
  </div>
  
</template>

<script setup>
import BlogHeader from "@/components/BlogHeader.vue"
import Comments from "@/components/Comments.vue"
import BlogFooter from "@/components/BlogFooter.vue"

import { sendGetReq } from "@/http"
import axios from "axios"
import { onMounted, computed, reactive, onBeforeMount } from "vue"
import { useRoute } from "vue-router"
import mathjax from "@/utils/Mathjax"

const route = useRoute()
let art = reactive({
  article: null,
})

onMounted(async() => {
  
  await sendGetReq("/article/" + route.params.id + "/")
    .then((resp) => (art.article = resp))
    .catch((err) => console.log(err.message));
  await mathjax.TypeSet('article-body'); 
})


const isSuperUser = computed(() => {
  return localStorage.getItem("isSuperuser.myblog") === "true"
})

const formatted_time = (iso_date_string) => {
  const date = new Date(iso_date_string)
  return date.toLocaleDateString()
}

window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }, false);
</script>

<style scoped>


.right-card{
  width: 70%;
  flex: 3;
  
}

.left-card {
  flex: 1; /* 占据 25% 宽度 */
  margin-right: 5px; /* 添加右侧间距 */
  align-items: center;

}

.cards-container {
  display: flex;
  flex-direction: row; /* 水平排列 */
  width: 80%;
  margin: 5px auto;
  align-items: flex-start;
}

.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.avatar{
  max-width: 30px;
  height: auto;
}


.left-content {
  display: flex;
  align-items: center;
}

.center-content {
  flex: 1;
  text-align: center;
}

.right-content {
  text-align: right;
}

.article-title {
  font-size: 24px;
  margin: 10px 0;
  color: #333; /* 文字颜色 */
  text-decoration: none;
  transition: color 0.3s ease; /* 添加颜色变化过渡效果 */
  font-family: '微软雅黑', sans-serif;
  font-weight: 800;
  padding: 15px 0;
}

.header-content{
  font-size: 18px;
  text-decoration: none; /* 移除链接下划线 */
  color: inherit; /* 继承父元素颜色，保持不变 */
  transition: color 0.3s ease;
}
.footer-wrapper {
  margin-top: auto; /* Push the footer to the bottom */
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 98vh;
}


</style>

<style>
.article-body p img {
  max-width: 100%;
  border-radius: 50px;
  box-shadow: gray 0 0 20px;
  overflow-x: auto;

}

.toc ul {
  list-style-type: none;
}

.toc a {
  color: gray;
  text-decoration: none;
}

.codehilite{
  max-width: 100%;
  overflow-x: auto;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}

.codehilite pre{
  font-family: Consolas, Monaco, monospace;
  font-size: 14px;
  line-height: 1.5;
}

table {
  border-collapse: separate;
  border-spacing: 5px; /* 调整间距大小 */
  font-family: Consolas, Monaco, monospace;
  font-size: 16px;
  line-height: 1.5;
}

/* 表格单元格的样式 */
table td, table th {
    padding: 5px; /* 调整单元格内的内边距 */
    border: 0px solid #ddd; /* 添加边框 */
}
</style>