<template>
  <n-card :bordered="false" class="monitor-card" size="small">
    <div class="monitor-info">
      <div class="monitor-info">
        <div class="label">场景联动执行统计</div>
        <div class="space">
          <n-space justify="end" class="control-space">
            <n-radio-group v-model:value="timeRange" @update:value="handleTimeRangeChange">
              <n-radio-button value="day">日统计</n-radio-button>
              <n-radio-button value="week">周统计</n-radio-button>
              <n-radio-button value="month">月统计</n-radio-button>
            </n-radio-group>
          </n-space>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { getSceneStatistics } from '@/api/monitors/monitorsTask';
  import { init } from '@/utils/lib/echarts';
  // @ts-ignore
  import * as echarts from '@/utils/lib/echarts';

  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: ReturnType<typeof init> | null = null;
  const timeRange = ref('day');
  // 获取图表数据
  const initChartData = async () => {
    const params = {
      group: timeRange.value,
    };

    const result = (await getSceneStatistics(params)) as unknown as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return {
        xAxis: [
          '0:00',
          '1:00',
          '2:00',
          '3:00',
          '4:00',
          '5:00',
          '6:00',
          '7:00',
          '8:00',
          '9:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ],
        successData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        failData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
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
        trigger: 'axis',
      },
      legend: {
        data: ['成功', '失败'],
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
        data: data.xAxis,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '成功',
          type: 'line',
          data: data.successData,
          smooth: true,
          lineStyle: {
            width: 2,
          },
        },
        {
          name: '失败',
          type: 'line',
          data: data.failData,
          smooth: true,
          lineStyle: {
            width: 2,
          },
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

  const handleTimeRangeChange = () => {
    updateChart();
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
      .space {
        height: 35px;
        float: right;
        .control-space {
          margin-bottom: 10px;
        }
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
