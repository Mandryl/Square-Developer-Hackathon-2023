<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoffeeStore } from '../stores/coffeeStore'
import { ArrowLeft, Check, Money, Goods, ShoppingCart } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const coffeeStore = useCoffeeStore()
const order = coffeeStore.orderObj
const selected = coffeeStore.selected
const weights = coffeeStore.weights

const displays = computed(() => selected.filter((item) => (item.num ?? 0) > 0))

const goBack = () => {
  router.push('/blend-ratio')
}

let loadCreateCheckout = ref(false)
let isChecked = ref(false)
const createCheckout = async () => {
  loadCreateCheckout.value = true
  const reqBody = {
    orderId: order.id,
    amountMoney: order.totalMoney.amount
  }
  try {
    const response = await axios.post(`/api/terminal/checkout`, reqBody)
    if (response.status === 200) {
      coffeeStore.updateCheckout(response.data)
    } else {
      console.error('Checkout creation failed with status: ', response.status)
    }
  } catch (error) {
    console.error('Checkout creation failed with error: ', error)
  }
  loadCreateCheckout.value = false
  console.log('Checkout Completed')
  isChecked.value = true
  router.push('/')
}
</script>

<template>
  <el-main
    style="height: 70vh"
    v-loading.fullscreen.lock="loadCreateCheckout"
    element-loading-text="Connecting Terminal..."
  >
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 15px">
      <el-breadcrumb-item>Select Coffee Beans</el-breadcrumb-item>
      <el-breadcrumb-item>Determine the percentage of blending</el-breadcrumb-item>
      <el-breadcrumb-item class="active-bread">Order</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 30px">
      <el-text tag="b" size="large"> Confirmation </el-text>
    </div>
    <el-descriptions title="Order Detail" :column="2" size="Large" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon><Money /></el-icon>
            Total Amount with Tax
          </div>
        </template>
        <el-text size="large">{{
          `${parseFloat(order.totalMoney.amount) / 100} (tax: ${
            parseFloat(order.totalTaxMoney.amount) / 100
          })`
        }}</el-text>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon><Goods /></el-icon>
            Total Weight
          </div>
        </template>
        <el-text size="large">{{ weights }} g</el-text>
      </el-descriptions-item>
      <el-descriptions-item :span="16">
        <template #label>
          <div class="cell-item">
            <el-icon><ShoppingCart /></el-icon>
            Items
          </div>
        </template>
        <span v-for="(item, index) in displays" :key="item.name">
          <br v-if="index > 0" />
          <el-text size="large">{{ `・ ${item.name} ${item.num} g` }}</el-text>
        </span>
      </el-descriptions-item>
    </el-descriptions>
  </el-main>
  <el-footer class="btn-area">
    <div v-if="!isChecked">
      <el-button style="width: 20vw" :icon="ArrowLeft" type="danger" size="large" @click="goBack()">
        Back
      </el-button>
      <el-button
        style="width: 60vw"
        :icon="Check"
        type="primary"
        size="large"
        @click="createCheckout()"
      >
        Checkout
      </el-button>
    </div>
  </el-footer>
</template>

<style scoped>
.btn-area {
  display: flex;
  justify-content: center;
}
</style>
