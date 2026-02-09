<template>
  <n-card :bordered="false" title="缓存分类使用总计" class="monitor-card" size="small">
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

    // 生成0.1到2048000之间的随机数作为各类缓存使用总量(MB)
    const systemData = Math.random() * (2048000 - 0.1) + 0.1; // 系统数据
    const iotData = Math.random() * (2048000 - 0.1) + 0.1; // IOT数据
    const businessData = Math.random() * (2048000 - 0.1) + 0.1; // 业务数据
    const otherData = Math.random() * (2048000 - 0.1) + 0.1; // 其他

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: '缓存分类使用总计',
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
            { value: systemData, name: '系统数据' },
            { value: iotData, name: 'IOT数据' },
            { value: businessData, name: '业务数据' },
            { value: otherData, name: '其他' },
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
