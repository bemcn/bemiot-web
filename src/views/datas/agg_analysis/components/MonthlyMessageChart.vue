<template>
  <div ref="chartRef" class="chart" style="width: 100%; height: 100%"></div>
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
        trigger: 'axis',
      },
      legend: {
        data: ['消息接收', '消息发送'],
      },
      grid: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (props.data as any[]).map((item) => `${item.day}日`),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '消息接收',
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(52, 195, 136)', // 与标签颜色一致 #34c388
              },
              {
                offset: 1,
                color: 'rgba(52, 195, 136)', // 与标签颜色一致 #34c388
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: (props.data as any[]).map((item) => item.receive),
        },
        {
          name: '消息发送',
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(113, 137, 208)', // 与标签颜色一致 #7189d0
              },
              {
                offset: 1,
                color: 'rgba(113, 137, 208)', // 与标签颜色一致 #7189d0
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: (props.data as any[]).map((item) => item.send),
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
