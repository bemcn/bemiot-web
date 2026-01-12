<template>
  <n-card :bordered="false">
    <n-tabs
      type="line"
      size="large"
      style="margin-bottom: 15px"
      v-model:value="scopeApp"
      @update:value="handleScopeApp"
    >
      <n-tab name="wechat"> 微信消息模板 </n-tab>
      <n-tab name="sms"> 短信消息模板 </n-tab>
      <n-tab name="mail"> 邮件消息模板 </n-tab>
    </n-tabs>
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
      :row-key="(row) => row.templateId"
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
          新增消息模板
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
  import { h, onMounted, reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageMsgTemplate } from '@/types/BaseModel';
  import {
    getMsgTemplatePageList,
    delMsgTemplate,
    delMsgTemplates,
    MsgTemplatePageParams,
  } from '@/api/base/msgTemplate';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  const route = useRoute();

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('msg_templates');
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
  const scopeApp = ref('wechat');

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
        style: 'width: 150px;',
        componentProps: {
          options: [
            {
              label: '标识',
              value: 'code',
            },
            {
              label: '标题',
              value: 'name',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'name',
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
    }
  };
  // 表格操作列对象
  const actionColumn = actionCell();
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:2 xl:3 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as MsgTemplatePageParams;
    params.scopeApp = scopeApp.value;
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getMsgTemplatePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageMsgTemplate;
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

  const handleScopeApp = (value: string) => {
    scopeApp.value = value;
    reloadTable();
  };

  // 新增
  const handleAdd = () => {
    formParams.value = {
      templateId: 0,
      scopeApp: scopeApp.value,
      identity: '',
      title: '',
      content: '',
      example: '',
      subtype: null,
      dataSource: 'device',
      enumValues: '',
      enumArray: [
        {
          key: '',
          type: 'text',
          value: '',
        },
      ],
      signName: '',
      userSource: 'all',
      userData: '',
      userDataArray: [],
    };
    modalTitle.value = '新增消息模板';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    const enumArray = JSON.parse(record.enumValues);
    let userDataArray = [];
    if (record.userData !== '') {
      userDataArray = JSON.parse(record.userData);
    }
    formParams.value = {
      templateId: record.templateId,
      scopeApp: record.scopeApp,
      identity: record.identity,
      title: record.title,
      content: record.content,
      example: record.example,
      subtype: record.subtype,
      dataSource: record.dataSource,
      enumValues: record.enumValues,
      enumArray,
      signName: record.signName,
      userSource: record.userSource,
      userData: record.userData,
      userDataArray,
    };
    modalTitle.value = '编辑消息模板';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.protocolId,
    };

    try {
      const result = (await delMsgTemplate(params)) as unknown as {
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

    const result = (await delMsgTemplates(params)) as unknown as {
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
    const group = route.query.group;
    scopeApp.value = Array.isArray(group) 
      ? group.length > 0
        ? (group[0] as string)
        : 'wechat'
      : group
      ? (group as string)
      : 'wechat';
  });
</script>
