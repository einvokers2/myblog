<template>
  <div class="page-container">
    <BlogHeader />

    <ArticleList class="content"/>
    <div class="footer-wrapper">
      <BlogFooter />
    </div>
    
  </div>
</template>

<script setup>
import BlogHeader from "@/components/BlogHeader.vue"
import BlogFooter from "@/components/BlogFooter.vue"
import ArticleList from "@/components/ArticleList.vue"
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 98vh;
}

.content {
  flex: 1;
  padding: 20px;
}

.footer-wrapper {
  margin-top: auto; /* Push the footer to the bottom */
}

</style>