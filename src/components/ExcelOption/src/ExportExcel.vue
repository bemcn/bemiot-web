<template>
  <n-button v-if="authShow" style="margin-left: 10px" :type="type" @click="handleExport">
    <template #icon>
      <n-icon>
        <ExportOutlined />
      </n-icon>
    </template>
    导出数据
  </n-button>
</template>

<script lang="ts" setup>
  import { ExportOutlined } from '@vicons/antd';
  import { useGlobSetting } from '@/hooks/setting';
  import { useUserStore } from '@/store/modules/user';
  import { exportProps } from './export_props';

  const userStore = useUserStore();
  const { apiUrl } = useGlobSetting();

  const props = defineProps({
    ...exportProps,
  });

  // 导出
  const handleExport = () => {
    const queryData = props.queryData;
    const token = userStore.getAccessToken;
    let params = '';
    if (queryData === null) {
      params = 'token=' + token;
    } else {
      Object.entries(queryData).forEach(([key, value]) => {
        params += key + '=' + value + '&';
      });
      params += 'token=' + token;
    }
    const url = apiUrl + props.apiPath + '?' + params;
    window.location.href = url;
  };
</script>
