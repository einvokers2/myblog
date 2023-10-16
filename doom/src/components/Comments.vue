<template>
  <br /><br />
  <hr />
  <h3>发表评论</h3>
  <!-- 评论多行文本输入控件 -->
  <div style="display: flex; align-items: center;">
    <el-input
      v-model="message"
      :placeholder="placeholder"
      name="comment"
      id="comment-area" clearable
      style="margin-right: 10px;">
    </el-input>
 
    <el-button @click="submit" class="submitBtn">发布</el-button>
  </div>

  <br />
  <p>已有 {{ comments.length }} 条评论</p>
  <hr />

  <!-- 渲染所有评论内容 -->
  <div v-for="comment in comments" :key="comment.id">
    <div class="comments">
      <div>
        <span class="username">
          {{ comment.author.username }}
        </span>
        于
        <span class="created">
          {{ formatted_time(comment.created) }}
        </span>
        <span v-if="comment.parent">
          对
          <span class="parent">
            {{ comment.parent.author.username }}
          </span>
        </span>
        说道：
      </div>
      <div class="content">
        {{ comment.content }}
      </div>
      <div>
        <button class="commentBtn" @click="replyTo(comment)">回复</button>
      </div>
    </div>
    <hr />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import authorization from "@/utils/authorization"
import { sendPostReq } from "@/http"
import { sendGetReq } from "@/http"
import axios from "axios"

const props = defineProps({
  article: Object,
})

const router = useRouter()
let comments = ref([])
let message = ref("")
let placeholder = ref("说点啥吧...")
let parentID = ref(null)


onMounted(async () => {
  try {
    const response = await sendGetReq("/comment/");
    const allComments = response.results;

    const filteredComments = allComments.filter(comment => comment.article === props.article.url);
    comments.value = filteredComments;

  } catch (error) {
    console.error('Error fetching comments:', error);
  }
});


// 监听 article 对象
// 以便实时更新评论
// watch(props.article, (newArticle) => {
//   comments.value = newArticle !== null ? newArticle.comments.value : []
// })
// 提交评论
function submit() {
  authorization().then((response) => {
    if (response[0]) {
      sendPostReq(
        "/comment/",
        {
          content: message.value,
          article_id: props.article.id,
          parent_id: parentID.value,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("access.myblog") },
        }
      ).then((resp) => {
        // 将新评论添加到顶部
        comments.value.unshift(resp.data)
        message.value = ""
        alert("留言成功")
      })
    } else {
      alert("请登录后评论。")
      router.push({ name: "Login" })
    }
  })
}
// 对某条评论进行评论
// 即二级评论
function replyTo(comment) {
  parentID.value = comment.id
  placeholder.value = "对" + comment.author.username + "说:"
}

function formatted_time(iso_date_string) {
  const date = new Date(iso_date_string)
  return date.toLocaleDateString() + "  " + date.toLocaleTimeString()
}
</script>

<style scoped>
button {
  cursor: pointer;
  border: none;
  outline: none;
  color: whitesmoke;
  border-radius: 5px;
}

.submitBtn {
  height: 35px;
  background: steelblue;
  width: 60px;
}

.commentBtn {
  height: 25px;
  background: lightslategray;
  width: 40px;
}

.comments {
  padding-top: 10px;
  font-size: 16px;
}

.username {
  color: darkorange;
  font-size: 16px;
}

.created {
  color: darkblue;
  font-size: 16px;
}

.parent {
  color: orangered;
  font-size: 16px;
}

.content {
  padding: 15px;
  font-size: 16px;
}
</style>
