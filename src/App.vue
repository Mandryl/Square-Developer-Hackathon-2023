<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <el-container>
    <el-header>
      <div class="header-wrapper">
        <img class="header-img" src="@/assets/coffee-bean.svg">
        <h3 class="header-title" style="display: flex;">Bean Craft Laboratory</h3>
      </div>
    </el-header>
    <RouterView />
  </el-container>
</template>

<style>
.header-wrapper{
  height:100%;
  display: flex;
}
.header-img{
  height: 2rem;
  display: flex;
  margin: auto 10px auto 0px;
}
.header-title{
  display: flex;
  margin: auto 0;
}
.active-bread .el-breadcrumb__inner{
  font-weight: bold!important;
  color:#409EFF!important;
}
.non-active-bread .el-breadcrumb__inner{
  font-weight: lighter!important;
  color:#C0C4CC!important;
}
.el-badge__content.is-fixed{
  right: 0!important;
  transform: translateY(-50%) translate(0%)!important;
}
.amount .el-statistic__head{
    font-size:15px!important
}
</style>
