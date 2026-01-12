<template>
  <n-card :bordered="false" title="CPU监控" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-grid x-gap="10" y-gap="10" cols="12" item-responsive>
        <n-gi span="8">
          <div class="monitor-line">
            <div class="label">核心数</div>
            <div class="value">
              {{ info.vendor }} {{ info.microarchitecture }} {{ info.bit }}位
              {{ info.physicalNum }}核{{ info.logicalNumber }}线程
            </div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">基准频率</div>
            <div class="value">{{ info.vendorFreq }}</div>
          </div>
        </n-gi>
        <n-gi span="8">
          <div class="monitor-line">
            <div class="label">当前使用率</div>
            <div class="value"> {{ cpuData.currentUsage || 0 }}% </div>
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
      bit: number;
      physicalNum: number;
      logicalNumber: number;
      vendorFreq: string;
      vendor: string;
      microarchitecture: string;
    };
    cpuData: {
      timeData: string[];
      usageData: number[];
      currentUsage?: number;
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    info: () => ({
      bit: 0,
      physicalNum: 0,
      logicalNumber: 0,
      vendorFreq: '',
      vendor: '',
      microarchitecture: '',
    }),
    cpuData: () => ({
      timeData: [],
      usageData: [],
      currentUsage: 0,
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
        data: props.cpuData.timeData,
        show: true, // 显示X轴
        axisLabel: {
          fontSize: 10,
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        show: true, // 显示Y轴
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%' // 添加百分号
        },
        splitLine: {
          show: true // 显示网格线
        }
      },
      series: [
        {
          data: props.cpuData.usageData,
          type: 'line',
          areaStyle: {
            color: '#34c388',
          },
          lineStyle: {
            color: '#34c388',
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
    () => props.cpuData,
    () => {
      if (chart) {
        chart.setOption({
          xAxis: {
            data: props.cpuData.timeData,
          },
          yAxis: {
            min: 0,
            max: 100,
          },
          series: [
            {
              data: props.cpuData.usageData,
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
