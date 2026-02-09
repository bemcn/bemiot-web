<template>
  <n-card :bordered="false" title="内存监控" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-descriptions label-placement="left" size="small" :column="2">
        <n-descriptions-item label="总内存"> 16 GB </n-descriptions-item>
        <n-descriptions-item label="已使用"> 8.5 GB </n-descriptions-item>
        <n-descriptions-item label="使用率">
          <n-progress type="line" :percentage="memoryUsage" :color="getColor(memoryUsage)" />
        </n-descriptions-item>
      </n-descriptions>
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
  const memoryUsage = ref(53);
  let timeData: string[] = [];
  let usageData: number[] = [];

  // 根据使用率返回颜色
  const getColor = (usage: number) => {
    if (usage < 50) {
      return '#18a058';
    } else if (usage < 80) {
      return '#f0a020';
    } else {
      return '#d03050';
    }
  };

  // 初始化图表数据
  const initChartData = () => {
    timeData = [];
    usageData = [];
    for (let i = 0; i < 60; i++) {
      timeData.push(`${i}s`);
      usageData.push(Math.floor(Math.random() * 40) + 20);
    }
  };

  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    chart = init(chartRef.value);

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '10%',
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeData,
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          data: usageData,
          type: 'line',
          areaStyle: {
            color: '#7189d0',
          },
          lineStyle: {
            color: '#7189d0',
          },
          showSymbol: false,
        },
      ],
    };

    chart.setOption(option);

    // 自适应
    window.addEventListener('resize', handleResize);
  };

  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  // 模拟数据更新
  let dataTimer: ReturnType<typeof setInterval> | null = null;
  const updateData = () => {
    if (!chart) return;

    // 添加新数据点
    const newData = Math.floor(Math.random() * 50) + 20;
    usageData.shift();
    usageData.push(newData);

    // 更新时间轴数据
    timeData.shift();
    timeData.push(`${Date.now()}`);

    // 使用 ECharts 的数据集操作实现无刷新滚动
    chart.setOption({
      xAxis: {
        data: timeData,
      },
      series: [
        {
          data: usageData,
        },
      ],
    });

    // 更新内存使用率
    memoryUsage.value = newData;
  };

  onMounted(() => {
    initChartData();
    nextTick(() => {
      initChart();

      // 每秒更新一次数据
      dataTimer = setInterval(updateData, 1000);
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
      height: 40%;
    }
    .chart-container {
      height: 60%;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
