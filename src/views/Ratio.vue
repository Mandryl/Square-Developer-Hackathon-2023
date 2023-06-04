<script setup>
import { ref } from "vue";
import { ArrowRight, ArrowLeft, ShoppingCart } from '@element-plus/icons-vue';
import apexchart from "vue3-apexcharts";
import robotSVG from '@/assets/robot.svg';

let value1 = ref(0);
let value2 = ref(0);

const series = [
        {
          name: "Blue Moutain",
          data: [400],
        },
        {
          name: "Hawaii Kona",
          data: [700],
        },
      ];

const chartOptions = {
    chart: {
        id: "coffee-blend",
        stacked: true,
        stackType: "100%",
        toolbar: { show: false },
        animations: { enabled: false}
    },
    xaxis: { 
        categories: ["Coffee Blend"],
    },
    yaxis: {
        labels:{show: false}
    },
    plotOptions: {
        bar: { horizontal: true }
    },
    tooltip: { enabled: false}
};
</script>

<template>
    <el-main>
        <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom:15px;">
            <el-breadcrumb-item >Select Coffee Beans</el-breadcrumb-item>
            <el-breadcrumb-item class="active-bread">Determine the percentage of blending</el-breadcrumb-item>
            <el-breadcrumb-item class="non-active-bread">Order</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-statistic class="amount" title="Total Amout" prefix="$" :value="268500" />
        </el-row>
        <el-row>
            <div style="width:80vw; margin: 0 auto;">
                <apexchart
                width="100%"
                height="140px"
                type="bar"
                :options="chartOptions"
                :series="series"
                ></apexchart>
            </div>
        </el-row>
        <el-row style="margin-bottom: 10px;">
            <el-col :span="4">
                <span class="ratio-title">Hawaii Kona</span>
            </el-col>
            <el-col :span="20" style="display: flex;">
                <el-slider v-model="value1" :max="1000" show-input />
                <el-text tag="b" style="margin-left:10px">[g]</el-text>
            </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
            <el-col :span="4">
                <span class="ratio-title">Blue Mountain</span>
            </el-col>
            <el-col :span="20" style="display: flex;">
                <el-slider v-model="value2" :max="1000" show-input />
                <el-text tag="b" style="margin-left:10px">[g]</el-text>
            </el-col>
        </el-row>
        <el-row>
            <div class="ai-intro-wrapper">
                <el-image style="height:150px; width:150px;" :src="robotSVG" fit="contain" />
                <div>
                    <h3>Taste Evaluation with Coffee AI</h3>
                    <el-text class="ai-intro">
                        Coffee AI predicts the taste and aroma of your blends, and describes them in text and images.
                    </el-text>
                    <el-button class="ai-intro-btn" color="#a0cfff">Evaluate</el-button>
                </div>
            </div>
        </el-row>
        <el-row class="ai-row">
            <div>
                <el-avatar class="ai-avatar" :src="robotSVG"/>
            </div>
            <div class="ai-bubble">
                <el-text style="word-break: break-word;">
                    This blend should have a rich, complex flavor with notes of chocolate and citrus. The aroma will be bold and earthy with a touch of sweetness. It will taste like a dark chocolate orange that has been dusted with cinnamon.
                </el-text>
            </div>
        </el-row>
        <el-row class="ai-row" style="margin-top:0;">
            <div>
                <el-avatar class="ai-avatar" :src="robotSVG"/>
            </div>
            <div class="ai-bubble">
                <el-text style="word-break: break-word;">
                    The following images describe the expected taste and aroma.
                </el-text>
            </div>
        </el-row>
        <el-row>
            <div style="margin:0 auto">
                <el-image style="height:150px;width:150px;margin:10px;" src="" fit="contain" />
                <el-image style="height:150px;width:150px;margin:10px;" src="" fit="contain" />
                <el-image style="height:150px;width:150px;margin:10px;" src="" fit="contain" />
                <el-image style="height:150px;width:150px;margin:10px;" src="" fit="contain" />
            </div>
        </el-row>
    </el-main>
    <el-footer class="btn-area">
        <el-button  style="width:20vw" :icon="ArrowLeft" type="danger" size="large">Back</el-button>
        <el-button  style="width:60vw" :icon="ShoppingCart" type="primary" size="large">Order</el-button>
    </el-footer>
</template>

<style scoped>
.blend-info{
    margin-bottom: 15px;
    justify-content: space-between;
    align-items: center;
}
.btn-area{
    display: flex;
    justify-content: center;
}
.ai-avatar{
    background-color: #a0cfff;
}
.ai-row{
    flex-wrap: nowrap;
    /* border: #CDD0D6 solid thin; */
    padding:15px;
    margin-top:  20px;
}
.ai-bubble{
    padding:10px;
    margin-left:20px; 
    border: #CDD0D6 solid thin; 
    border-radius: 8px; 
}
.ai-intro{
    display: block; 
    word-break: break-word;
    margin-bottom: 10px;
}
.ai-intro-wrapper{
    width:60vw; display: flex; margin: 0 auto
}
.ai-intro-btn{
    display: block;
    margin: 0 auto;
    width: 100%;
}
</style>