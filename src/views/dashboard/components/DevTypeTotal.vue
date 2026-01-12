<template>
  <div>
    <NRow :gutter="24">
      <NCol :span="24">
        <NCard
          title="设备分类统计"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <n-skeleton v-if="loading" size="medium" style="width: 100%; height: 390px" />
          <div v-else ref="pieRef" class="flex justify-between px-1 py-1 msg-height"></div>
        </NCard>
      </NCol>
    </NRow>
  </div>
</template>
<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: () => true,
    },
    initData: {
      type: Object,
      default: () => ({
        connection: {
          name: '直连设备',
          value: 0,
        },
        gateway: {
          name: '网关设备',
          value: 0,
        },
        monitor: {
          name: '监控设备',
          value: 0,
        },
        monitorStorage: {
          name: '视频存储设备',
          value: 0,
        },
        subDevice: {
          name: '网关子设备',
          value: 0,
        },
        virtual: {
          name: '虚拟设备',
          value: 0,
        },
      }),
    },
  });
  let pieRef = ref<HTMLDivElement | null>(null);
  let { setOptions } = useECharts(pieRef as Ref<HTMLDivElement>);

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
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '90%'],
          avoidLabelOverlap: false,
          top: '15%',
          labelLine: {
            show: false,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
            },
          },
          data: [
            { value: props.initData.connection.value, name: props.initData.connection.name },
            { value: props.initData.gateway.value, name: props.initData.gateway.name },
            { value: props.initData.monitor.value, name: props.initData.monitor.name },
            {
              value: props.initData.monitorStorage.value,
              name: props.initData.monitorStorage.name,
            },
            { value: props.initData.subDevice.value, name: props.initData.subDevice.name },
            { value: props.initData.virtual.value, name: props.initData.virtual.name },
          ],
        },
      ],
    });
  };
</script>
<style lang="less" scoped>
  .msg-height {
    width: 100%;
    height: 390px;
  }
</style>
