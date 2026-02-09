<template>
  <n-card :bordered="false">
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
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.modelIdentity"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button v-if="addAuth" type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增物模型
        </n-button>
        <n-button
          v-if="deleteAuth"
          style="margin-left: 10px"
          type="primary"
          @click="handleDelArray"
        >
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

    <InfoFromModal
      :showModel="showModal"
      :options="groupOptions"
      :params="formParams"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
    <ViewInfo
      :showModel="showViewModal"
      :params="viewParams"
      @close="() => (showViewModal = false)"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageGeneralModel } from '@/types/DeviceModel';
  import { GeneralModelGroup } from '@/types/BaseModel';
  import {
    getGeneralModelPageList,
    delGeneralModelById,
    delGeneralModelByIds,
    GeneralModelPageParams,
  } from '@/api/devices/generalModel';
  import { getGeneralModelGroupList } from '@/api/base/generalModelGroup';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  import { format } from 'date-fns';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';
  // @ts-ignore
  import ViewInfo from './ViewInfo.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('general_model');
  const viewAuth = auth.view;
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  const queryRef: any = ref(null);
  const groupOptions = ref<any[]>([]);
  const actionRef = ref();
  const showModal = ref(false);
  const showViewModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({
    modelIdentity: '',
    modelName: '',
    groupId: null,
    modelType: 1,
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
    share: 1,
  });
  const viewParams = ref<any>({
    modelIdentity: '',
    modelName: '',
    groupName: '',
    modelType: 1,
    dataType: 'int',
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
    share: 1,
    createTime: '',
  });

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
    gridProps: { cols: '1 s:1 m:2 l:4 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
  });

  // 表格编辑列
  const actionCell = () => {
    if (editAuth || deleteAuth) {
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
                ifShow: () => {
                  return viewAuth;
                },
              },
              {
                label: '删除',
                onClick: handleDel.bind(null, record),
                ifShow: () => {
                  return deleteAuth;
                },
              },
            ],
          });
        },
      });
    }
  };
  // 表格操作列对象
  const actionColumn = actionCell();
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

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
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
    queryRef.value = getFieldsValue();

    const result = (await getGeneralModelPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageGeneralModel;
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

  // 新增
  const handleAdd = () => {
    formParams.value = {
      modelIdentity: '',
      modelName: '',
      groupId: null,
      modelType: 1,
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
      share: 1,
    };
    modalTitle.value = '新增物模型';
    action.value = 'add';
    showModal.value = true;
  };
  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      identity: record.modelIdentity,
    };

    try {
      const result = (await delGeneralModelById(params)) as unknown as {
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

    const result = (await delGeneralModelByIds(params)) as unknown as {
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
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };

  onMounted(async () => {
    groupOptions.value = await loadGroupOptions();
  });
</script>
