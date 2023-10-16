<template>
  <div class="page-container">
    <BlogHeader />
    <div class="center-container">
      <el-card class="box-card">
        <template #header>
          <el-text class="header-content">更新文章</el-text>
       </template>
        <el-form label-position="left">
          <el-form-item class="form-elem" label="标题：">
            <el-input v-model="article.title" placeholder="输入标题" />
          </el-form-item>

          <el-form-item class="form-elem" label="分类：">

            <span v-for="category in article.categories" :key="category.id" >
              <!--样式也可以通过 :style 绑定-->
              <el-button
                class="category-btn"
                :style="categoryStyle(category)"
                @click.prevent="chooseCategory(category)"
                style="background-color: rgb(148, 205, 241)">
                {{ category.title }}
              </el-button>
            </span>
          </el-form-item>

          <el-form-item class="form-elem" label="标签：">
            <el-input v-model="article.tags" placeholder="输入标签，用逗号分隔" />
          </el-form-item>

          <el-form-item class="form-elem" label="正文：">
            <el-input v-model="article.body" placeholder="输入正文" type="textarea" :autosize="{ minRows: 8, maxRows: 20}"></el-input>
          </el-form-item>

          <el-form-item class="button-elem">
            <el-button v-on:click.prevent="submit" style="background-color: rgb(68, 236, 208)">提交</el-button>
            <el-button v-on:click.prevent="deleteArticle" style="background-color: rgb(241, 148, 148)">
              删除
            </el-button>
          </el-form-item>
          <el-form-item class="form-elem">

          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="footer-wrapper">
      <BlogFooter />
    </div>
  </div>

</template>

<script setup>
import BlogHeader from "@/components/BlogHeader.vue"
import BlogFooter from "@/components/BlogFooter.vue"

import { reactive, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { sendGetReq, sendPutReq, sendDeleteReq } from "@/http"
import axios from "axios"
import authorization from "@/utils/authorization"

const route = useRoute()
const router = useRouter()
let article = reactive({
  title: "",
  body: "",
  categories: [],
  selectedCategory: null,
  tags: "",
  // Article id
  articleID: null,
})
onMounted(() => {
  // 页面初始化时获取所有分类
  sendGetReq("/category/").then((resp) => (article.categories = resp))
  //
  sendGetReq("/article/" + route.params.id + "/").then((resp) => {
    article.title = resp.title
    article.body = resp.body
    article.selectedCategory = resp.category
    article.tags = resp.tags.join(",")
    article.articleID = resp.id
  })
})

// 根据分类是否被选中，按钮的颜色发生变化
function categoryStyle(category) {
  if (article.selectedCategory !== null && category.id === article.selectedCategory.id) {
    return { backgroundColor: "rgb(61, 179, 242)" }
  }
  return { backgroundColor: "rgb(214, 216, 219)" }
}

// 选取分类
function chooseCategory(catego) {
  if (article.selectedCategory !== null && article.selectedCategory.id === catego.id) {
    article.selectedCategory = null
  } else {
    article.selectedCategory = catego
  }
}

function submit() {
  authorization().then((response) => {
    if (response[0]) {
      let data = {
        title: article.title,
        body: article.body,
        category_id: article.selectedCategory ? article.selectedCategory.id : null,
        tags: article.tags
          .split(/[,，]/)
          .map((x) => x.trim())
          .filter((x) => x.charAt(0) !== ""),
      }

      const token = localStorage.getItem("access.myblog")
      sendPutReq("/article/" + article.articleID + "/", data, {
        headers: { Authorization: "Bearer " + token },
      }).then((resp) => {
        router.push({ name: "ArticleDetail", params: { id: resp.data.id } })
      })
    } else {
      alert("令牌过期，请重新登录。")
      router.push({ name: "Home" })
    }
  })
}

function deleteArticle() {
  const token = localStorage.getItem("access.myblog")
  authorization().then((response) => {
    if (response[0]) {
      if (confirm("确定要删除该文章吗？")) {
        sendDeleteReq("/article/" + article.articleID + "/", {
          headers: { Authorization: "Bearer " + token },
        }).then(() => router.push({ name: "Home" }))
      }
    } else {
      alert("令牌过期，请重新登录。")
      router.push({ name: "Home" })
    }
  })
}
</script>

<style scoped>



.center-container {
  display: flex;
  justify-content: center;
  width: 60%;
  margin: 10px auto;
}


.header-content{
  font-size: 24px;
  font-weight: 550;
  text-align: center;
}

.content {
  flex: 1;
  padding: 20px;
}
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 98vh;
}
.footer-wrapper {
  margin-top: auto; /* Push the footer to the bottom */
}

.box-card {
  width: 100%;
  padding: 10px; /* Decrease the padding */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.category-btn {
  margin-right: 10px;
  background-color: rgb(148, 205, 241);
  font-weight: 520;
}
#article-create {
  text-align: center;
  font-size: large;
}
form {
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
}

.form-elem {
  padding: 10px;
}

input {
  height: 25px;
  padding-left: 10px;
  width: 50%;
}

.button-elem{
  width: 30%;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  gap: 30px;
  align-items: center;
}

button {
  height: 32px;
  cursor: pointer;
  border: none;
  outline: none;
  background: rgb(214, 216, 219);
  color: rgb(12, 12, 12);
  border-radius: 5px;
  width: 80px;
}
</style>
