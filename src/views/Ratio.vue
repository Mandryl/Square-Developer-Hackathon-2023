<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoffeeStore } from '../stores/coffeeStore'
import { ArrowRight, ArrowLeft, ShoppingCart } from '@element-plus/icons-vue'
import apexchart from 'vue3-apexcharts'
import axios from 'axios'
import robotSVG from '@/assets/robot.svg'

const router = useRouter()
const coffeeStore = useCoffeeStore()
let selected = coffeeStore.selected
selected.forEach(() => {
  selected.num = 0
})

const itemSelected = computed(() => selected.some((item) => item.num > 0))
const amount = computed(() =>
  selected.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price * (currentValue.num ?? 0.0),
    0.0
  )
)
const weight = computed(() =>
  selected.reduce((accumulator, currentValue) => accumulator + (currentValue.num ?? 0), 0)
)

let blendText = ref('')
let showAIComment = ref(false)
let loadGPT = ref(false)
let showGAI = ref(false)
let gptDesc = ref('')
let sdImages = ref([])

let firstEvaluate = false
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
const evaluate = async () => {
  showGAI.value = false
  showAIComment.value = false
  if (firstEvaluate) {
    await sleep(500)
  } else {
    firstEvaluate = true
  }
  blendText.value = selected
    .filter((item) => item.num > 0)
    .map((item) => {
      return `${item.name} ${item.num}g`
    })
    .join(', ')
  showAIComment.value = true
  loadGPT.value = true

  const data = selected
    .filter((item) => item.num > 0)
    .map((item) => {
      return {
        bean: {
          name: item.name,
          feature: item.feature
        },
        ratio: item.num / weight.value
      }
    })

  const gpt = axios
    .post('/api/generateDesc', {
      blends: data
    })
    .catch((e) => console.log(e))
  const sd = axios
    .post('/api/generateImage', {
      blends: data
    })
    .catch((e) => console.log(e))
  const promise = await Promise.all([gpt, sd])

  gptDesc.value = promise[0].data?.desc ?? ''
  sdImages.value = promise?.[1]?.data?.base64 ?? []
  loadGPT.value = false
  showGAI.value = true
}

const series = computed(() =>
  selected
    .filter((item) => item.num > 0)
    .map((item) => {
      return {
        name: item.name,
        data: [item.num]
      }
    })
)
const chartOptions = {
  chart: {
    id: 'coffee-blend',
    stacked: true,
    stackType: '100%',
    toolbar: { show: false },
    animations: { enabled: false }
  },
  xaxis: {
    categories: ['Coffee Blend']
  },
  yaxis: {
    labels: { show: false }
  },
  plotOptions: {
    bar: { horizontal: true }
  },
  tooltip: { enabled: false }
}
const goBack = () => {
  router.push('/')
}

let loadCreateOrder = ref(false)

const createOrder = async () => {
  loadCreateOrder.value = true
  coffeeStore.updateSelected(selected)
  const reqBody = {
    items: coffeeStore.selected
      .filter((item) => item.num > 0)
      .map((item) => ({
        itemId: item.itemId,
        itemVarId: item.itemVarId,
        itemQuantity: item.num
      })),
    note: gptDesc.value
  }
  try {
    const response = await axios.post(`/api/orders/`, reqBody)
    if (response.status === 200) {
      coffeeStore.updateOrder(response.data)
    } else {
      console.error('Order creation failed with status: ', response.status)
    }
  } catch (error) {
    console.error('Order creation failed with error: ', error)
  }
  loadCreateOrder.value = false
  router.push('/order')
}
</script>

