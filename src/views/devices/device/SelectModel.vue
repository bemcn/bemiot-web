<template>
  <n-modal
    v-model:show="showModelState"
    :show-icon="false"
    preset="dialog"
    style="width: 1260px"
    title="选择物模型"
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
        :columns="generalModelColumns"
        :request="loadDataTable"
        :row-key="(row) => row.modelIdentity || ''"
        :default-checked-row-keys="checkedKeys"
        ref="actionRef"
        :actionColumn="actionColumn"
        :striped="true"
        @update:checked-row-keys="onCheckedRow"
      />
    </n-card>
    <template #action>
      <n-space>
        <n-button @click="() => (showModelState = false)">关闭</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
  <ViewInfo
    :showModel="showViewModal"
    :params="viewParams"
    @close="() => (showViewModal = false)"
  />
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref, watch } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageGeneralModel } from '@/types/DeviceModel';
  import { GeneralModelGroup } from '@/types/BaseModel';
  import { getGeneralModelPageList, GeneralModelPageParams } from '@/api/devices/generalModel';
  import { getGeneralModelGroupList } from '@/api/base/generalModelGroup';
  import { addDeviceModels } from '@/api/devices/deviceModel';
  import { generalModelColumns } from './columns';
  import { format } from 'date-fns';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import ViewInfo from './../general_model/ViewInfo.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: Number,
      default: () => 0,
    },
    keys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });
  const showModelState = ref(false);
  // 回调
  const emit = defineEmits(['close', 'submit']);
  watch(
    [() => props.showModel, () => props.id, () => props.keys],
    async ([newShowModel, newId, newKeys]) => {
      showModelState.value = newShowModel;
      checkedKeys.value = newKeys;
      localId.value = newId;
    }
  );

  const actionRef = ref();
  const formBtnLoading = ref(false);
  const localId = ref(0);
  const checkRow: any = ref(null);
  const checkedKeys = ref<string[]>([]);
  const groupOptions = ref<any[]>([]);
  const showViewModal = ref(false);
  const viewParams = ref<any>({});

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'groupId',
      component: 'NSelect',
      label: '模型分组',
      componentProps: {
        placeholder: '请选择',
        options: groupOptions,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'modelType',
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
        style: 'width: 110px;',
        componentProps: {
          options: [
            {
              label: '标识',
              value: 'modelIdentity',
            },
            {
              label: '名称',
              value: 'modelName',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'modelIdentity',
      },
    },
  ];
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '3' },
    labelWidth: 80,
    schemas,
  });

  // 表格编辑列
  const actionCell = () => {
    return reactive({
      width: 80,
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
  const loadDataTable = async (res: any) => {
    if (showModelState.value && showModelState.value === true) {
      const fieldsValue = getFieldsValue();
      let params = {} as GeneralModelPageParams;
      if (fieldsValue.hasOwnProperty('groupId')) {
        params.groupId = fieldsValue.groupId;
      }
      if (fieldsValue.hasOwnProperty('modelType')) {
        params.modelType = fieldsValue.modelType;
      }
      if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
        params.filed = fieldsValue.filed;
        params.key = fieldsValue.key;
      }
      params.index = res.page || res.current;
      params.size = res.pageSize || res.size;

      const result = (await getGeneralModelPageList(params)) as unknown as {
        status: string;
        message: string;
        data: PageGeneralModel[];
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
    }
  };
  /**
   * 获取模型分组列表
   * @param res 响应数据
   */
  const loadGroupOptions = async () => {
    const result = (await getGeneralModelGroupList()) as unknown as {
      status: string;
      message: string;
      data: GeneralModelGroup[];
    };
    if (result.status === 'success') {
      const list = result.data;
      let options = list.map((item: GeneralModelGroup) => {
        return {
          label: item.groupName,
          value: item.groupId + '',
        };
      });
      return options;
    } else {
      return [];
    }
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 查看
  // 查看
  const handleView = (record: Recordable) => {
    const date = new Date(record.createTime);
    const createTime = format(date, 'yyyy-MM-dd hh:mm:ss');
    const datas = JSON.parse(record.dataDefinition);

    viewParams.value = {
      modelIdentity: record.modelIdentity,
      modelName: record.modelName,
      groupName: record.group.groupName,
      modelType: record.modelType,
      dataType: record.dataType,
      datas: datas,
      charts: record.charts,
      monitor: record.monitor,
      history: record.history,
      readonly: record.readonly,
      share: record.share,
      createTime: createTime,
      isGeneral: true,
    };
    showViewModal.value = true;
  };

  // 批量选择
  const onCheckedRow = (rowKeys: any) => {
    checkRow.value = rowKeys;
  };

  // 查询点击
  const handleSubmit = () => {
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };

  const closeAfter = () => {
    emit('close');
  };
  const confirmForm = async () => {
    const ids = checkRow.value.join(',');
    if (ids && ids !== '') {
      const params = {
        deviceId: localId.value,
        ids,
      };

      const result = (await addDeviceModels(params)) as unknown as {
        status: string;
        message: string;
      };
      if (result.status === 'success') {
        setTimeout(() => {
          showModelState.value = false;
          emit('submit');
        });
      } else {
        window['$message'].error(result.message);
      }
    } else {
      window['$message'].error('请选择要添加的物模型');
    }
  };

  onMounted(async () => {
    groupOptions.value = await loadGroupOptions();
  });
</script>
