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
      :row-key="(row) => row.bridgeId"
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
          新增数据桥接
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
      :title="modalTitle"
      :params="formParams"
      :action="action"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageDataBridge } from '@/types/RulesModel';
  import {
    getDataBridgePageList,
    delDataBridgeById,
    delDataBridgeByIds,
    DataBridgePageParams,
  } from '@/api/rules/dataBridging';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('data_bridging');
  const viewAuth = auth.view;
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({});

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入数据桥接名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (viewAuth || editAuth || deleteAuth) {
      return reactive({
        width: 220,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '测试',
                onClick: handleTest.bind(null, record),
                ifShow: () => {
                  return viewAuth;
                },
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return editAuth;
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
    } else {
      return null;
    }
  };
  // 表格操作列对象
  const actionColumn = actionCell();
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:4 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as DataBridgePageParams;
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getDataBridgePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageDataBridge;
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

  // 测试
  const handleTest = (record: Recordable) => {
    console.log('record:', record);
    window['$message'].success('测试验证成功');
  };

  // 新增
  const handleAdd = () => {
    formParams.value = {
      bridgeId: '',
      bridgeName: '',
      bridgeDirection: 'input',
      bridgeType: 'http',
      httpUrlType: 'http://',
      httpUrl: '',
      httpMethod: 'GET',
      httpHeader: '',
      httpHeaderArray: [
        {
          key: '',
          value: '',
        },
      ],
      httpParams: '',
      httpParamsArray: [
        {
          key: '',
          value: '',
        },
      ],
      httpBody: '',
      mqttUrl: '',
      mqttClientId: '',
      mqttUsername: '',
      mqttPassword: '',
      mqttTopic: '',
      mqttVersion: null,
      mqttTimeout: null,
      mqttKeepAlive: null,
      mqttAutoLink: false,
      mqttCleanSession: null,
      dataSource: null,
      dataUrl: '',
      dataUsername: '',
      dataPassword: '',
      dataName: '',
      dataSql: '',
      status: false,
    };
    modalTitle.value = '新增数据桥接';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    const httpHeader = record.httpHeader;
    const httpParams = record.httpParams;
    let httpHeaderArray: any[] = [];
    let httpParamsArray: any[] = [];
    if (httpHeader && httpHeader !== '') {
      httpHeaderArray = JSON.parse(httpHeader);
    }
    if (httpParams && httpParams !== '') {
      httpParamsArray = JSON.parse(httpParams);
    }

    formParams.value = {
      bridgeId: record.bridgeId,
      bridgeName: record.bridgeName,
      bridgeDirection: record.bridgeDirection,
      bridgeType: record.bridgeType,
      httpUrlType: record.httpUrlType,
      httpUrl: record.httpUrl,
      httpMethod: record.httpMethod,
      httpHeader: record.httpHeader,
      httpHeaderArray,
      httpParams: record.httpParams,
      httpParamsArray,
      httpBody: record.httpBody,
      mqttUrl: record.mqttUrl,
      mqttClientId: record.mqttClientId,
      mqttUsername: record.mqttUsername,
      mqttPassword: record.mqttPassword,
      mqttTopic: record.mqttTopic,
      mqttVersion: record.mqttVersion ? record.mqttVersion : null,
      mqttTimeout: record.mqttTimeout ? record.mqttTimeout : null,
      mqttKeepAlive: record.mqttKeepAlive ? record.mqttKeepAlive : null,
      mqttAutoLink: record.mqttAutoLink && record.mqttAutoLink === 1 ? true : false,
      mqttCleanSession: record.mqttCleanSession ? record.mqttCleanSession : null,
      dataSource: record.dataSource ? record.dataSource : null,
      dataUrl: record.dataUrl,
      dataUsername: record.dataUsername,
      dataPassword: record.dataPassword,
      dataName: record.dataName,
      dataSql: record.dataSql,
      status: record.status === 0 ? false : true,
    };
    modalTitle.value = '编辑数据桥接';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.bridgeId,
    };

    try {
      const result = (await delDataBridgeById(params)) as unknown as {
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
    // 建议添加检查
    if (!checkRow.value || checkRow.value.length === 0) {
      window['$message'].warning('请至少选择一条记录');
      return;
    }

    const ids = checkRow.value.join(',');
    const params = {
      ids,
    };

    const result = (await delDataBridgeByIds(params)) as unknown as {
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
</script>
