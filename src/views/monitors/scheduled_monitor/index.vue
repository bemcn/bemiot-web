<template>
  <div class="scheduled-monitor">
    <div class="mt-2">
      <!-- 任务执行情况统计 - 占据整行的70%宽度 -->
      <n-grid cols="1 s:1 m:7 l:7 xl:7 2xl:7" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item :span="5">
          <TaskExecutionChart />
        </n-grid-item>
        <n-grid-item :span="2">
          <TaskExecutionPie />
        </n-grid-item>
      </n-grid>

      <!-- 任务分类执行统计 - 占据整行的70%宽度 -->
      <n-grid
        cols="1 s:1 m:7 l:7 xl:7 2xl:7"
        responsive="screen"
        :x-gap="16"
        :y-gap="16"
        class="mt-4"
      >
        <n-grid-item :span="5">
          <SceneExecutionChart />
        </n-grid-item>
        <n-grid-item :span="2">
          <SceneExecutionPie />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  // @ts-ignore
  import TaskExecutionChart from './components/TaskExecutionChart.vue';
  // @ts-ignore
  import TaskExecutionPie from './components/TaskExecutionPie.vue';
  // @ts-ignore
  import SceneExecutionChart from './components/SceneExecutionChart.vue';
  // @ts-ignore
  import SceneExecutionPie from './components/SceneExecutionPie.vue';

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
  .scheduled-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
