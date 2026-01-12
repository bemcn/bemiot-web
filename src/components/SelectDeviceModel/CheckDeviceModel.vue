<template>
  <n-modal
    v-model:show="showModelState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
    title="选择物模型"
    @after-leave="closeAfter"
  >
    <n-card :bordered="false" size="small">
      <n-data-table
        :columns="modelColumns"
        :data="modelList"
        :pagination="pagination"
        :bordered="false"
        :max-height="365"
        :row-props="rowProps"
        remote
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { getDeviceModelPageList, DeviceModelPageParams } from '@/api/devices/deviceModel';
  import { modelColumns } from './columns';
  // @ts-ignore
  import { CaretRightFilled } from '@vicons/antd';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    devId: {
      type: String,
      default: '',
    },
    devClass: {
      type: String,
      default: '',
    },
  });

  const showModelState = ref(false);
  const deviceId = ref('');
  const modelClass = ref('');
  const modelList = ref<any[]>([]);

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 40, 50],
    onChange: (page: number) => {
      pagination.page = page;
      loadDataTable();
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
      loadDataTable();
    },
  });

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch(
    [() => props.showModel, () => props.devId, () => props.devClass],
    async ([newShowModel, newId, newClass]) => {
      showModelState.value = newShowModel;
      deviceId.value = newId;
      modelClass.value = newClass;
      if (newShowModel === true) {
        loadDataTable();
      }
    }
  );

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    let params = {} as DeviceModelPageParams;
    params.deviceId = deviceId.value;
    if (modelClass.value && modelClass.value !== '') {
      if (modelClass.value === 'attribute') {
        params.modelClass = 1;
      } else if (modelClass.value === 'service') {
        params.modelClass = 2;
      } else {
        params.modelClass = 3;
      }
    }
    params.index = pagination.page;
    params.size = pagination.pageSize;
    console.log('params', params);

    const result = (await getDeviceModelPageList(params)) as unknown as {
      status: string;
      message: string;
      data: {
        records: any[];
        current: number;
        pages: number;
        size: number;
        total: number;
      };
    };
    if (result.status === 'success') {
      console.log('result.data', result.data);
      modelList.value = result.data.records;
      pagination.pageCount = result.data.pages;
      pagination.itemCount = result.data.total;
      console.log('pagination', pagination);
    } else {
      modelList.value = [];
      pagination.pageCount = 1;
      pagination.itemCount = 0;
    }
  };

  const rowProps = (row: any) => {
    return {
      onClick: () => {
        console.log('row', row);
        emit('checked', row);
        showModelState.value = false; // 关闭模态框
      },
    };
  };

  const closeAfter = () => {
    emit('close');
  };
</script>
