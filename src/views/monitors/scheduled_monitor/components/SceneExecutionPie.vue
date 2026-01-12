<template>
  <n-card :bordered="false" class="monitor-card" size="small">
    <div class="monitor-info">
      <div class="monitor-info">
        <div class="label">场景分组汇总</div>
      </div>
    </div>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { getSceneGroupStatistics } from '@/api/monitors/monitorsTask';
  import { init } from '@/utils/lib/echarts';
  // @ts-ignore
  import * as echarts from '@/utils/lib/echarts';

  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: ReturnType<typeof init> | null = null;

  // 获取图表数据
  const initChartData = async () => {
    const result = (await getSceneGroupStatistics()) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [
        {
          name: '默认分组',
          value: 0,
        },
      ];
    }
  };
  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    chart = init(chartRef.value);
    updateChart();

    window.addEventListener('resize', handleResize);
  };

  // 更新图表
  const updateChart = async () => {
    if (!chart) return;
    const data = await initChartData();
    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: '场景分组汇总',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0, // 饼图不要圆角
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
              fontSize: 14,
              fontWeight: 'normal',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };

    chart.setOption(option);
  };

  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  // 数据更新
  let dataTimer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    nextTick(() => {
      initChart();

      // 每60分钟更新一次数据
      dataTimer = setInterval(updateChart, 3600000);
    });
  });

  onBeforeUnmount(() => {
    if (chart) {
      chart.dispose();
    }

    if (dataTimer) {
      clearInterval(dataTimer);
    }

    window.removeEventListener('resize', handleResize);
  });
</script>

<style lang="less" scoped>
  .monitor-card {
    height: 425px;
    .monitor-info {
      height: 45px;
      .label {
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        float: left;
      }
    }
    .chart-container {
      height: 380px;
      padding-bottom: 30px;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
