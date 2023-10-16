<template>
  <el-footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <p>&copy; 2023 ToxicTumour. All rights reserved.</p>
      </div>

    </div>
  </el-footer>
</template>

<script>

export default {
  setup() {

  }
};
</script>

<style scoped>
.footer {
  height: 50px;
  background: white;
  text-align: center;
  font-size: 14px;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-section {
  flex: 1;
  margin-right: 20px;
}

.footer h4 {
  margin-bottom: 10px;
  font-weight: bold;
}

/* 链接的样式 */
.el-menu-item {
  margin-bottom: 5px;
}

.el-menu-item a {
  text-decoration: none;
  color: #007bff;
}

.el-menu-item a:hover {
  text-decoration: underline;
}
</style>
