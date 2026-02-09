<template>
  <n-card :bordered="false" title="缓存使用情况统计" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-space justify="end" class="control-space">
        <n-radio-group v-model:value="timeRange" @update:value="handleTimeRangeChange">
          <n-radio-button value="day">日统计</n-radio-button>
          <n-radio-button value="week">周统计</n-radio-button>
          <n-radio-button value="month">月统计</n-radio-button>
        </n-radio-group>
      </n-space>
    </div>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { init } from '@/utils/lib/echarts';
  // @ts-ignore
  import * as echarts from '@/utils/lib/echarts';

  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: ReturnType<typeof init> | null = null;
  const timeRange = ref('day');

  // 初始化图表数据
  const initChartData = () => {
    const data: string[] = [];
    const readData: number[] = [];
    const writeData: number[] = [];

    let count = 0;
    if (timeRange.value === 'day') {
      count = 24; // 24小时
    } else if (timeRange.value === 'week') {
      count = 7; // 7天
    } else {
      count = 30; // 30天
    }

    for (let i = 0; i < count; i++) {
      const label =
        timeRange.value === 'day'
          ? `${i}:00`
          : timeRange.value === 'week'
          ? `第${i + 1}天`
          : `${i + 1}日`;
      data.push(label);
      // 生成0.1到20480之间的随机数作为缓存使用量(MB)
      readData.push(Math.random() * (20480 - 0.1) + 0.1);
      writeData.push(Math.random() * (20480 - 0.1) + 0.1);
    }

    return { data, readData, writeData };
  };

  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    chart = init(chartRef.value);
    updateChart();

    window.addEventListener('resize', handleResize);
  };

  // 更新图表
  const updateChart = () => {
    if (!chart) return;

    const { data, readData, writeData } = initChartData();

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['读', '写'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: data,
      },
      yAxis: {
        type: 'value',
        name: '缓存使用量(MB)',
        min: 0.1,
        max: 20480,
      },
      series: [
        {
          name: '读',
          type: 'bar',
          data: readData,
          barGap: '10%',
        },
        {
          name: '写',
          type: 'bar',
          data: writeData,
          barGap: '10%',
        },
      ],
    };

    chart.setOption(option);
  };

  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  const handleTimeRangeChange = () => {
    updateChart();
  };

  // 模拟数据更新
  let dataTimer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    nextTick(() => {
      initChart();

      // 每60分钟更新一次数据
      dataTimer = setInterval(updateChart, 3600000);
    });
  });

  onBeforeUnmount(() => {
    if (chart) {
      chart.dispose();
    }

    if (dataTimer) {
      clearInterval(dataTimer);
    }

    window.removeEventListener('resize', handleResize);
  });
</script>

<style lang="less" scoped>
  .monitor-card {
    height: 300px;
    .monitor-info {
      height: 20%;
    }
    .control-space {
      margin-bottom: 10px;
    }
    .chart-container {
      height: 80%;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
