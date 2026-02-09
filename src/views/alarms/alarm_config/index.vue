<template>
  <n-card :bordered="false">
    <BasicForm
      :showAdvancedButton="false"
      @register="register"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.rulesId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1500"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button
          v-if="addAlarmConfig !== undefined ? addAlarmConfig : true"
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增
        </n-button>
        <n-button
          v-if="deleteAlarmConfig !== undefined ? deleteAlarmConfig : true"
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
      :params="formParams"
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { useUserStore } from '@/store/modules/user';
  import { columns } from './columns';
  import {
    getModelAlarmRulesPageList,
    delModelAlarmRules,
    delModelAlarmRulesIds,
    ModelAlarmRulesPageParams,
  } from '@/api/devices/modelAlarmRules';
  import { getProductList, ProductParams } from '@/api/devices/product';
  import { PageModelAlarmRules, Product } from '@/types/DeviceModel';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  let addAlarmConfig, deleteAlarmConfig, editAlarmConfig;

  try {
    const auth = userStore.parseAuthByModule('alarm_config');
    addAlarmConfig = auth.add;
    deleteAlarmConfig = auth.delete;
    editAlarmConfig = auth.edit;
  } catch (e) {
    // 如果权限解析失败，则默认启用所有功能
    addAlarmConfig = true;
    deleteAlarmConfig = true;
    editAlarmConfig = true;
  }

  const actionRef = ref();
  const queryRef: any = ref(null);
  const checkRow: any = ref(null);
  const showModal = ref(false);
  const action = ref('');
  const formParams = ref<any>({});
  const productOptions = ref<any>([]);

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'productId',
      component: 'NSelect',
      label: '产品名称',
      componentProps: {
        placeholder: '请选择产品名称',
        filterable: true,
        options: productOptions,
      },
    },
    {
      field: 'level',
      component: 'NSelect',
      label: '告警级别',
      componentProps: {
        placeholder: '请选择告警级别',
        options: [
          {
            label: '紧急告警',
            value: 1,
          },
          {
            label: '重要告警',
            value: 2,
          },
          {
            label: '一般告警',
            value: 3,
          },
        ],
      },
    },
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    return reactive({
      width: 150,
      title: '操作',
      key: 'action',
      fixed: 'right',
      render(record: Recordable) {
        return h(TableAction as any, {
          style: 'button',
          actions: [
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return editAlarmConfig !== undefined ? editAlarmConfig : true;
              },
            },
            {
              label: '删除',
              onClick: handleDel.bind(null, record),
              ifShow: () => {
                return deleteAlarmConfig !== undefined ? deleteAlarmConfig : true;
              },
            },
          ],
        });
      },
    });
  };

  // 表格操作列对象
  const actionColumn = actionCell();

  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:2 m:3 l:4 xl:5 2xl:6' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params: any = {} as ModelAlarmRulesPageParams;
    if (fieldsValue.hasOwnProperty('productId')) {
      params.productId = fieldsValue.productId;
    }
    if (fieldsValue.hasOwnProperty('level')) {
      params.level = fieldsValue.level;
    }
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getModelAlarmRulesPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageModelAlarmRules;
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
  const loadProductList = async () => {
    const params: any = {} as ProductParams;
    const result = (await getProductList(params)) as unknown as {
      status: string;
      message: string;
      data: Product[];
    };
    if (result.status === 'success') {
      const productList = result.data;
      productOptions.value = productList.map((product) => ({
        label: product.productName,
        value: product.productId,
      }));
    }
  };

  // 刷新表格
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 新增
  const handleAdd = () => {
    formParams.value = {
      rulesId: '',
      rulesName: '',
      productId: '',
      productName: '',
      modelIdentity: '',
      modelName: '',
      dataType: '',
      alarmLevel: '1',
      alarmRules: '',
      rules: [
        {
          link: '',
          model: '',
          operator: '==',
          value: '',
        },
      ],
      alertsType: '1',
      specifyUsers: '',
      users: [],
    };
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    const rules = JSON.parse(record.alarmRules);
    let users = [];
    if (record.specifyUsers && record.specifyUsers.length > 0) {
      users = record.specifyUsers.split(',');
    }

    formParams.value = {
      rulesId: record.rulesId,
      rulesName: record.rulesName,
      productId: record.productId,
      productName: record.product.productName,
      modelIdentity: record.modelIdentity,
      modelName: record.model.modelName,
      dataType: record.model.dataType,
      alarmLevel: record.alarmLevel + '',
      alarmRules: record.alarmRules,
      rules,
      alertsType: record.alertsType + '',
      specifyUsers: record.specifyUsers,
      users,
    };
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.firmwareId,
    };

    try {
      const result = (await delModelAlarmRules(params)) as unknown as {
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
    if (!checkRow.value || checkRow.value.length === 0) {
      window['$message'].warning('请至少选择一条记录');
      return;
    }
    const ids = checkRow.value.join(',');
    const params = {
      ids,
    };

    const result = (await delModelAlarmRulesIds(params)) as unknown as {
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

  onMounted(() => {
    loadProductList();
  });
</script>
