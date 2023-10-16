<template>
  <div class="page-container">
    <BlogHeader />
    <div class="center-container">
      <el-card class="box-card">
        <template #header>
          <el-text class="header-content">创建文章</el-text>
       </template>

        <el-form label-position="left">
          <el-form-item class="form-elem" label="HTML：">
            <input v-on:change="onFileChangeHTML" type="file" accept="text/html" id="HTML" style="overflow-x: auto; width: 18%;"/>
          </el-form-item>
          <el-form-item class="form-elem" label="图片：">
            <input v-on:change="onFileChange" type="file" accept="image/*" id="file" style="overflow-x: hidden; width: 18%;"/>
          </el-form-item>

          <el-form-item class="form-elem" label="标题：">
            <el-input v-model="article.title" placeholder="输入标题" />
          </el-form-item>

          <el-form-item class="form-elem" label="分类：">

            <span v-for="category in article.categories" :key="category.id" >
              <!--样式也可以通过 :style 绑定-->
              <el-button
                class="category-btn"
                :style="categoryStyle(category)"
                @click.prevent="chooseCategory(category)">
                {{ category.title }}
              </el-button>
            </span>
          </el-form-item>

          <el-form-item class="form-elem" label="标签：">
            <el-input v-model="article.tags" placeholder="输入标签，用逗号分隔" />
          </el-form-item>

          <el-form-item class="form-elem" label="正文：">
            <el-input v-model="article.body" placeholder="输入正文，如果提供了HTML文件则无需输入" type="textarea" :autosize="{ minRows: 8, maxRows: 20}"></el-input>
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
import { useRouter } from "vue-router"
import { sendGetReq, sendPostReq } from "@/http"
import authorization from "@/utils/authorization"

const router = useRouter()
let article = reactive({
  title: "",
  tags: "",
  body: "",
  categories: [],
  selectCategorie: null,
  avatarID: null,
  html_content: "",
  html_toc : "",
  is_html: false
})

onMounted(() => {
  sendGetReq("/category/").then((resData) => {
    article.categories = resData
  })
})

function categoryStyle(catego) {
  if (article.selectCategorie !== null && catego.id === article.selectCategorie.id) {
    return { backgroundColor: "rgb(255, 127, 80)"}
  }
  return { backgroundColor: "rgb(164, 210, 239)" }
}

function chooseCategory(catego) {
  // 如果点击已选取的分类，则将 article.selectCategorie 置空
  if (article.selectCategorie !== null && article.selectCategorie.id === catego.id) {
    article.selectCategorie = null
  }
  // 如果没选中当前分类，则选中它
  else {
    article.selectCategorie = catego
  }
}

function onFileChange(e) {
  // 将文件二进制数据添加到提交数据中
  const file = e.target.files[0]
  let formData = new FormData()
  formData.append("content", file)

  // 略去鉴权和错误处理的部分
  sendPostReq("/avatar/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + localStorage.getItem("access.myblog"),
    },
  }).then((resp) => (article.avatarID = resp.data.id))
}

function onFileChangeHTML(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileContent = e.target.result; // 获取文件内容
      const parser = new DOMParser();
      const doc = parser.parseFromString(fileContent, "text/html");

      // 提取文件名（不带扩展名）作为标题
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const title = fileName;

      // 获取 HTML 渲染后的内容
      const body_div = doc.body.querySelector('div')

      const toc_div = body_div.children[0]
      const html_toc = toc_div.innerHTML;

      const content_div = body_div.children[1]
      const html_content = content_div.innerHTML;


      // 在控制台中显示标题和正文


      // 在此处您可以进一步处理标题和正文，例如将它们显示在页面上或执行其他操作。
      article.title = title;
      article.html_content = html_content;
      article.html_toc = html_toc;
      article.is_html = true
    };

    reader.readAsText(file); // 读取文件内容
  } else {
    console.error("未选择文件");
  }
}


function submit() {
  authorization().then((resp) => {
    if (resp[0]) {
      // 需要传给后端的数据
      let payload = {
        avatar_id: article.avatarID,
        title: article.title,
        body: article.body,
        tags: article.tags
          .split(/[,，]/)
          .map((x) => x.trim())
          .filter((x) => x.charAt(0) !== ""), // 去除空提交
        html_content: article.html_content,
        html_toc: article.html_toc,
        is_html: article.is_html
      }
      console.log(payload)
      // 添加分类
      if (article.selectCategorie) {
        payload.category_id = article.selectCategorie.id
      }

      const token = localStorage.getItem("access.myblog")
      sendPostReq("/article/", payload, { headers: { Authorization: "Bearer " + token } }).then(
        (res) => {
          router.push({ name: "ArticleDetail", params: { id: res.data.id } })
        }
      )
    } else {
      alert("令牌过期，请重新登录。")
      router.push({ name: "Login" })
    }
  })
}
</script>

<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 98vh;
}

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
  background-color: rgb(164, 210, 239);
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