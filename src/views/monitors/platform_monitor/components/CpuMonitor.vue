<template>
  <n-card :bordered="false" title="CPU监控" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-descriptions label-placement="left" size="small" :column="2">
        <n-descriptions-item label="核心数"> 8核 </n-descriptions-item>
        <n-descriptions-item label="基准频率"> 3.60 GHz </n-descriptions-item>
        <n-descriptions-item label="当前使用率">
          <n-progress type="line" :percentage="cpuUsage" :color="getColor(cpuUsage)" />
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
  const cpuUsage = ref(25);
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
      usageData.push(Math.floor(Math.random() * 30) + 10);
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
            color: '#34c388',
          },
          lineStyle: {
            color: '#34c388',
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
    const newData = Math.floor(Math.random() * 50) + 10;
    usageData.shift();
    usageData.push(newData);
    
    // 更新时间轴数据
    timeData.shift();
    timeData.push(`${Date.now()}`);

    // 使用 ECharts 的数据集操作实现无刷新滚动
    chart.setOption({
      xAxis: {
        data: timeData
      },
      series: [
        {
          data: usageData
        }
      ]
    });

    // 更新CPU使用率
    cpuUsage.value = newData;
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
