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
      :row-key="(row) => row.blackId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button v-if="addBlacklist" type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增黑名单
        </n-button>
        <n-button
          v-if="deleteBlacklist"
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
        <ImportExcel
          type="primary"
          :authShow="importBlacklist"
          modelPath="/blacklist/modelExcel"
          importPath="/blacklist/importExcel"
          @import-change="reloadTable"
        />
        <ExportExcel
          type="primary"
          :authShow="exportBlacklist"
          :queryData="queryRef"
          apiPath="/blacklist/exportExcel"
        />
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
  import { PageBlacklist } from '@/types/SystemModel';
  import {
    getBlacklistPageList,
    delBlacklistById,
    delBlacklistByIds,
    BlacklistPageParams,
  } from '@/api/system/blacklist';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('blacklist');
  const addBlacklist = auth.add;
  const editBlacklist = auth.edit;
  const deleteBlacklist = auth.delete;
  const importBlacklist = auth.import;
  const exportBlacklist = auth.export;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({
    blackId: 0,
    ipStart: '',
    ipEnd: '',
    remark: '',
  });

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入IP关键字',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editBlacklist || deleteBlacklist) {
      return reactive({
        width: 170,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let editShow = false;
          if (editBlacklist) {
            editShow = true;
          }
          let delShow = false;
          if (deleteBlacklist) {
            delShow = true;
          }
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return editShow;
                },
              },
              {
                label: '删除',
                onClick: handleDel.bind(null, record),
                ifShow: () => {
                  return delShow;
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
    let params = {} as BlacklistPageParams;
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getBlacklistPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageBlacklist;
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
      blackId: 0,
      ipStart: '',
      ipEnd: '',
      remark: '',
    };
    modalTitle.value = '新增黑名单';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      blackId: record.blackId,
      ipStart: record.ipStart,
      ipEnd: record.ipEnd,
      remark: record.remark,
    };
    modalTitle.value = '编辑黑名单';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.blackId,
    };

    try {
      const result = (await delBlacklistById(params)) as unknown as {
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

    const result = (await delBlacklistByIds(params)) as unknown as {
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
