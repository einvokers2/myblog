<template>
    <div class="page-container">
        <BlogHeader />
        <div class="cards-container">
            <el-card class="card">
                <template #header>
                    <div class="card-header">
                        <div class="card-header-content">
                            <img src="../assets/injoker.png" class="avatar" alt=""/>
                            <el-text class="name">ToxicTumour</el-text>
                            <el-text class="ocupation">吉林大学 经济学硕士</el-text>
                        </div>
                    </div>
                </template>
                <div class="card-content">
                    <el-collapse v-model="activeItems">
                        <el-collapse-item title="自我描述" name="1">
                            <el-text class="text">
                            一个热衷于编程的经济学研究者
                            </el-text>
                        </el-collapse-item>
                        <el-collapse-item title="个人简介" name="2">
                            <el-text class="text">
                            擅长经济学模型建模，特别是时间序列模型。<br>
                            精通使用Python进行数据清洗、数据爬虫、数据可视化以及模型构建等领域。
                            </el-text>
                        </el-collapse-item>
                        <el-collapse-item title="联系方式" name="3">
                            <el-text class="text">
                            添加联系请注明来意<br>
                            <el-tag>QQ</el-tag>  462924118
                            </el-text>
                        </el-collapse-item>
                    </el-collapse>
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
import BlogFooter from "@/components/BlogFooter.vue"

import { ref } from 'vue'
const activeItems = ref(['1'])

</script>

<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 98vh;
}
.cards-container {
  width: 40%;
  margin: 5px auto;
}
.card-header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.footer-wrapper {
  margin-top: auto; /* Push the footer to the bottom */
}

.name{
    font-size: 24px;
    font-weight: 540;
    color: black;
    flex: 1;
}
.ocupation{
    flex: 1;
    text-align: right;
    padding-right: 15px;
    font-size: 16px;
}

.card-content {

}

.text{
    line-height: 2;
    font-size: 16px;
    color: black;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    margin-top: 4px;

}

</style>