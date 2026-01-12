<template>
  <n-card :bordered="false" title="磁盘监控" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-grid x-gap="10" y-gap="10" cols="12" item-responsive>
        <n-gi span="8">
          <div class="monitor-line">
            <div class="label">硬盘名</div>
            <div class="value">{{ info.diskName }}</div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">总容量</div>
            <div class="value">{{ info.size }}</div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">当前读取</div>
            <div class="value">{{ diskData.currentRead }} kb</div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">当前写入</div>
            <div class="value">{{ diskData.currentWrite }} kb</div>
          </div>
        </n-gi>
      </n-grid>
    </div>
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
    info: {
      number: number;
      diskName: string;
      size: string;
    };
    diskData: {
      timeData: string[];
      readData: number[];
      writeData: number[];
      currentRead?: number;
      currentWrite?: number;
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    info: () => ({
      number: 0,
      diskName: '',
      size: '',
    }),
    diskData: () => ({
      timeData: [],
      readData: [],
      writeData: [],
      currentRead: 0,
      currentWrite: 0,
    }),
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: ReturnType<typeof init> | null = null;

  // 根据使用率返回颜色
  const getColor = (usage: number) => {
    if (usage < 50) {
      return '#18a058';
    } else if (usage < 80) {
      return '#f0a020';
    } else {
      return '#d03050';
    }
  };

  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    chart = init(chartRef.value);

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['磁盘读取', '磁盘写入'],
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
        data: props.diskData.timeData,
        show: true,
        axisLabel: {
          fontSize: 10,
          color: '#666',
        },
      },
      yAxis: {
        type: 'value',
        show: true,
        min: 0,
        axisLabel: {
          fontSize: 10,
          color: '#666',
        },
      },
      series: [
        {
          name: '磁盘读取',
          data: props.diskData.readData,
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
          name: '磁盘写入',
          data: props.diskData.writeData,
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
    () => props.diskData,
    () => {
      if (chart) {
        chart.setOption({
          xAxis: {
            data: props.diskData.timeData,
          },
          series: [
            {
              data: props.diskData.readData,
            },
            {
              data: props.diskData.writeData,
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
    height: 460px;
    .monitor-info {
      padding: 0px 20px;
      .monitor-line {
        height: 16px;
        .label {
          width: 90px;
          height: 16px;
          color: #999;
          float: left;
        }
        .value {
          height: 16px;
          color: #666;
          margin-left: 90px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .chart-container {
      padding-top: 10px;
      height: 375px;
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
