<template>
  <div class="alarm-statistics">
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="告警统计">
        物联网告警统计分析页面，展示各类告警的数量、趋势及分布情况
      </n-card>
    </div>

    <!-- 统计卡片 -->
    <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8" class="mt-4">
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="告警总数"
            :value="alarmStats.total"
            icon="alarm"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="紧急告警"
            :value="alarmStats.critical"
            icon="critical"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="重要告警"
            :value="alarmStats.major"
            icon="major"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="一般告警"
            :value="alarmStats.minor"
            icon="minor"
            :loading="loading"
          />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 告警趋势图 -->
    <n-card class="mt-4" :bordered="false">
      <template #header>
        <n-skeleton v-if="loading" text :repeat="1" width="20%" />
        <span v-else>近7天告警趋势</span>
      </template>
      <div class="chart-container">
        <n-skeleton v-if="loading" height="300px" />
        <alarm-trend-chart v-else :data="alarmTrendData" style="height: 400px; width: 100%" />
      </div>
    </n-card>

    <!-- 告警分类统计 -->
    <n-grid class="mt-4" cols="1 s:1 m:1 l:1 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="8">
      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>告警级别分布</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <alarm-level-chart v-else :data="alarmLevelData" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loading" text :repeat="1" width="30%" />
            <span v-else>告警类型分布</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loading" height="300px" />
            <alarm-type-chart v-else :data="alarmTypeData" style="height: 300px" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 设备告警排行 -->
    <n-card class="mt-4" :bordered="false">
      <template #header>
        <n-skeleton v-if="loading" text :repeat="1" width="20%" />
        <span v-else>设备告警排行(TOP 10)</span>
      </template>
      <div class="chart-container">
        <n-skeleton v-if="loading" height="300px" />
        <device-alarm-ranking-chart
          v-else
          :data="deviceAlarmRankingData"
          style="height: 400px; width: 100%"
        />
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  // @ts-ignore
  import StatisticCard from '@/views/datas/agg_analysis/components/StatisticCard.vue';
  // @ts-ignore
  import AlarmTrendChart from './components/AlarmTrendChart.vue';
  // @ts-ignore
  import AlarmLevelChart from './components/AlarmLevelChart.vue';
  // @ts-ignore
  import AlarmTypeChart from './components/AlarmTypeChart.vue';
  // @ts-ignore
  import DeviceAlarmRankingChart from './components/DeviceAlarmRankingChart.vue';

  // 定义统计数据接口
  interface AlarmStats {
    total: number;
    critical: number;
    major: number;
    minor: number;
  }

  // 初始化数据
  const loading = ref(true);
  const alarmStats = ref<AlarmStats>({
    total: 0,
    critical: 0,
    major: 0,
    minor: 0,
  });

  // 图表数据
  const alarmTrendData = ref<any[]>([]);
  const alarmLevelData = ref<any[]>([]);
  const alarmTypeData = ref<any[]>([]);
  const deviceAlarmRankingData = ref<any[]>([]);

  // 模拟加载数据
  const loadData = async () => {
    loading.value = true;

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 设置统计数据
    alarmStats.value = {
      total: 128,
      critical: 12,
      major: 36,
      minor: 80,
    };

    // 设置图表数据
    alarmTrendData.value = [
      { date: '周一', critical: 2, major: 5, minor: 8 },
      { date: '周二', critical: 1, major: 7, minor: 12 },
      { date: '周三', critical: 3, major: 4, minor: 6 },
      { date: '周四', critical: 0, major: 6, minor: 10 },
      { date: '周五', critical: 4, major: 8, minor: 15 },
      { date: '周六', critical: 1, major: 3, minor: 7 },
      { date: '周日', critical: 1, major: 5, minor: 9 },
    ];

    alarmLevelData.value = [
      { name: '紧急告警', value: 12 },
      { name: '重要告警', value: 36 },
      { name: '一般告警', value: 80 },
    ];

    alarmTypeData.value = [
      { name: '设备离线', value: 42 },
      { name: '阈值告警', value: 38 },
      { name: '通信异常', value: 26 },
      { name: '硬件故障', value: 15 },
      { name: '其他', value: 7 },
    ];

    deviceAlarmRankingData.value = [
      { name: '温湿度传感器01', value: 28 },
      { name: '空气质量监测仪03', value: 24 },
      { name: '智能电表05', value: 19 },
      { name: '水位监测设备02', value: 16 },
      { name: '烟雾报警器07', value: 12 },
      { name: '红外探测器11', value: 9 },
      { name: '门禁控制器09', value: 7 },
      { name: '摄像头04', value: 6 },
      { name: 'UPS电源设备08', value: 4 },
      { name: '空调控制设备06', value: 3 },
    ];

    loading.value = false;
  };

  onMounted(() => {
    loadData();
  });
</script>

<style lang="less" scoped>
  .alarm-statistics {
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
