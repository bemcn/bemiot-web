<template>
  <div>
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <n-data-table
        :columns="recordColumns"
        :data="list"
        :pagination="false"
        :bordered="true"
        :row-key="(row) => row.attrId"
        striped
        :style="{ height: '407px' }"
        flex-height
      />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getDeviceAttrList, DeviceAttrParams } from '@/api/asset/deviceAttr';
  import { recordColumns } from '../columns';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: String,
      default: () => '',
    },
  });
  const deviceId: any = ref('');
  const keys = ref<string[]>([]);
  const list = ref<any[]>([]);

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    if (deviceId.value) {
      let params = {} as DeviceAttrParams;
      params.deviceId = deviceId.value;

      const result = (await getDeviceAttrList(params)) as unknown as {
        status: string;
        message: string;
        data: any[];
      };
      if (result.status === 'success') {
        keys.value = result.data.map((item: any) => item.modelId);
        list.value = result.data;
      }
    }
  };

  watch(
    [() => props.id],
    ([newId]) => {
      if (newId && newId.length > 0) {
        deviceId.value = newId;
        loadDataTable();
      }
    },
    { immediate: true }
  );
</script>
