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
      :row-key="(row) => row.platformId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      :headShow="false"
    />

    <InfoFromModal
      :showModel="showModal"
      :params="formParams"
      @close="() => (showModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns } from './columns';
  import { Platform, PagePlatform } from '@/types/BaseModel';
  import { getPlatformPageList, editStatus } from '@/api/base/platform';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('ext_interface');
  const editAuth = auth.edit;

  // 查询表单数据
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '平台名称',
      componentProps: {
        placeholder: '请输入平台名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'accessType',
      component: 'NSelect',
      label: '接入类型',
      componentProps: {
        placeholder: '请选择接入类型',
        options: [
          {
            label: '运用接口',
            value: 1,
          },
          {
            label: '第3方登录',
            value: 2,
          },
          {
            label: '数据接口',
            value: 3,
          },
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const actionRef = ref();

  const showModal = ref(false);
  const formParams = ref<Platform>({
    platformId: '',
    platformName: '',
    appKey: '',
    secretKey: '',
    accessType: 0,
    authJumpUrl: '',
    bindRegUrl: '',
    loginJumpUrl: '',
    errorUrl: '',
    remark: '',
    isSystem: 0,
    iconImg: '',
    status: 0,
  });

  // 根据权限显示表格操作列
  const actionCell = () => {
    if (editAuth) {
      return reactive({
        width: 160,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let statusText = '启用';
          let ifShow = false;
          if (record.isSystem == 1) {
            ifShow = true;
          }
          if (record.status === 1) {
            statusText = '停用';
          }
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return true;
                },
              },
              {
                label: statusText,
                onClick: handleStatus.bind(null, record),
                ifShow: () => {
                  return ifShow;
                },
              },
            ],
          });
        },
      });
    }
  };
  const actionColumn = actionCell();

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    let params = getFieldsValue();
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;

    const result = (await getPlatformPageList(params)) as {
      status: string;
      message: string;
      data: PagePlatform;
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

  const reloadTable = () => {
    actionRef.value.reload();
  };

  const handleEdit = (record: Recordable) => {
    formParams.value = {
      platformId: record.platformId,
      platformName: record.platformName,
      appKey: record.appKey,
      secretKey: record.secretKey,
      accessType: record.accessType,
      authJumpUrl: record.authJumpUrl,
      bindRegUrl: record.bindRegUrl,
      loginJumpUrl: record.loginJumpUrl,
      errorUrl: record.errorUrl,
      remark: record.remark,
      isSystem: record.isSystem,
      iconImg: record.iconImg,
      status: record.status,
    };
    showModal.value = true;
  };

  const handleStatus = async (record: Recordable) => {
    const params = {
      id: record.platformId,
    };

    const result = (await editStatus(params)) as {
      status: string;
      message: string;
    };
    if (result.status === 'success') {
      window['$message'].success('提交成功');
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

<style lang="less" scoped></style>
