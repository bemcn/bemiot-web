<template>
  <div class="message-monitor">
    <div class="mt-2">
      <!-- 消息分类统计统计 - 占据整行的70%宽度 -->
      <n-grid cols="1 s:1 m:10 l:10 xl:10 2xl:10" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item :span="7">
          <DeviceMessageChart />
        </n-grid-item>
        <n-grid-item :span="3">
          <DeviceMessagePie />
        </n-grid-item>
      </n-grid>

      <!-- 区域消息统计 - 各占据整行的50%宽度 -->
      <n-grid
        cols="1 s:1 m:2 l:2 xl:2 2xl:2"
        responsive="screen"
        :x-gap="16"
        :y-gap="16"
        class="mt-4"
      >
        <n-grid-item :span="1">
          <AreaReceiveChart />
        </n-grid-item>
        <n-grid-item :span="1">
          <AreaSendChart />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  // @ts-ignore
  import DeviceMessageChart from './components/DeviceMessageChart.vue';
  // @ts-ignore
  import DeviceMessagePie from './components/DeviceMessagePie.vue';
  // @ts-ignore
  import AreaReceiveChart from './components/AreaReceiveChart.vue';
  // @ts-ignore
  import AreaSendChart from './components/AreaSendChart.vue';

  const loading = ref(true);

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    loading.value = false;

    // 模拟定时更新数据
    timer = setInterval(() => {
      // 这里可以添加更新所有监控组件数据的逻辑
    }, 5000);
  });

  // 组件卸载前清理定时器
  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });
</script>

<style lang="less" scoped>
  .message-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
