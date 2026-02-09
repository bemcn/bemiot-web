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
        trigger: 'axis',
      },
      legend: {
        data: ['紧急告警', '重要告警', '一般告警'],
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
        data: props.data.map((item: any) => item.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '紧急告警',
          type: 'line',
          stack: '总量',
          data: props.data.map((item: any) => item.critical),
          smooth: true,
          areaStyle: {},
        },
        {
          name: '重要告警',
          type: 'line',
          stack: '总量',
          data: props.data.map((item: any) => item.major),
          smooth: true,
          areaStyle: {},
        },
        {
          name: '一般告警',
          type: 'line',
          stack: '总量',
          data: props.data.map((item: any) => item.minor),
          smooth: true,
          areaStyle: {},
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
