<template>
  <el-header id="header">
    <div class="header-logo">
      
      <h3 class="main-title">
        <div class="vertical-center">
          <img src="../assets/injoker.png" alt="Logo"/>
          <router-link :to="{ name: 'Home' }">Injoker</router-link>
        </div>
      </h3>
    </div>
    <nav class="header-nav">
      <router-link class="nav-link" :to="{ name: 'Home' }">博客</router-link>
      <router-link class="nav-link" :to="{ name: 'Home' }">代码</router-link>
      <router-link class="nav-link" :to="{ name: 'AboutMe' }">关于我</router-link>
    </nav>
    <div class="header-search">
      <SearchBox></SearchBox>
    </div>
    <div class="header-user">
      <div v-if="hasLogin">

        <el-dropdown  trigger="click">
          <span class="nav-link" style="font-size: 18px;">欢迎, {{ uname }} !</span>
          <template #dropdown>
            <el-dropdown-menu slot="dropdown" :is-open="dropdownVisible">
              <el-dropdown-item>
                <router-link :to="{ name: 'UserCenter', params: { username: userName } }" class="nav-link" style="font-size: 14px;">
                用户中心
              </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link v-show="isSuperuser" :to="{ name: 'ArticleCreate' }" class="nav-link" style="font-size: 14px;">
                发表文章
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>

        </el-dropdown>
      </div>
      <div v-else>
        <router-link to="/login" class="nav-link" style="font-size: 18px;">注册/登录</router-link>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import SearchBox from "./SearchBox.vue"
import { ref, onMounted, computed } from "vue"
import authorization from "@/utils/authorization"


let userName = ref("")
let hasLogin = ref(false)
const isSuperuser = JSON.parse(localStorage.getItem("isSuperuser.myblog"))

const props = defineProps(["welcomeName"])

const uname = computed(() => {
  return props.welcomeName ? props.welcomeName : userName.value
})

if (hasLogin) {
  userName.value = localStorage.getItem("username.myblog")
}


onMounted(() => {
  authorization().then((data) => ([hasLogin.value, userName.value] = data))
})
</script>

<style scoped>
body {
  margin: 0;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-items: center; /* 垂直居中对齐 */;
  width: 80%;
  margin: 0 auto; /* 水平居中 */

}

.header-nav {
  display: flex;
  gap: 35px;
}

.nav-link {
  text-decoration: none;
  font-size: 20px;
  font-family: sans-serif; /* 使用你喜欢的字体 */
  color: #333;
  transition: color 0.3s ease;
}

.header-search{
  width: 200px;
  align-items: center; /* 垂直居中对齐 */
  padding-bottom: 20px;
}

.header-user{
  text-decoration: none;
}

.vertical-center {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
}

.vertical-center img {
  max-width: 50px; /* 调整图片大小 */
  margin-right: 10px; /* 调整图片和文字之间的间距 */
}

.vertical-center router-link {
  text-decoration: none;
  font-weight: bold;
  color: #333; /* 设置文字颜色 */
}

.main-title a {
  color: black;
  text-decoration: none;
}

</style>
