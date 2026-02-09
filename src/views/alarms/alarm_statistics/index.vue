<template>
  <div class="alarm-statistics">
    <!-- 统计卡片 -->
    <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8" class="mt-4">
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="告警总数"
            :value="alarmStats.total"
            icon="alarm"
            :loading="loadingTotal"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="紧急告警"
            :value="alarmStats.critical"
            icon="critical"
            :loading="loadingTotal"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="重要告警"
            :value="alarmStats.major"
            icon="major"
            :loading="loadingTotal"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card :segmented="{ content: true }" size="small" :bordered="false">
          <statistic-card
            title="一般告警"
            :value="alarmStats.minor"
            icon="minor"
            :loading="loadingTotal"
          />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 告警趋势图 -->
    <n-card class="mt-4" :bordered="false">
      <template #header>
        <n-skeleton v-if="loadingSeven" text :repeat="1" width="20%" />
        <span v-else>近7天告警趋势</span>
      </template>
      <div class="chart-container">
        <n-skeleton v-if="loadingSeven" height="300px" />
        <alarm-trend-chart v-else :data="alarmTrendData" style="height: 400px; width: 100%" />
      </div>
    </n-card>

    <!-- 告警分类统计 -->
    <n-grid class="mt-4" cols="6" item-responsive :x-gap="12" :y-gap="8">
      <n-grid-item span="6 800:2">
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loadingTotal" text :repeat="1" width="30%" />
            <span v-else>告警级别分布</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loadingTotal" height="400px" />
            <alarm-level-chart v-else :data="alarmLevelData" style="height: 400px" />
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="6 800:4">
        <n-card :bordered="false">
          <template #header>
            <n-skeleton v-if="loadingRanking" text :repeat="1" width="30%" />
            <span v-else>设备告警排行(TOP 10)</span>
          </template>
          <div class="chart-container">
            <n-skeleton v-if="loadingRanking" height="400px" />
            <alarm-ranking-chart
              v-else
              :data="deviceAlarmRankingData"
              style="height: 400px; width: 100%"
            />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 最新告警10条 -->
    <n-card class="mt-4" :bordered="false">
      <template #header>
        <n-skeleton v-if="loadingTopNum" text :repeat="1" width="20%" />
        <span v-else>最新告警信息(TOP 10)</span>
      </template>
      <div class="chart-container">
        <n-skeleton v-if="loadingTopNum" height="300px" />
        <alarm-new-top v-else :data="deviceAlarmRankingData" style="width: 100%" />
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import {
    getAlarmLogTop,
    totalAlarmLogLevel,
    totalAlarmLogSevenDay,
    rankingAlarmLogDevice,
  } from '@/api/alarm/logModelAlarm';
  // @ts-ignore
  import StatisticCard from '@/views/datas/agg_analysis/components/StatisticCard.vue';
  // @ts-ignore
  import AlarmTrendChart from './components/AlarmTrendChart.vue';
  // @ts-ignore
  import AlarmLevelChart from './components/AlarmLevelChart.vue';
  // @ts-ignore
  import AlarmRankingChart from './components/AlarmRankingChart.vue';
  // @ts-ignore
  import AlarmNewTop from './components/AlarmNewTop.vue';

  // 定义统计数据接口
  interface AlarmStats {
    total: number;
    critical: number;
    major: number;
    minor: number;
  }

  // 初始化数据
  const loadingTotal = ref(true);
  const loadingSeven = ref(true);
  const loadingRanking = ref(true);
  const loadingTopNum = ref(true);
  const alarmStats = ref<AlarmStats>({
    total: 0,
    critical: 0,
    major: 0,
    minor: 0,
  });
  const alarmTrendData = ref<any[]>([]);
  const alarmLevelData = ref<any[]>([]);
  const deviceAlarmRankingData = ref<any[]>([]);
  const alarmList = ref<any[]>([]);

  // 模拟加载数据
  const loadData1 = async () => {
    loadingTotal.value = true;
    const result = (await totalAlarmLogLevel()) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      alarmStats.value = {
        total: result.data.total,
        critical: result.data.critical,
        major: result.data.major,
        minor: result.data.minor,
      };
      alarmLevelData.value = [
        { name: '紧急告警', value: result.data.critical },
        { name: '重要告警', value: result.data.major },
        { name: '一般告警', value: result.data.minor },
      ];
    } else {
      alarmStats.value = {
        total: 0,
        critical: 0,
        major: 0,
        minor: 0,
      };
      alarmLevelData.value = [
        { name: '紧急告警', value: 0 },
        { name: '重要告警', value: 0 },
        { name: '一般告警', value: 0 },
      ];
    }
    loadingTotal.value = false;
  };
  const loadData2 = async () => {
    loadingSeven.value = true;
    const result = (await totalAlarmLogSevenDay()) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      alarmTrendData.value = result.data;
    } else {
      alarmTrendData.value = [];
    }
    loadingSeven.value = false;
  };
  const loadData3 = async () => {
    loadingRanking.value = true;
    const params = {
      size: 10,
    };
    const result = (await rankingAlarmLogDevice(params)) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      deviceAlarmRankingData.value = result.data;
    } else {
      deviceAlarmRankingData.value = [];
    }
    loadingRanking.value = false;
  };
  const loadData4 = async () => {
    loadingTopNum.value = true;
    const params = {};
    const result = (await getAlarmLogTop(params)) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      alarmList.value = result.data;
    } else {
      alarmList.value = [];
    }
    loadingTopNum.value = false;
  };

  onMounted(() => {
    loadData1();
    loadData2();
    loadData3();
    loadData4();
  });
</script>

<style lang="less" scoped>
  .alarm-statistics {
    padding: 0px 16px 16px 16px;
    .chart-container {
      width: 100%;
      height: 100%;
    }
    .mt-4 {
      margin-top: 16px;
    }
  }
</style>
