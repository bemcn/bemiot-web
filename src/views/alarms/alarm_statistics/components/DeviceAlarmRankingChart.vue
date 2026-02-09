<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  import echarts from '@/utils/lib/echarts';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';

  const { getDarkTheme } = useDesignSetting();

  const chartRef = ref<HTMLDivElement | null>(null);
  let chartInstance: echarts.ECharts | null = null;

  interface DataItem {
    name: string;
    value: number;
  }

  const props = defineProps<{
    data: DataItem[];
  }>();

  const initChart = () => {
    if (!chartRef.value) return;

    chartInstance = echarts.init(chartRef.value, getDarkTheme.value ? 'dark' : undefined);
    updateChart();

    window.addEventListener('resize', handleResize);
  };

  interface DataItem {
    name: string;
    value: number;
  }

  const updateChart = () => {
    if (!chartInstance || !props.data) return;

    const sortedData = [...props.data].sort((a, b) => a.value - b.value);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: sortedData.map((item) => item.name),
      },
      series: [
        {
          name: '告警次数',
          type: 'bar',
          data: sortedData.map((item) => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
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

  watch(
    () => getDarkTheme.value,
    () => {
      if (chartInstance) {
        chartInstance.dispose();
        initChart();
      }
    }
  );

  onMounted(() => {
    initChart();
  });
</script>
