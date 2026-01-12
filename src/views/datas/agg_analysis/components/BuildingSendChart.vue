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
    const main = (props.data as any[]).map((item) => item.main);
    const east = (props.data as any[]).map((item) => item.east);
    const west = (props.data as any[]).map((item) => item.west);
    const basement1 = (props.data as any[]).map((item) => item.basement1);
    const basement2 = (props.data as any[]).map((item) => item.basement2);

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['主楼', '东附属楼', '西附属楼', '地下一层', '地下二层'],
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
          name: '主楼',
          type: 'line',
          data: main,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#409eff',
          },
          itemStyle: {
            color: '#409eff',
          },
        },
        {
          name: '东附属楼',
          type: 'line',
          data: east,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#67c23a',
          },
          itemStyle: {
            color: '#67c23a',
          },
        },
        {
          name: '西附属楼',
          type: 'line',
          data: west,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#e6a23c',
          },
          itemStyle: {
            color: '#e6a23c',
          },
        },
        {
          name: '地下一层',
          type: 'line',
          data: basement1,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#909399',
          },
          itemStyle: {
            color: '#909399',
          },
        },
        {
          name: '地下二层',
          type: 'line',
          data: basement2,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#34c388',
          },
          itemStyle: {
            color: '#34c388',
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
