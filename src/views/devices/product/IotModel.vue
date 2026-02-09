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
        :columns="proModelColumns"
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
            新增
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
  <CreateModel
    :showModel="showCreateModal"
    :action="action"
    :params="modelParams"
    @close="() => (showCreateModal = false)"
    @submit="saveModel"
  />
  <ViewInfo
    :showModel="showViewModal"
    :params="modelParams"
    @close="() => (showViewModal = false)"
  />
  <AlarmRules
    :showModel="showRuleModal"
    :params="modelParams"
    @close="() => (showRuleModal = false)"
  />
</template>

<script lang="ts" setup>
  import { h, reactive, ref, watch } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { ProductModel } from '@/types/DeviceModel';
  import {
    getProductModelList,
    delProductModelById,
    delProductModelByIds,
    ProductModelParams,
  } from '@/api/devices/productModel';
  import { proModelColumns } from './columns';
  import { format } from 'date-fns';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import CreateModel from './CreateModel.vue';
  // @ts-ignore
  import ViewInfo from './ViewInfo.vue';
  // @ts-ignore
  import AlarmRules from './AlarmRules.vue';

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
  const title = ref('产品物模型');
  const action = ref('');
  const localParams: any = ref(null);
  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showModelState.value = newShowModel;
    localParams.value = newParams || {};
    if (newParams && newParams.productId) {
      title.value = '产品物模型 - ' + newParams.productName;
    }
  });

  const actionRef = ref();
  const checkRow: any = ref(null);
  const keys = ref<string[]>([]);
  const showCreateModal = ref(false);
  const showViewModal = ref(false);
  const showRuleModal = ref(false);
  const modelParams = ref<any>({});

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'modelClass',
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
      width: 280,
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
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '告警设置',
              onClick: handleAlarmValue.bind(null, record),
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
  const loadDataTable = async (_res: any) => {
    if (localParams.value && localParams.value.productId) {
      const fieldsValue = getFieldsValue();
      let params = {} as ProductModelParams;
      params.productId = localParams.value.productId;
      if (fieldsValue && typeof fieldsValue === 'object') {
        if (fieldsValue.hasOwnProperty('modelClass')) {
          params.modelClass = fieldsValue.modelClass;
        }
        if (fieldsValue.hasOwnProperty('identity')) {
          params.identity = fieldsValue.identity;
        }
        if (fieldsValue.hasOwnProperty('name')) {
          params.name = fieldsValue.name;
        }
      }

      const result = (await getProductModelList(params)) as unknown as {
        status: string;
        message: string;
        data: ProductModel[];
      };
      if (result.status === 'success') {
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

    modelParams.value = {
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
    modelParams.value = {
      modelId: '',
      modelIdentity: '',
      modelName: '',
      productId: localParams.value.productId,
      modelType: '0',
      modelClass: 1,
      dataType: 'int',
      dataDefinition: '',
      datas: {
        min: null,
        max: null,
        unit: '',
        step: null,
      },
      charts: 1,
      monitor: 1,
      history: 1,
      readonly: 1,
      share: 0,
    };
    action.value = 'add';
    showCreateModal.value = true;
  };
  // 编辑
  const handleEdit = (record: Recordable) => {
    const datas = JSON.parse(record.dataDefinition);
    modelParams.value = {
      modelId: record.modelId,
      modelIdentity: record.modelIdentity,
      modelName: record.modelName,
      productId: record.productId,
      modelType: record.modelType + '',
      modelClass: record.modelClass,
      dataType: record.dataType,
      dataDefinition: record.dataDefinition,
      datas,
      charts: record.charts,
      monitor: record.monitor,
      history: record.history,
      readonly: record.readonly,
      share: record.share,
    };
    action.value = 'edit';
    showCreateModal.value = true;
  };
  const saveModel = () => {
    showCreateModal.value = false;
    reloadTable();
  };

  // 告警阈值
  const handleAlarmValue = (record: Recordable) => {
    const datas = JSON.parse(record.dataDefinition);
    modelParams.value = {
      modelIdentity: record.modelIdentity,
      modelName: record.modelName,
      modelType: record.modelType,
      productId: record.productId,
      dataType: record.dataType,
      datas: datas,
    };
    showRuleModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.modelId,
    };

    try {
      const result = (await delProductModelById(params)) as unknown as {
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

    const result = (await delProductModelByIds(params)) as unknown as {
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
