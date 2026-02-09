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
          name: '告警级别分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
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
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: props.data,
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
