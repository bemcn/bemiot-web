<template>
  <n-card :bordered="false" title="客户端连接监控" class="monitor-card" size="small">
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
      usageData: number[];
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => ({
      timeData: [],
      usageData: [],
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
    const maxDataValue = props.data.usageData.length > 0 ? Math.max(...props.data.usageData) : 100;
    const yAxisMax = maxDataValue * 1.5;

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '10%',
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
          interval: 7,
        },
      },
      yAxis: {
        type: 'value',
        show: true,
        min: 0,
        max: yAxisMax,
        axisLabel: {
          fontSize: 10,
          color: '#666',
        },
      },
      series: [
        {
          data: props.data.usageData,
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
        // 计算新数据的最大值并更新Y轴范围
        const maxDataValue =
          props.data.usageData.length > 0 ? Math.max(...props.data.usageData) : 100;
        const yAxisMax = maxDataValue * 1.5;

        chart.setOption({
          xAxis: {
            data: props.data.timeData,
          },
          yAxis: {
            max: yAxisMax,
          },
          series: [
            {
              data: props.data.usageData,
            },
          ],
        });

        // 数据更新后也需要重新调整大小
        setTimeout(() => {
          if (chart) {
            chart.resize();
          }
        }, 100);
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
    height: 200px;
    margin-bottom: 15px;
    overflow: hidden; // 确保卡片内容不会溢出
    .chart-container {
      width: 100%;
      height: 150px;
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
