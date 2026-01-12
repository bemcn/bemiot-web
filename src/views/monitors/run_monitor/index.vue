<template>
  <div class="run-monitor">
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="子系统运行监控">
        实时监控系统各子系统的运行状态，包括CPU、内存使用情况以及故障异常等关键指标。
      </n-card>
    </div>

    <div class="mt-4">
      <!-- CPU性能历史统计 -->
      <n-grid cols="1" responsive="screen" class="mb-4">
        <n-grid-item>
          <CPUChart />
        </n-grid-item>
      </n-grid>

      <!-- 内存性能历史统计 -->
      <n-grid cols="1" responsive="screen" class="mb-4">
        <n-grid-item>
          <MemoryChart />
        </n-grid-item>
      </n-grid>

      <!-- 故障异常历史统计 -->
      <n-grid cols="1" responsive="screen" class="mb-4">
        <n-grid-item>
          <FaultChart />
        </n-grid-item>
      </n-grid>

      <!-- 饼图统计 -->
      <n-grid cols="1 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <CPUPie />
        </n-grid-item>
        <n-grid-item>
          <MemoryPie />
        </n-grid-item>
        <n-grid-item>
          <FaultPie />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import CPUChart from './components/CPUChart.vue';
  import MemoryChart from './components/MemoryChart.vue';
  import FaultChart from './components/FaultChart.vue';
  import CPUPie from './components/CPUPie.vue';
  import MemoryPie from './components/MemoryPie.vue';
  import FaultPie from './components/FaultPie.vue';

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
  .run-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
