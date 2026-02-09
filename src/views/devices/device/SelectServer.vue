<template>
  <n-modal
    v-model:show="showProductState"
    :show-icon="false"
    preset="dialog"
    style="width: 980px"
    title="选择视频服务器"
    @after-leave="closeAfter"
  >
    <n-card :bordered="false" size="small">
      <BasicForm
        :showAdvancedButton="false"
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
        style="margin-bottom: 15px"
      >
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>

      <BasicTable
        ref="actionRef"
        :columns="videoServerColumns"
        :headShow="false"
        :request="loadDataTable"
        :row-key="(row) => row.serverId"
        :row-props="rowProps"
        :striped="true"
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { BasicTable } from '@/components/Table';
  import { PageVideoServer } from '@/types/VideoModel';
  import { getVideoServerPageList, VideoServerPageParams } from '@/api/video/videoServer';
  import { videoServerColumns } from './columns';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showProductState = ref(false);

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch([() => props.showModel], async ([newShowModel]) => {
    showProductState.value = newShowModel;
  });

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '3', xGap: 10 },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as VideoServerPageParams;
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getVideoServerPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageVideoServer;
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return {
        records: [],
        total: 0,
        current: res.page || res.current,
        pages: 1,
        size: res.pageSize || res.size,
      };
    }
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 查询点击
  const handleSubmit = () => {
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };

  const rowProps = (row: any) => {
    return {
      onClick: () => {
        emit('checked', row);
        showProductState.value = false; // 关闭模态框
      },
    };
  };

  const closeAfter = () => {
    emit('close');
  };
</script>
