<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoffeeStore } from '../stores/coffeeStore'
import axios from 'axios'
import { ArrowRight, Money } from '@element-plus/icons-vue'

const router = useRouter();
const coffeeStore = useCoffeeStore();

let catalogItems = ref([])
let state = reactive({
  selectedItems: [],
  error: null,
  loading: false
});

let cardOnclick = (itemId) => {
  if (state.selectedItems.includes(itemId)) {
    state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
  } else {
    state.selectedItems.push(itemId);
  }
}
let isItemSelected = (id) => computed(() => state.selectedItems.includes(id));
let hasSelectedItems = computed(() => state.selectedItems && state.selectedItems.length > 0);

const nextStep = () => {
  const selected = catalogItems.value.filter(item => 
    state.selectedItems.includes(item.catalogItemObj.catalogItemObj.id)
  ).map(item => {
    const variation = item.catalogItemObj.catalogItemObj.itemData.variations[0];
    const featureKeys = Object.keys(variation.customAttributeValues).filter(key => key.includes("Square:"));
    const feature = {};
    featureKeys.map(key => variation.customAttributeValues[key]).forEach(obj =>{
      const customeAttrName = obj.name;
      const customeAttrValue = obj.stringValue;
      feature[customeAttrName] = customeAttrValue.split(",").map(v=>v.trim());
    });
    
    return {
      id: item.catalogItemObj.catalogItemObj.id,
      variationId: item.catalogItemObj.catalogItemObj.itemData.variations[0].id,
      name: item.catalogItemObj.catalogItemObj.itemData.name,
      price: variation.itemVariationData.priceMoney.amount / 100,
      feature: feature
    }
  });
  coffeeStore.updateSelected(selected);
  router.push("/blend-ratio");
}

const fetchCatalogItems = async () => {
  state.loading = true;
  try {
    const response = await axios.get('/api/catalog/items', {
      params: {
        category: 'CoffeeBean'
      }
    });

    if (response.status === 200) {
      catalogItems.value = response.data;
    }
  } catch (error) {
    console.error(error);
    state.error = error.message;
  } finally {
    state.loading = false;
  }
}

onMounted(fetchCatalogItems)
</script>

<template>
  <div>
    <el-main>
      <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 15px">
        <el-breadcrumb-item class="active-bread">Select Coffee Beans</el-breadcrumb-item>
        <el-breadcrumb-item class="non-active-bread"
          >Determine the percentage of blending</el-breadcrumb-item
        >
        <el-breadcrumb-item class="non-active-bread">Order</el-breadcrumb-item>
      </el-breadcrumb>
      <el-main v-loading.fullscreen.lock="state.loading">
        <el-row :gutter="20" style="margin-bottom: 15px">
          <el-col
            :span="6"
            v-for="(item, index) in catalogItems"
            :key="index"
            style="margin-bottom: 15px"
          >
            <el-badge
              value="Select"
              type="primary"
              :hidden="!isItemSelected(item.catalogItemObj.catalogItemObj.id).value"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                @click="cardOnclick(item.catalogItemObj.catalogItemObj.id)"
                style="user-select: none"
              >
                <el-image
                  style="width: 100%; height: 200px"
                  :src="item.catalogItemObj.catalogImageObj.imageData.url"
                  fit="cover"
                />
                <div style="margin: 10px">
                  <div class="coffee-title">
                    <el-text tag="b" size="large">{{
                      item.catalogItemObj.catalogItemObj.itemData.name
                    }}</el-text>
                    <el-text
                      ><el-icon><Money /></el-icon> 💲{{
                        item.catalogItemObj.catalogItemObj.itemData.variations[0].itemVariationData
                          .priceMoney.amount / 100
                      }}/g</el-text
                    >
                  </div>
                  <div class="coffee-desc">
                    <el-text size="small">{{
                      item.catalogItemObj.catalogItemObj.itemData.description
                    }}</el-text>
                  </div>
                </div>
              </el-card>
            </el-badge>
          </el-col>
        </el-row>
      </el-main>
    </el-main>
    <el-footer>
      <el-button
        class="next-btn"
        :icon="ArrowRight"
        type="primary"
        size="large"
        :disabled="!hasSelectedItems"
        @click="nextStep()"
        >Next Step</el-button
      >
    </el-footer>
    <div v-if="state.error">
      <p>Error: {{ state.error }}</p>
    </div>
  </div>
</template>

<style scoped>
.coffee-title {
  display: flex;
  justify-content: space-between;
}
.coffee-desc {
  line-height: 17px;
}
.el-card:active {
  background-color: #e6e8eb;
  border: solid #409eff thin;
}
.el-badge {
  height: 100%;
}
.el-card {
  height: 100%;
}
.next-btn {
  width: 80vw;
  display: block;
  margin: 0 auto;
}
</style>
