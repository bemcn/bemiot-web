<template>
  <div class="card content-box">
    <n-card :bordered="false" title="Ant Design Icons">
      <n-input
        v-model:value="searchText"
        placeholder="搜索图标..."
        clearable
        style="width: 300px; margin-bottom: 20px"
      />
      <n-grid :cols="8" :x-gap="12" :y-gap="12">
        <n-grid-item v-for="icon in filteredIcons" :key="icon.name">
          <n-card
            hoverable
            embedded
            style="text-align: center; cursor: pointer"
            @click="copyIconName(icon.name)"
          >
            <component :is="icon.component" style="font-size: 24px; margin: 0 auto" />
            <div class="icon-name">{{ icon.name }}</div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts" name="iconsView">
  import { ref, computed } from 'vue';
  import { useMessage } from 'naive-ui';
  // 导入所有图标组件
  import * as icons from '@vicons/antd';
  import type { Component } from 'vue';

  interface IconItem {
    name: string;
    component: Component;
  }

  const message = useMessage();
  const searchText = ref('');

  // 将导入的图标转换为数组格式
  const iconList = computed<IconItem[]>(() => {
    return Object.keys(icons).map((name) => ({
      name,
      component: (icons as Record<string, Component>)[name],
    }));
  });

  // 根据搜索文本过滤图标
  const filteredIcons = computed(() => {
    if (!searchText.value) {
      return iconList.value;
    }
    const search = searchText.value.toLowerCase();
    return iconList.value.filter((icon) => icon.name.toLowerCase().includes(search));
  });

  // 复制图标名称到剪贴板
  const copyIconName = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      message.success(`已复制图标名称: ${name}`);
    });
  };
</script>

<style scoped lang="less">
  .content-box {
    padding: 20px;

    .icon-name {
      font-size: 12px;
      margin-top: 8px;
      word-break: break-all;
      color: #666;
    }
  }
</style>
