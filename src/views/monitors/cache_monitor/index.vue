<template>
  <div class="cache-monitor">
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="缓存监控">
        实时监控系统缓存使用情况，包括缓存读写统计和分类统计等关键指标。
      </n-card>
    </div>

    <div class="mt-4">
      <!-- 缓存使用情况统计 - 占据整行的70%宽度 -->
      <n-grid cols="1 s:1 m:7 l:7 xl:7 2xl:7" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item :span="5">
          <CacheUsageChart />
        </n-grid-item>
        <n-grid-item :span="2">
          <CacheUsagePie />
        </n-grid-item>
      </n-grid>

      <!-- 缓存分类使用统计 - 占据整行的70%宽度 -->
      <n-grid
        cols="1 s:1 m:7 l:7 xl:7 2xl:7"
        responsive="screen"
        :x-gap="16"
        :y-gap="16"
        class="mt-4"
      >
        <n-grid-item :span="5">
          <CacheCategoryChart />
        </n-grid-item>
        <n-grid-item :span="2">
          <CacheCategoryPie />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import CacheUsageChart from './components/CacheUsageChart.vue';
  import CacheUsagePie from './components/CacheUsagePie.vue';
  import CacheCategoryChart from './components/CacheCategoryChart.vue';
  import CacheCategoryPie from './components/CacheCategoryPie.vue';

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
  .cache-monitor {
    .n-card {
      border-radius: 4px;
    }
  }
</style>
