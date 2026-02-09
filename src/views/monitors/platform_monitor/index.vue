<template>
  <div class="platform-monitor">
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="平台监控">
        实时监控平台硬件资源使用情况，包括CPU、内存、网络和磁盘等关键指标。
      </n-card>
    </div>
    
    <div class="mt-4">
      <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <CpuMonitor />
        </n-grid-item>
        <n-grid-item>
          <MemoryMonitor />
        </n-grid-item>
        <n-grid-item>
          <NetworkMonitor />
        </n-grid-item>
        <n-grid-item>
          <DiskMonitor />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import CpuMonitor from './components/CpuMonitor.vue';
  import MemoryMonitor from './components/MemoryMonitor.vue';
  import NetworkMonitor from './components/NetworkMonitor.vue';
  import DiskMonitor from './components/DiskMonitor.vue';

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
.platform-monitor {
  .n-card {
    border-radius: 4px;
  }
}
</style>
