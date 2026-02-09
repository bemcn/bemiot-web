<template>
  <n-modal
    v-model:show="showModelState"
    :show-icon="false"
    preset="dialog"
    style="width: 1260px"
    :title="title"
    @after-leave="closeAfter"
  >
    <n-card :bordered="false" class="mt-3" content-style="padding: 5px 0px !important;">
      <BasicForm
        :showAdvancedButton="false"
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
      >
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>
    </n-card>
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <BasicTable
        :columns="devModelColumns"
        :request="loadDataTable"
        :row-key="(row) => row.modelId"
        ref="actionRef"
        :actionColumn="actionColumn"
        :striped="true"
        :pagination="false"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加通用物模型
          </n-button>
          <n-button style="margin-left: 10px" type="primary" @click="handleDelArray">
            <template #icon>
              <n-icon>
                <DeleteOutlined />
              </n-icon>
            </template>
            批量删除
          </n-button>
        </template>

        <template #toolbar> </template>
      </BasicTable>
    </n-card>
    <template #action>
      <n-space>
        <n-button @click="() => (showModelState = false)">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
  <SelectModel
    :showModel="showCheckModal"
    :keys="keys"
    :id="localParams?.deviceId || 0"
    @close="() => (showCheckModal = false)"
    @submit="checkKeysCall"
  />
  <ViewInfo
    :showModel="showViewModal"
    :params="viewParams"
    @close="() => (showViewModal = false)"
  />
</template>

<script lang="ts" setup>
  import { h, reactive, ref, watch } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { DeviceModel } from '@/types/DeviceModel';
  import {
    getDeviceModelList,
    delDeviceModelById,
    delDeviceModelByIds,
    DeviceModelParams,
  } from '@/api/devices/deviceModel';
  import { devModelColumns } from './columns';
  import { format } from 'date-fns';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import SelectModel from './SelectModel.vue';
  // @ts-ignore
  import ViewInfo from './../general_model/ViewInfo.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  });
  const showModelState = ref(false);
  const title = ref('设备物模型');
  const localParams: any = ref(null);
  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch([() => props.showModel, () => props.params], async ([newShowModel, newParams]) => {
    showModelState.value = newShowModel;
    localParams.value = newParams || {};
    if (newParams && newParams.deviceId) {
      title.value = '设备物模型 - ' + newParams.deviceName + ' 【' + newParams.deviceCode + '】';
    }
  });

  const actionRef = ref();
  const checkRow: any = ref(null);
  const keys = ref<string[]>([]);
  const showCheckModal = ref(false);
  const showViewModal = ref(false);
  const viewParams = ref<any>({});

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'type',
      component: 'NSelect',
      label: '模型类别',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            value: 1,
            label: '属性',
          },
          {
            value: 2,
            label: '功能',
          },
          {
            value: 3,
            label: '事件',
          },
        ],
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'identity',
      component: 'NInput',
      label: '模型标识',
      componentProps: {
        placeholder: '请输入模型标识',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'name',
      component: 'NInput',
      label: '模型名称',
      componentProps: {
        placeholder: '请输入模型名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '4' },
    labelWidth: 80,
    schemas,
  });

  // 表格编辑列
  const actionCell = () => {
    return reactive({
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
      render(record: Recordable) {
        return h(TableAction as any, {
          style: 'button',
          actions: [
            {
              label: '查看',
              onClick: handleView.bind(null, record),
            },
            {
              label: '删除',
              onClick: handleDel.bind(null, record),
            },
          ],
        });
      },
    });
  };
  // 表格操作列对象
  const actionColumn = actionCell();

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    if (localParams.value && localParams.value.deviceId) {
      const fieldsValue = getFieldsValue();
      let params = {} as DeviceModelParams;
      params.deviceId = localParams.value.deviceId;
      if (fieldsValue && typeof fieldsValue === 'object') {
        if (fieldsValue.hasOwnProperty('type')) {
          params.type = fieldsValue.type;
        }
        if (fieldsValue.hasOwnProperty('identity')) {
          params.identity = fieldsValue.identity;
        }
        if (fieldsValue.hasOwnProperty('name')) {
          params.name = fieldsValue.name;
        }
      }

      const result = (await getDeviceModelList(params)) as unknown as {
        status: string;
        message: string;
        data: any[];
      };
      if (result.status === 'success') {
        console.log('result:', result.data);
        keys.value = result.data.map((item: any) => item.modelIdentity);
        return {
          records: result.data,
          total: result.data.length,
        };
      } else {
        return {
          records: [],
          total: 0,
        };
      }
    } else {
      return null;
    }
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 查看
  const handleView = (record: Recordable) => {
    console.log('record:', record);
    const date = new Date(record.createTime);
    const createTime = format(date, 'yyyy-MM-dd hh:mm:ss');
    const datas = JSON.parse(record.dataDefinition);

    viewParams.value = {
      modelIdentity: record.modelIdentity,
      modelName: record.modelName,
      groupName: '',
      modelType: record.modelType,
      dataType: record.dataType,
      datas: datas,
      charts: record.charts,
      monitor: record.monitor,
      history: record.history,
      readonly: record.readonly,
      share: record.share,
      createTime: createTime,
      isGeneral: false,
    };
    showViewModal.value = true;
  };

  // 新增
  const handleAdd = () => {
    showCheckModal.value = true;
  };
  const checkKeysCall = () => {
    showCheckModal.value = false;
    reloadTable();
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.modelId,
    };

    try {
      const result = (await delDeviceModelById(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('删除成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('删除失败');
    }
  };

  // 批量选择
  const onCheckedRow = (rowKeys: any) => {
    checkRow.value = rowKeys;
  };

  // 批量删除
  const handleDelArray = async () => {
    const ids = checkRow.value.join(',');
    const params = {
      ids,
    };

    const result = (await delDeviceModelByIds(params)) as unknown as {
      status: string;
      message: string;
    };
    if (result.status === 'success') {
      window['$message'].success('删除成功');
      reloadTable();
    } else {
      window['$message'].error(result.message);
    }
  };

  // 查询点击
  const handleSubmit = () => {
    console.log('查询点击:', true);
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };

  const closeAfter = () => {
    emit('close');
  };
</script>
