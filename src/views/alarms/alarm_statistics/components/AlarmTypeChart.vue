<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  import echarts from '@/utils/lib/echarts';

  const chartRef = ref<HTMLDivElement | null>(null);
  let chartInstance: echarts.ECharts | null = null;

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  const initChart = () => {
    if (!chartRef.value) return;

    chartInstance = echarts.init(chartRef.value);
    updateChart();

    window.addEventListener('resize', handleResize);
  };

  const updateChart = () => {
    if (!chartInstance || !props.data) return;

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: '告警类型分布',
          type: 'pie',
          radius: '50%',
          data: props.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    chartInstance.setOption(option, true);
  };

  const handleResize = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };

  watch(
    () => props.data,
    () => {
      nextTick(() => {
        updateChart();
      });
    },
    { deep: true }
  );

  onMounted(() => {
    initChart();
  });
</script>
