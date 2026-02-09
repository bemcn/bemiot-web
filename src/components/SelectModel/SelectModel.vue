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
        :columns="columns"
        :data="modelList"
        :pagination="false"
        :bordered="false"
        :max-height="365"
        :row-props="rowProps"
        remote
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getProductModelList, ProductModelParams } from '@/api/devices/productModel';
  import { columns } from './columns';
  // @ts-ignore
  import { CaretRightFilled } from '@vicons/antd';
  import { ProductModel } from '@/types/DeviceModel';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: String,
      default: '',
    },
    class: {
      type: String,
      default: '',
    },
  });

  const showModelState = ref(false);
  const productId = ref('');
  const modelClass = ref('');
  const modelList = ref<any[]>([]);

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch(
    [() => props.showModel, () => props.id, () => props.class],
    async ([newShowModel, newId, newClass]) => {
      showModelState.value = newShowModel;
      productId.value = newId;
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
    let params = {} as ProductModelParams;
    params.productId = productId.value;
    if (modelClass.value && modelClass.value !== '') {
      if (modelClass.value === 'attribute') {
        params.modelClass = 1;
      } else if (modelClass.value === 'service') {
        params.modelClass = 2;
      } else {
        params.modelClass = 3;
      }
    }

    const result = (await getProductModelList(params)) as unknown as {
      status: string;
      message: string;
      data: ProductModel[];
    };
    if (result.status === 'success') {
      modelList.value = result.data;
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
