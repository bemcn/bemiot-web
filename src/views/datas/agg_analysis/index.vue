<template>
  <div class="data-statistics">
    <!-- 第一行：6个统计数据 -->
    <n-grid cols="1 s:2 m:3 l:3 xl:6 2xl:6" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="产品数量"
            :value="statistics.productCount"
            icon="product"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="设备数量"
            :value="statistics.deviceCount"
            icon="device"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="消息接收"
            :value="statistics.receivedMessages"
            icon="receive"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="消息发送"
            :value="statistics.sentMessages"
            icon="send"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="日志数量"
            :value="statistics.logCount"
            icon="log"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="告警数量"
            :value="statistics.alarmCount"
            icon="alarm"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 第二行：月度消息发送接收统计图 -->
    <n-card class="mt-4" :bordered="false">
      <template #header>
        <n-skeleton v-if="loading" text :repeat="1" width="20%" />
        <span v-else>31日消息发送接收统计</span>
      </template>
      <div class="chart-container">
        <n-skeleton v-if="loading" height="300px" />
        <monthly-message-chart
          v-else
          :data="monthlyMessageData"
          style="height: 400px; width: 100%"
        />
      </div>
    </n-card>

    <!-- 第三行：按产品分类的消息统计 -->
    <n-grid class="mt-4" cols="1 s:1 m:1 l:1 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="8">
      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>按产品分类的近7天消息接收统计</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <product-receive-chart v-else :data="productReceiveData" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>按产品分类的近7天消息发送统计</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <product-send-chart v-else :data="productSendData" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 第四行：按楼栋分类的消息统计 -->
    <n-grid class="mt-4" cols="1 s:1 m:1 l:1 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="8">
      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>按楼栋近7天消息接收统计</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <building-receive-chart v-else :data="buildingReceiveData" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>按楼栋近7天消息发送统计</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <building-send-chart v-else :data="buildingSendData" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 第五行：基础数据和IoT数据分类统计 -->
    <n-grid class="mt-4" cols="1 s:1 m:1 l:1 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="8">
      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>基础数据分类统计</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <base-data-chart v-else :data="baseDataStats" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>IoT数据分类统计</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <iot-data-chart v-else :data="iotDataStats" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  // @ts-ignore
  import StatisticCard from './components/StatisticCard.vue';
  // @ts-ignore
  import MonthlyMessageChart from './components/MonthlyMessageChart.vue';
  // @ts-ignore
  import ProductReceiveChart from './components/ProductReceiveChart.vue';
  // @ts-ignore
  import ProductSendChart from './components/ProductSendChart.vue';
  // @ts-ignore
  import BuildingReceiveChart from './components/BuildingReceiveChart.vue';
  // @ts-ignore
  import BuildingSendChart from './components/BuildingSendChart.vue';
  // @ts-ignore
  import BaseDataChart from './components/BaseDataChart.vue';
  // @ts-ignore
  import IotDataChart from './components/IotDataChart.vue';

  // 定义统计数据接口
  interface Statistics {
    productCount: number;
    deviceCount: number;
    receivedMessages: number;
    sentMessages: number;
    logCount: number;
    alarmCount: number;
  }

  // 初始化数据
  const loading = ref(true);
  const statistics = ref<Statistics>({
    productCount: 0,
    deviceCount: 0,
    receivedMessages: 0,
    sentMessages: 0,
    logCount: 0,
    alarmCount: 0,
  });

  // 图表数据
  const monthlyMessageData = ref<any[]>([]);
  const productReceiveData = ref<any[]>([]);
  const productSendData = ref<any[]>([]);
  const buildingReceiveData = ref<any[]>([]);
  const buildingSendData = ref<any[]>([]);
  const baseDataStats = ref<any[]>([]);
  const iotDataStats = ref<any[]>([]);

  // 模拟加载数据
  const loadData = async () => {
    loading.value = true;

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 设置统计数据
    statistics.value = {
      productCount: 5,
      deviceCount: 6,
      receivedMessages: 120,
      sentMessages: 67,
      logCount: 321,
      alarmCount: 0,
    };

    // 设置图表数据
    monthlyMessageData.value = [
      { day: '1', receive: 0, send: 0 },
      { day: '2', receive: 0, send: 0 },
      { day: '3', receive: 0, send: 0 },
      { day: '4', receive: 0, send: 0 },
      { day: '5', receive: 0, send: 0 },
      { day: '6', receive: 0, send: 0 },
      { day: '7', receive: 0, send: 0 },
      { day: '8', receive: 0, send: 0 },
      { day: '9', receive: 0, send: 0 },
      { day: '10', receive: 0, send: 0 },
      { day: '11', receive: 0, send: 0 },
      { day: '12', receive: 0, send: 0 },
      { day: '13', receive: 14, send: 12 },
      { day: '14', receive: 23, send: 18 },
      { day: '15', receive: 0, send: 0 },
      { day: '16', receive: 0, send: 0 },
      { day: '17', receive: 0, send: 0 },
      { day: '18', receive: 0, send: 0 },
      { day: '19', receive: 0, send: 0 },
      { day: '20', receive: 0, send: 0 },
      { day: '21', receive: 0, send: 0 },
      { day: '22', receive: 0, send: 0 },
      { day: '23', receive: 0, send: 0 },
      { day: '24', receive: 12, send: 6 },
      { day: '25', receive: 22, send: 8 },
      { day: '26', receive: 28, send: 11 },
      { day: '27', receive: 21, send: 12 },
      { day: '28', receive: 0, send: 0 },
      { day: '29', receive: 0, send: 0 },
      { day: '30', receive: 0, send: 0 },
      { day: '31', receive: 0, send: 0 },
    ];

    productReceiveData.value = [
      { date: '周一', productA: 18, productB: 4, productC: 0 },
      { date: '周二', productA: 17, productB: 7, productC: 4 },
      { date: '周三', productA: 12, productB: 8, productC: 1 },
      { date: '周四', productA: 0, productB: 0, productC: 100 },
      { date: '周五', productA: 0, productB: 0, productC: 0 },
      { date: '周六', productA: 0, productB: 0, productC: 0 },
      { date: '周日', productA: 0, productB: 0, productC: 0 },
    ];

    productSendData.value = [
      { date: '周一', productA: 6, productB: 2, productC: 1 },
      { date: '周二', productA: 8, productB: 2, productC: 1 },
      { date: '周三', productA: 8, productB: 3, productC: 1 },
      { date: '周四', productA: 0, productB: 0, productC: 0 },
      { date: '周五', productA: 0, productB: 0, productC: 0 },
      { date: '周六', productA: 0, productB: 0, productC: 0 },
      { date: '周日', productA: 0, productB: 0, productC: 0 },
    ];

    buildingReceiveData.value = [
      { date: '周一', main: 12, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周二', main: 28, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周三', main: 21, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周四', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周五', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周六', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周日', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
    ];

    buildingSendData.value = [
      { date: '周一', main: 8, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周二', main: 11, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周三', main: 12, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周四', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周五', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周六', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
      { date: '周日', main: 0, east: 0, west: 0, basement1: 0, basement2: 0 },
    ];

    baseDataStats.value = [
      { name: '产品', value: 17 },
      { name: '设备', value: 26 },
      { name: '业务', value: 564 },
      { name: '基本数据', value: 4817 },
    ];

    iotDataStats.value = [
      { name: '属性', value: 120 },
      { name: '事件', value: 12 },
      { name: '日志', value: 1421 },
    ];

    loading.value = false;
  };

  onMounted(() => {
    loadData();
  });
</script>

<style lang="less" scoped>
  .data-statistics {
    padding: 16px;
    .chart-container {
      width: 100%;
      height: 100%;
    }
    .mt-4 {
      margin-top: 16px;
    }
  }
</style>
