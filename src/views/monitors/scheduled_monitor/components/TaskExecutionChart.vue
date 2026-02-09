<template>
  <n-card :bordered="false" title="任务执行情况统计" class="monitor-card" size="small">
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
    const successData: number[] = [];
    const failData: number[] = [];
    const exceptionData: number[] = [];

    let count = 0;
    if (timeRange.value === 'day') {
      count = 24; // 24小时
    } else if (timeRange.value === 'week') {
      count = 7; // 7天
    } else {
      count = 30; // 30天
    }

    for (let i = 0; i < count; i++) {
      data.push(
        timeRange.value === 'day'
          ? `${i}:00`
          : timeRange.value === 'week'
          ? `第${i + 1}天`
          : `${i + 1}日`
      );
      successData.push(Math.floor(Math.random() * 100));
      failData.push(Math.floor(Math.random() * 50));
      exceptionData.push(Math.floor(Math.random() * 30));
    }

    return { data, successData, failData, exceptionData };
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

    const { data, successData, failData, exceptionData } = initChartData();

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['成功', '失败', '异常'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '成功',
          type: 'line',
          data: successData,
          smooth: true,
          lineStyle: {
            width: 2,
          },
        },
        {
          name: '失败',
          type: 'line',
          data: failData,
          smooth: true,
          lineStyle: {
            width: 2,
          },
        },
        {
          name: '异常',
          type: 'line',
          data: exceptionData,
          smooth: true,
          lineStyle: {
            width: 2,
          },
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
