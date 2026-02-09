<template>
  <n-card :bordered="false" title="设备消息总计" class="monitor-card" size="small">
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

    // 随机生成数据
    const send = Math.floor(Math.random() * 10000) + 1000;
    const receive = Math.floor(Math.random() * 10000) + 1000;
    const alarm = Math.floor(Math.random() * 1000) + 100;
    const event = Math.floor(Math.random() * 2000) + 200;

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: '设备消息总计',
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
            { value: send, name: '发送消息' },
            { value: receive, name: '接收消息' },
            { value: alarm, name: '设备告警' },
            { value: event, name: '事件上报' },
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
    .chart-container {
      height: 100%;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
