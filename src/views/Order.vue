<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router'
import { useCoffeeStore } from '../stores/coffeeStore'
import { ArrowLeft, Check, Money, Goods, ShoppingCart } from '@element-plus/icons-vue';
import axios from 'axios'

const router = useRouter()
const coffeeStore = useCoffeeStore();

const selected = coffeeStore.selected;
const amount = coffeeStore.amount;
const weights = coffeeStore.weights;

const displays = computed(()=>selected.filter(item => (item.num ?? 0) > 0));

const goBack = () => { router.push("/blend-ratio"); };
const confirm = () => {
    // Get Order
    const order = coffeeStore.orderObj;

    // Request Payment to Terminal

    // Loading is on

    router.push("/");
};
</script>

<template>
    <el-main style="height:70vh">
        <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom:15px;">
            <el-breadcrumb-item >Select Coffee Beans</el-breadcrumb-item>
            <el-breadcrumb-item >Determine the percentage of blending</el-breadcrumb-item>
            <el-breadcrumb-item class="active-bread">Order</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin-bottom: 30px;">
            <el-text tag="b" size="large">
                Do you want to order with the followings?
            </el-text>
        </div>
        <el-descriptions title="Order Detail" :column="2" size="Large" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Money /></el-icon>
                        Total Amount
                    </div>
                </template>
                <el-text size="large">${{ amount.toFixed(2) }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><Goods /></el-icon>
                        Total Weight
                    </div>
                </template>
                <el-text size="large">{{ weights }}g</el-text>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon><ShoppingCart /></el-icon>
                        Items
                    </div>
                </template>
                <span v-for="(item, index) in displays" :key="item.name">
                    <br v-if="index > 0"/>
                    <el-text size="large">{{ `・ ${item.name} ${item.num}g` }}</el-text>
                </span>
            </el-descriptions-item>
        </el-descriptions>
    </el-main>
    <el-footer class="btn-area">
        <el-button  
        style="width:20vw" 
        :icon="ArrowLeft" type="danger" size="large"
        @click="goBack()">
            Back
        </el-button>
        <el-button  
        style="width:60vw" 
        :icon="Check" type="primary" size="large" 
        @click="confirm()">
            Confirm
        </el-button>
    </el-footer>
</template>

<style scoped>
.btn-area{
    display: flex;
    justify-content: center;
}
</style>