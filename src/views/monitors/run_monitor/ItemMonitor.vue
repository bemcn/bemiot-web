<template>
  <n-card :bordered="false" :title="data.driveName" class="monitor-card" size="small">
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
      driveCode: string;
      driveName: string;
      timeData: string[];
      usageData1: number[];
      usageData2: number[];
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => ({
      driveCode: '',
      driveName: '',
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

    // 确保容器有正确的尺寸
    chartRef.value.style.width = '100%';
    chartRef.value.style.height = '100%';

    chart = init(chartRef.value);

    // 计算数据最大值的1.5倍，用于设置Y轴最大值

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['数据采集', '指令下发'],
        textStyle: {
          fontSize: 10,
        },
        top: 0,
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '3%',
        bottom: '15%', // 增加底部边距为X轴标签留出更多空间
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
          interval: 'auto', // 修改为自动计算合适的标签间隔
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
          name: '数据采集',
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
          name: '指令下发',
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

    // 强制图表尺寸与容器同步
    nextTick(() => {
      setTimeout(() => {
        if (chart) {
          chart.resize();
        }
      }, 100); // 延迟执行resize以确保DOM已完全渲染
    });

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
    height: 250px;
    margin-bottom: 15px;
    overflow: hidden; // 确保卡片内容不会溢出
    .chart-container {
      width: 100%;
      height: 200px;
      position: relative; // 添加定位上下文
      .chart {
        width: 100%;
        height: 100%;
        min-width: 100%;
        max-width: 100%;
        box-sizing: border-box; // 确保padding和border包含在元素的总宽高中
        overflow: hidden; // 防止内容溢出
      }
    }
  }
</style>
