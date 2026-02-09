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
      :row-key="(row) => row.protocolId"
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
          新增协议信息
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
      :options="protocolsArrays"
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
  import { PageProtocols } from '@/types/BaseModel';
  import {
    getProtocolsPageList,
    delProtocolsById,
    delProtocolsByIds,
    ProtocolsPageParams,
  } from '@/api/base/protocols';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('protocols');
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
  const protocolsArrays = ref<any>([]);

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入协议名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editAuth || deleteAuth) {
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
                label: '消息规则',
                onClick: handleEdit.bind(null, record),
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
                  return deleteAuth && record.built === 0;
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
    let params = {} as ProtocolsPageParams;
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getProtocolsPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageProtocols;
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

  // 新增
  const handleAdd = () => {
    formParams.value = {
      protocolId: 0,
      protocolName: '',
      request: '',
      response: '',
      registration: '',
      heartbeat: '',
    };
    modalTitle.value = '新增协议信息';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      protocolId: record.protocolId,
      protocolName: record.protocolName,
      request: record.request,
      response: record.response,
      registration: record.registration,
      heartbeat: record.heartbeat,
    };
    modalTitle.value = '编辑协议信息';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.protocolId,
    };

    try {
      const result = (await delProtocolsById(params)) as unknown as {
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

    const result = (await delProtocolsByIds(params)) as unknown as {
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