<template>
  <el-main
    v-loading.lock="loadCreateOrder"
    element-loading-text="Order is beeing processed."
  >
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 15px">
      <el-breadcrumb-item>Select Coffee Beans</el-breadcrumb-item>
      <el-breadcrumb-item class="active-bread"
        >Determine the percentage of blending</el-breadcrumb-item
      >
      <el-breadcrumb-item class="non-active-bread">Order</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-statistic class="amount" title="Total Amount" prefix="$" :precision="2" :value="amount" />
      <el-statistic class="amount" title="Total Weight" suffix="gram" :value="weight" />
    </el-row>
    <el-row>
      <div style="width: 80vw; margin: 0 auto">
        <apexchart
          width="100%"
          height="140px"
          type="bar"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </el-row>
    <el-row v-for="item in selected" :key="item.name" style="margin-bottom: 10px">
      <el-col :span="4">
        <span class="ratio-title">{{ item.name }}</span>
      </el-col>
      <el-col :span="20" style="display: flex">
        <el-slider v-model="item.num" :max="500" show-input />
        <el-text tag="b" style="margin-left: 10px">[g]</el-text>
      </el-col>
    </el-row>
    <el-row>
      <div class="ai-intro-wrapper">
        <el-image style="height: 150px; width: 150px" :src="robotSVG" fit="contain" />
        <div>
          <h3>Taste Evaluation with Coffee AI</h3>
          <el-text class="ai-intro">
            Coffee AI predicts the taste and aroma of your blend, and describes it with texts and
            images.
          </el-text>
          <el-button
            class="ai-intro-btn"
            color="#a0cfff"
            :disabled="!itemSelected"
            @click="evaluate()"
          >
            Evaluate
          </el-button>
        </div>
      </div>
    </el-row>
    <el-row class="ai-row" v-if="showAIComment">
      <div>
        <el-avatar class="ai-avatar" :src="robotSVG" />
      </div>
      <div class="ai-bubble">
        <el-text style="word-break: break-word">
          {{ blendText }}
        </el-text>
        <br />
        <el-text style="word-break: break-word"> Evaluating this blend ... </el-text>
      </div>
    </el-row>
    <el-row
      v-loading="loadGPT"
      element-loading-text="AI is processing"
      class="ai-row"
      style="margin-top: 0"
    >
      <div v-if="showGAI">
        <el-avatar class="ai-avatar" :src="robotSVG" />
      </div>
      <div v-if="showGAI" class="ai-bubble">
        <el-text style="word-break: break-word">
          {{ gptDesc }}
        </el-text>
      </div>
    </el-row>
    <el-row v-if="showGAI" class="ai-row" style="margin-top: 0">
      <div>
        <el-avatar class="ai-avatar" :src="robotSVG" />
      </div>
      <div class="ai-bubble">
        <el-text style="word-break: break-word">
          The following images describe the expected taste and aroma.
        </el-text>
      </div>
    </el-row>
    <el-row v-if="showGAI">
      <div style="margin: 0 auto">
        <el-image
          class="sd-image"
          v-for="(image, index) in sdImages"
          :key="'image' + index"
          :src="'data:image/png;base64,' + image"
          fit="contain"
        />
      </div>
    </el-row>
  </el-main>
  <el-footer class="btn-area">
    <el-button style="width: 20vw" :icon="ArrowLeft" type="danger" size="large" @click="goBack()">
      Back
    </el-button>
    <el-button
      style="width: 60vw"
      :icon="ShoppingCart"
      type="primary"
      size="large"
      :disabled="!itemSelected"
      @click="createOrder()"
    >
      Order
    </el-button>
  </el-footer>
</template>

<style scoped>
.blend-info {
  margin-bottom: 15px;
  justify-content: space-between;
  align-items: center;
}
.btn-area {
  display: flex;
  justify-content: center;
}
.ai-avatar {
  background-color: #a0cfff;
}
.ai-row {
  flex-wrap: nowrap;
  /* border: #CDD0D6 solid thin; */
  padding: 15px;
  margin-top: 20px;
}
.ai-bubble {
  padding: 10px;
  margin-left: 20px;
  border: #cdd0d6 solid thin;
  border-radius: 8px;
}
.ai-intro {
  display: block;
  word-break: break-word;
  margin-bottom: 10px;
}
.ai-intro-wrapper {
  width: 60vw;
  display: flex;
  margin: 0 auto;
}
.ai-intro-btn {
  display: block;
  margin: 0 auto;
  width: 100%;
}
.amount {
  margin-right: 30px;
}
.sd-image {
  height: 150px;
  width: 150px;
  margin: 10px;
  object-fit: contain;
}
</style>
