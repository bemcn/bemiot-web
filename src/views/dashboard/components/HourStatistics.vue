<template>
  <div>
    <NRow :gutter="24">
      <NCol :span="24">
        <NCard
          title="设备消息日统计"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <n-skeleton v-if="loading" size="medium" style="width: 100%; height: 400px" />
          <div v-else ref="lineRef" class="flex justify-between px-1 py-1 msg-height"></div>
        </NCard>
      </NCol>
    </NRow>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: () => true,
    },
    initData: {
      type: Object,
      default: () => ({
        sends: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        gathers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        alarms: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        events: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }),
    },
  });
  let lineRef = ref<HTMLDivElement | null>(null);
  let { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>);

  watch(
    () => [props.loading],
    () => {
      if (!props.loading) {
        initCharts();
      }
    }
  );

  let initCharts = () => {
    setOptions({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            width: 1,
            color: '#019680',
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [
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
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            type: 'solid',
            color: 'rgba(226,226,226,0.5)',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          max: 80000,
          splitNumber: 4,
          axisTick: {
            show: false,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
            },
          },
        },
      ],
      grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
      series: [
        {
          smooth: true,
          data: props.initData.sends,
          type: 'line',
          areaStyle: {},
          name: '发送消息',
          itemStyle: {
            color: '#5ab1ef',
          },
        },
        {
          smooth: true,
          data: props.initData.gathers,
          type: 'line',
          areaStyle: {},
          name: '接收消息',
          itemStyle: {
            color: '#019680',
          },
        },
        {
          smooth: true,
          data: props.initData.alarms,
          type: 'line',
          areaStyle: {},
          name: '设备告警',
          itemStyle: {
            color: '#ffd8bb',
          },
        },
        {
          smooth: true,
          data: props.initData.events,
          type: 'line',
          areaStyle: {},
          name: '事件上报',
          itemStyle: {
            color: '#85879d',
          },
        },
      ],
    });
  };

  onMounted(() => {
    //initCharts();
  });
</script>
<style lang="less" scoped>
  .msg-height {
    width: 100%;
    height: 400px;
  }
</style>
