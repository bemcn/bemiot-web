<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  let chartInstance: echarts.ECharts | null = null;

  const initChart = () => {
    if (chartRef.value) {
      chartInstance = echarts.init(chartRef.value);
      renderChart();
    }
  };

  const renderChart = () => {
    if (!chartInstance || !props.data.length) return;

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
        type: 'scroll'
      },
      series: [
        {
          name: 'IoT数据统计',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            // 去除圆角
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true,
          },
          data: props.data,
        },
      ],
    };

    chartInstance.setOption(option, true);
  };

  watch(
    () => props.data,
    () => {
      if (chartInstance) {
        renderChart();
      }
    },
    { deep: true }
  );

  onMounted(() => {
    nextTick(() => {
      initChart();

      // 添加窗口大小调整监听
      window.addEventListener('resize', () => {
        if (chartInstance) {
          chartInstance.resize();
        }
      });
    });
  });

  defineExpose({
    resize: () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    },
  });
</script>

<style lang="less" scoped>
  .chart {
    width: 100%;
    height: 100%;
  }
</style>