<template>
  <n-modal
    v-model:show="showDriveState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
    title="选择驱动协议"
    @after-leave="closeAfter"
  >
    <n-card :bordered="false">
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
        :columns="driveColumns"
        :headShow="false"
        :request="loadDataTable"
        :row-key="(row) => row.driveCode"
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
  import { PageDrive } from '@/types/BaseModel';
  import { getDrivePageList, DrivePageParams } from '@/api/base/drives';
  import { driveColumns } from './columns';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showDriveState = ref(false);

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch([() => props.showModel], ([newShowModel]) => {
    showDriveState.value = newShowModel;
  });

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInputGroup',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
        onInput: (e: any) => {
          console.log(e);
        },
      },
      subFormSchema: {
        field: 'filed',
        style: 'width: 160px;',
        componentProps: {
          options: [
            {
              label: '驱动编号',
              value: 'code',
            },
            {
              label: '驱动名称',
              value: 'name',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'code',
      },
    },
  ];
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '2' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as DrivePageParams;
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getDrivePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageDrive;
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
        showDriveState.value = false; // 关闭模态框
      },
    };
  };

  const closeAfter = () => {
    emit('close');
  };
</script>
