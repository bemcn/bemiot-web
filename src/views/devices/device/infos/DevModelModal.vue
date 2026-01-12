<template>
  <div>
    <n-card :bordered="false" class="mt-3" content-style="padding: 5px 0px !important;">
      <n-tabs type="line" @update:value="handleTypeChange">
        <n-tab name="attribute"> 属性 </n-tab>
        <n-tab name="service"> 服务 </n-tab>
        <n-tab name="event"> 事件 </n-tab>
      </n-tabs>
    </n-card>
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <n-data-table
        :columns="columns"
        :data="list"
        :pagination="false"
        :bordered="true"
        :row-key="(row) => row.modelId"
        striped
        :style="{ height: '420px' }"
        flex-height
      />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, h, ref, watch } from 'vue';
  import { NButton } from 'naive-ui';
  import { getDeviceModelList, DeviceModelParams } from '@/api/devices/deviceModel';
  import { devModelColumns } from '../columns';

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

  // 添加 emit 定义
  const emit = defineEmits(['event-more']);

  const deviceId: any = ref('');
  const modelClass = ref(1);
  const keys = ref<string[]>([]);
  const list = ref<any[]>([]);
  const columns = computed(() => [
    ...devModelColumns,
    {
      title: '操作',
      key: 'option',
      width: 100,
      align: 'center',
      titleAlign: 'center',
      // 为操作列添加事件处理器
      render: (row) => {
        if (row.modelClass === 1 && row.readonly === 0) {
          return h(
            'div',
            h(
              NButton,
              {
                type: 'default',
                size: 'small',
                onClick: () => handleWriteValue(row),
              },
              { default: () => '写值' }
            )
          );
        } else if (row.modelClass === 2) {
          return h(
            'div',
            h(
              NButton,
              {
                type: 'default',
                size: 'small',
                onClick: () => handleOption(row),
              },
              { default: () => '执行' }
            )
          );
        } else if (row.modelClass === 3) {
          return h(
            'div',
            h(
              NButton,
              {
                type: 'default',
                size: 'small',
                onClick: () => handleEventMore(row),
              },
              { default: () => '查看' }
            )
          );
        } else {
          return h('span', '');
        }
      },
    },
  ]);

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    if (deviceId.value) {
      let params = {} as DeviceModelParams;
      params.deviceId = deviceId.value;
      params.modelClass = modelClass.value;

      const result = (await getDeviceModelList(params)) as unknown as {
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

  // 切换类型
  const handleTypeChange = (value: string) => {
    if (value === 'attribute') {
      modelClass.value = 1;
      loadDataTable();
    } else if (value === 'service') {
      modelClass.value = 2;
      loadDataTable();
    } else if (value === 'event') {
      modelClass.value = 3;
      loadDataTable();
    }
  };

  const handleWriteValue = (record: any) => {
    console.log('handleWriteValue:', record);
  };

  const handleOption = (record: any) => {
    console.log('handleOption:', record);
  };

  const handleEventMore = (record: any) => {
    emit('event-more', record);
  };
</script>
