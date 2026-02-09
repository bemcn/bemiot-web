<template>
  <n-modal
    v-model:show="showProductState"
    :show-icon="false"
    preset="dialog"
    style="width: 980px"
    title="选择设备"
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
        :columns="columns"
        :headShow="false"
        :request="loadDataTable"
        :row-key="(row) => row.deviceId"
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
  import { PageFirmware } from '@/types/DeviceModel';
  import { getDevicePageList, DevicePageParams } from '@/api/devices/device';
  import { getPositionTree } from '@/api/base/position';
  import { columns } from './columns';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    types: {
      type: Number,
      default: () => 0,
    },
  });

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showProductState = ref(false);
  const productTypes = ref(0);
  const spaceData = ref<any[]>([]);

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch([() => props.showModel, () => props.types], async ([newShowModel, newTypes]) => {
    showProductState.value = newShowModel;
    productTypes.value = newTypes;
    if (newShowModel === true) {
      spaceData.value = await createPositionData();
    }
  });

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'classId',
      component: 'NCascader',
      label: '安装位置',
      componentProps: {
        placeholder: '请选择安装位置',
        options: spaceData,
        expandTrigger: 'click',
        checkStrategy: 'child',
        clearable: true,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
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
        style: 'width: 150px;',
        componentProps: {
          options: [
            {
              label: '设备编号',
              value: 'code',
            },
            {
              label: '设备名称',
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
    let params = {} as DevicePageParams;
    if (productTypes.value && productTypes.value > 0) {
      params.types = productTypes.value;
    }
    if (fieldsValue.hasOwnProperty('spaceId')) {
      params.spaceId = fieldsValue.spaceId;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getDevicePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageFirmware;
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
  const createPositionData = async () => {
    const result = (await getPositionTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
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
