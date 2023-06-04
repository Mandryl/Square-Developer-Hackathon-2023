<script setup>
import { ref } from "vue";
import { ArrowRight, Money } from '@element-plus/icons-vue'

let isBadge = ref(true);
let allowNext = ref(true);
const cardOnclick = () => {
  isBadge.value = !(isBadge.value);
  allowNext.value = false;
}
</script>

<template>
  <el-main>
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom:15px;">
      <el-breadcrumb-item class="active-bread">Select Coffee Beans</el-breadcrumb-item>
      <el-breadcrumb-item class="non-active-bread">Determine the percentage of blending</el-breadcrumb-item>
      <el-breadcrumb-item class="non-active-bread">Order</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20" style="margin-bottom:15px;">
      <el-col :span="6">
        <el-badge value="Select" type="primary" :hidden="isBadge">
          <el-card :body-style="{ padding: '0px' }" @click="cardOnclick()">
            <el-image style="width: 100%; height:200px;" src="" fit="cover" />
            <div style="margin:10px">
              <div class="coffee-title">
                <el-text tag="b" size="large">Hawaii Kona</el-text>
                <el-text><el-icon><Money /></el-icon> ¥20/g</el-text>
              </div>
              <div class="coffee-desc">
                <el-text size="small">
                  Kona coffee is characterised by soft acidity and smooth taste. It is characterised by low bitterness, soft acidity and a fruity-sweet aroma that evokes the original fruitiness of coffee. Rather than being full-bodied, it offers a refreshing aftertaste.
                </el-text>
              </div>
            </div>
          </el-card>
        </el-badge>
      </el-col>
    </el-row>
  </el-main>
  <el-footer>
    <el-button class="next-btn" :icon="ArrowRight" type="primary" size="large" :disabled="allowNext">Next Step</el-button>
  </el-footer>
</template>


<style scoped>
.coffee-title{
  display: flex;
  justify-content: space-between;
}
.coffee-desc{
  line-height: 17px;
}
.el-card:active{
  background-color: #E6E8EB;
  border: solid #409EFF thin;
}
.el-badge{
  height: 100%;
}
.el-card{
  height: 100%;
}
.next-btn{
  width: 80vw;
  display: block;
  margin: 0 auto;
}
</style>