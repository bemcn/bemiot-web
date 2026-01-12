<template>
  <n-card :bordered="false" title="内存占比统计" class="monitor-card" size="small">
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

    // 随机生成各类任务数据
    const scheduledTask = Math.floor(Math.random() * 300) + 200; // 定时任务
    const sceneLinkage = Math.floor(Math.random() * 250) + 150; // 场景联动
    const mqttDevice = Math.floor(Math.random() * 200) + 100; // MQTTDrivice
    const modbusDevice = Math.floor(Math.random() * 250) + 150; // ModBus Drivice
    const tcpDevice = Math.floor(Math.random() * 300) + 200; // TCP Drivice
    const videoServer = Math.floor(Math.random() * 150) + 50; // Video Server

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: '内存占比统计',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0, // 饼图不要圆角
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'normal',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: scheduledTask, name: '定时任务' },
            { value: sceneLinkage, name: '场景联动' },
            { value: mqttDevice, name: 'MQTTDrivice' },
            { value: modbusDevice, name: 'ModBus Drivice' },
            { value: tcpDevice, name: 'TCP Drivice' },
            { value: videoServer, name: 'Video Server' },
          ],
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

  // 数据更新
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
    .chart-container {
      height: 100%;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
