<template>
  <el-card class="box-card" id="articles" v-for="article in articleInfo.data.results" :key="article.url">
    <template #header>
      <div class="card-header">
        <img :src="image" class="avatar" alt=""/>
        <el-text>{{ article.author.username }}</el-text>
        <el-text class="article-date">{{ formatted_time(article.created) }}</el-text>
      </div>
    </template>
    <div class="card-main">
      <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }" class="article-title">
        {{ article.title }}
      </router-link>
      <div class="image-container">
        <img :src="imageIfExists(article)" alt="" class="image" />
      </div>
      <div class="cate-tag">
        <el-tag v-if="article.category !== null" class="category">{{ article.category.title }}</el-tag>
        <el-tag class="tag" v-for="tag in article.tags" :key="tag" type="success">{{ tag }}</el-tag>
      </div>
    </div>

  </el-card>
  
  <div id="paginator">
    <el-button :disabled="!is_page_exists('previous')"  @click="$router.push(get_path('previous'))">
      上一页
    </el-button>
    <el-button class="current-page">
      {{ get_page_param("current") }}
    </el-button>
    <el-button :disabled="!is_page_exists('next')"  @click="$router.push(get_path('next'))">
      下一页
    </el-button>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue"
import { useRoute } from "vue-router"
import { sendGetReq } from "@/http"
import image from "@/assets/injoker.png"

const route = useRoute()
let articleInfo = reactive({
  data: {},
})

onMounted(() => get_article_data())

// 方法
// 获取文章列表数据
function get_article_data() {
  let url = "/article/"
  let params = new URLSearchParams()
  // appendIfExists 方法是原生没有的
  // 原生只有 append 方法，但此方法不能判断值是否存在
  if (route.query.page !== undefined) {
  params.append("page", route.query.page);
  } 

  if (route.query.title !== undefined) {
    params.append("title", route.query.title);
  }

  const paramsString = params.toString()
  console.log(paramsString)
  if (paramsString.charAt(0) !== "") {
    url += "/?" + paramsString
  }
  console.log(url)
  sendGetReq(url)
    .then((resp) => {
      articleInfo.data = resp
    })
    .catch((err) => console.log(err.message))
}

function formatted_time(iso_date_string) {
  const date = new Date(iso_date_string)
  return date.toLocaleDateString()
}

// 判断页面是否存在
function is_page_exists(direction) {
  return direction === "next" ? articleInfo.data.next !== null : articleInfo.data.previous !== null
}

// // 获取页码
function get_page_param(direction) {
  try {
    let url_string
    switch (direction) {
      case "next":
        url_string = articleInfo.data.next
        break
      case "previous":
        url_string = articleInfo.data.previous
        break
      default:
        // 如果page不存在或为空
        if (!("page" in route.query) || route.query.page === null) return 1
        return route.query.page
    }
    if (url_string) {
      const url = new URL(url_string)
      return url.searchParams.get("page")
    }
  } catch (err) {
    console.log(err)
  }
}

function get_path(direction) {
  let url = ""
  try {
    switch (direction) {
      case "next":
        if (articleInfo.data.next !== undefined) {
          url += new URL(articleInfo.data.next).search
        }
        break
      case "previous":
        if (articleInfo.data.previous !== undefined) {
          url += new URL(articleInfo.data.previous).search
        }
        break
    }
  } catch {
    return url
  }
  return url
}

function imageIfExists(article) {
  if (article.avatar) {
    return article.avatar.content
  }
}

function gridStyle(article) {
  if (article.avatar) {
    return {
      display: "grid",
      gridTemplateColumns: "0.2fr 4fr",
    }
  }
}

// 监听
watch(route, () => get_article_data())
</script>

<style scoped>
.box-card{
  width: 60%;
  margin: 10px auto;
  
}

.avatar{
  max-width: 30px;
  height: auto;
}

.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.card-main{
  padding: 10px 5px;
}

.article-date{
  margin-left: auto;
}

.article-title {
  font-size: 24px;
  margin: 10px 0;
  color: #333; /* 文字颜色 */
  text-decoration: none;
  transition: color 0.3s ease; /* 添加颜色变化过渡效果 */
  font-family: '微软雅黑', sans-serif;
  /* 鼠标悬停时的样式 */
  cursor: pointer;
  padding: 15px 0;
}

.article-title:hover {
  color: #007bff; /* 鼠标悬停时的文字颜色 */
}

#paginator{
  width: 50%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.cate-tag{
  gap: 10px;
  display: flex;
  align-items: center;
}
</style>
