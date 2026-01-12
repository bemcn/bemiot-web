<template>
  <n-card :bordered="false" title="CPU消耗监控" class="monitor-card" size="small">
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
  import { init } from '@/utils/lib/echarts';
  // @ts-ignore
  import * as echarts from '@/utils/lib/echarts';

  // 定义props接口
  interface Props {
    data: {
      timeData: string[];
      usageData1: number[];
      usageData2: number[];
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => ({
      timeData: [],
      usageData1: [],
      usageData2: [],
    }),
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: ReturnType<typeof init> | null = null;

  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    chart = init(chartRef.value);

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['核心CPU消耗', '用户CPU消耗'],
        textStyle: {
          fontSize: 10,
        },
        top: 0,
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '3%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.data.timeData,
        show: true,
        axisLabel: {
          fontSize: 10,
          color: '#666',
        },
      },
      yAxis: {
        type: 'value',
        show: true,
        axisLabel: {
          fontSize: 10,
          color: '#666',
        },
      },
      series: [
        {
          name: '核心CPU消耗',
          data: props.data.usageData1,
          type: 'line',
          areaStyle: {
            color: '#34c388',
          },
          lineStyle: {
            color: '#34c388',
          },
          showSymbol: false,
        },
        {
          name: '用户CPU消耗',
          data: props.data.usageData2,
          type: 'line',
          areaStyle: {
            color: '#7189d0',
          },
          lineStyle: {
            color: '#7189d0',
          },
          showSymbol: false,
        },
      ],
    };

    chart.setOption(option);

    // 自适应
    window.addEventListener('resize', handleResize);
  };

  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  // 监听数据变化并更新图表
  watch(
    () => props.data,
    () => {
      if (chart) {
        chart.setOption({
          xAxis: {
            data: props.data.timeData,
          },
          yAxis: {
            min: 0,
            max: 100,
          },
          series: [
            {
              data: props.data.usageData1,
            },
            {
              data: props.data.usageData2,
            },
          ],
        });
      }
    },
    { deep: true }
  );

  onMounted(() => {
    nextTick(() => {
      initChart();
    });
  });

  onBeforeUnmount(() => {
    if (chart) {
      chart.dispose();
    }

    window.removeEventListener('resize', handleResize);
  });
</script>

<style lang="less" scoped>
  .monitor-card {
    height: 320px;
    .chart-container {
      padding-top: 10px;
      height: 260px;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
