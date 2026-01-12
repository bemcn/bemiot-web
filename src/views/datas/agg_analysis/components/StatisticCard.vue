<template>
  <div class="statistic-card">
    <div class="card-header">
      <div class="icon-wrapper" :class="iconClass">
        <n-icon class="icon" :color="iconColor">
          <component :is="iconComponent" />
        </n-icon>
      </div>
      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="value">
          <n-skeleton v-if="loading" :width="80" size="medium" />
          <CountTo v-else :startVal="0" :endVal="value" class="count-value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { CountTo } from '@/components/CountTo/index';
  import {
    BoxPlotOutlined,
    ContainerOutlined,
    DownloadOutlined,
    UploadOutlined,
    FileOutlined,
    AlertOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    InfoCircleOutlined,
  } from '@vicons/antd';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: 'product', // product, device, receive, send, log, alarm, critical, major, minor
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const iconMap = {
    product: BoxPlotOutlined,
    device: ContainerOutlined,
    receive: DownloadOutlined,
    send: UploadOutlined,
    log: FileOutlined,
    alarm: AlertOutlined,
    critical: CloseCircleOutlined,
    major: WarningOutlined,
    minor: InfoCircleOutlined,
  };

  const colorMap = {
    product: '#409eff',
    device: '#67c23a',
    receive: '#e6a23c',
    send: '#909399',
    log: '#34c388',
    alarm: '#f56c6c',
    critical: '#f56c6c',
    major: '#e6a23c',
    minor: '#409eff',
  };

  const bgColorMap = {
    product: '#ecf5ff',
    device: '#f0f9ff',
    receive: '#fdf6ec',
    send: '#f4f4f5',
    log: '#f0f9eb',
    alarm: '#fef0f0',
    critical: '#fef0f0',
    major: '#fdf6ec',
    minor: '#ecf5ff',
  };

  const iconComponent = computed(
    () => iconMap[props.icon as keyof typeof iconMap] || BoxPlotOutlined
  );
  const iconColor = computed(() => colorMap[props.icon as keyof typeof colorMap] || '#409eff');
  const iconClass = computed(() => `icon-${props.icon}`);
</script>

<style lang="less" scoped>
  .statistic-card {
    .card-header {
      display: flex;
      align-items: center;
      .icon-wrapper {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        &.icon-product {
          background-color: v-bind('bgColorMap.product');
        }
        &.icon-device {
          background-color: v-bind('bgColorMap.device');
        }
        &.icon-receive {
          background-color: v-bind('bgColorMap.receive');
        }
        &.icon-send {
          background-color: v-bind('bgColorMap.send');
        }
        &.icon-log {
          background-color: v-bind('bgColorMap.log');
        }
        &.icon-alarm {
          background-color: v-bind('bgColorMap.alarm');
        }
        &.icon-critical {
          background-color: v-bind('bgColorMap.critical');
        }
        &.icon-major {
          background-color: v-bind('bgColorMap.major');
        }
        &.icon-minor {
          background-color: v-bind('bgColorMap.minor');
        }
        .icon {
          font-size: 24px;
        }
      }
      .info {
        flex: 1;
        .title {
          font-size: 14px;
          color: #999;
          margin-bottom: 4px;
        }
        .value {
          font-size: 20px;
          font-weight: bold;
          .count-value {
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>