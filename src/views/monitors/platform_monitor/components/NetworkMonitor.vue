<template>
  <n-card :bordered="false" title="网络监控" class="monitor-card" size="small">
    <div class="monitor-info">
      <n-grid x-gap="10" y-gap="10" cols="12" item-responsive>
        <n-gi span="8">
          <div class="monitor-line">
            <div class="label">网卡名称</div>
            <div class="value">{{ info.netName }}</div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">IP地址</div>
            <div class="value">{{ info.address }}</div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">当前上传</div>
            <div class="value">{{ networkData.currentUpload }} kb</div>
          </div>
        </n-gi>
        <n-gi span="4">
          <div class="monitor-line">
            <div class="label">当前下载</div>
            <div class="value">{{ networkData.currentDownload }} kb</div>
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
      netName: string;
      address: string;
    };
    networkData: {
      timeData: string[];
      uploadData: number[];
      downloadData: number[];
      currentUpload?: number;
      currentDownload?: number;
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    info: () => ({
      number: 0,
      netName: '',
      address: '',
    }),
    networkData: () => ({
      timeData: [],
      uploadData: [],
      downloadData: [],
      currentUpload: 0,
      currentDownload: 0,
    }),
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: any | null = null;

  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    chart = init(chartRef.value);

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['上传', '下载'],
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
        data: props.networkData.timeData,
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
          name: '上传',
          data: props.networkData.uploadData,
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
          name: '下载',
          data: props.networkData.downloadData,
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
    () => props.networkData,
    () => {
      if (chart) {
        chart.setOption({
          xAxis: {
            data: props.networkData.timeData,
          },
          series: [
            {
              data: props.networkData.uploadData,
            },
            {
              data: props.networkData.downloadData,
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
