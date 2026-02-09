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

    const dates = (props.data as any[]).map((item) => item.date);
    const productA = (props.data as any[]).map((item) => item.productA);
    const productB = (props.data as any[]).map((item) => item.productB);
    const productC = (props.data as any[]).map((item) => item.productC);

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['产品A', '产品B', '产品C'],
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
        data: dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '产品A',
          type: 'line',
          data: productA,
          smooth: true,
          lineStyle: {
            width: 2,
          },
        },
        {
          name: '产品B',
          type: 'line',
          data: productB,
          smooth: true,
          lineStyle: {
            width: 2,
          },
        },
        {
          name: '产品C',
          type: 'line',
          data: productC,
          smooth: true,
          lineStyle: {
            width: 2,
          },
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
