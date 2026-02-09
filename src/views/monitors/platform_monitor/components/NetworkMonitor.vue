<template>
  <n-card :bordered="false" title="网络监控" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-descriptions label-placement="left" size="small" :column="2">
        <n-descriptions-item label="网卡"> Realtek RTL8168 </n-descriptions-item>
        <n-descriptions-item label="IP地址"> 192.168.1.100 </n-descriptions-item>
        <n-descriptions-item label="上传速度"> {{ uploadSpeed }} Mbps </n-descriptions-item>
        <n-descriptions-item label="下载速度"> {{ downloadSpeed }} Mbps </n-descriptions-item>
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
  let chart: any | null = null;
  const uploadSpeed = ref(12.5);
  const downloadSpeed = ref(45.3);
  let timeData: string[] = [];
  let uploadData: number[] = [];
  let downloadData: number[] = [];

  // 初始化图表数据
  const initChartData = () => {
    timeData = [];
    uploadData = [];
    downloadData = [];
    for (let i = 0; i < 60; i++) {
      timeData.push(`${i}s`);
      uploadData.push(Math.floor(Math.random() * 20) + 5);
      downloadData.push(Math.floor(Math.random() * 50) + 20);
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
      legend: {
        data: ['上传', '下载'],
        textStyle: {
          fontSize: 10,
        },
        top: 0,
      },
      grid: {
        top: '20%',
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
          name: '上传',
          data: uploadData,
          type: 'line',
          areaStyle: {
            color: '#34c388',
          },
          lineStyle: {
            color: '#34c388',
          },
          showSymbol: false,
        },
        {
          name: '下载',
          data: downloadData,
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
    const newUpload = Math.floor(Math.random() * 30) + 5;
    const newDownload = Math.floor(Math.random() * 60) + 20;
    uploadData.shift();
    downloadData.shift();
    uploadData.push(newUpload);
    downloadData.push(newDownload);

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
          data: uploadData,
        },
        {
          data: downloadData,
        },
      ],
    });

    // 更新网络速度
    uploadSpeed.value = parseFloat((Math.random() * 30 + 5).toFixed(1));
    downloadSpeed.value = parseFloat((Math.random() * 70 + 20).toFixed(1));
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
