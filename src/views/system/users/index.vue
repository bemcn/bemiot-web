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
      :row-key="(row) => row.userId"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1280"
      :striped="true"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button v-if="addUser" type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增用户
        </n-button>
        <n-button
          v-if="deleteUser"
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
          :authShow="importUser"
          modelPath="/user/modelExcel"
          importPath="/user/importExcel"
          @import-change="reloadTable"
        />
        <ExportExcel
          type="primary"
          :authShow="exportUser"
          :queryData="queryRef"
          apiPath="/user/exportExcel"
        />
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <InfoFromModal
      :showModel="showModal"
      :title="modalTitle"
      :params="formParams"
      :roles="roleArrays"
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
  import { RoleAuth, PageUserInfo } from '@/types/SystemModel';
  import {
    getUserPageList,
    deleteUserById,
    deleteUserByIds,
    UserPageParams,
  } from '@/api/system/user';
  import { getRoleList } from '@/api/system/role';
  import { format } from 'date-fns';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('users');
  const addUser = auth.add;
  const editUser = auth.edit;
  const deleteUser = auth.delete;
  const importUser = auth.import;
  const exportUser = auth.export;

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({
    userId: 0,
    userName: '',
    passWord: '',
    roleId: 0,
    nickName: '',
    headImg: '',
    sex: '',
    phone: '',
    email: '',
    remark: '',
  });
  const roleArrays = ref<any>([]);

  /**
   * 获取权限列表
   * @param res 响应数据
   */
  const getRoles = async () => {
    const result = (await getRoleList()) as unknown as {
      status: string;
      message: string;
      data: RoleAuth[];
    };
    if (result.status === 'success') {
      const dataList = result.data;
      let list: Array<{ value: string; label: string }> = [];
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        const itemData = {
          value: item.roleId + '',
          label: item.roleName,
        };
        list.push(itemData);
      }
      return list;
    } else {
      return [];
    }
  };

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'roleId',
      component: 'NSelect',
      label: '用户角色',
      componentProps: {
        placeholder: '请选择',
        options: roleArrays,
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
        placeholder: '请输入账号',
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
              label: '账号',
              value: 'userName',
            },
            {
              label: '昵称',
              value: 'nickName',
            },
          ],
          onInput: (e: any) => {
            console.log(e);
          },
        },
        defaultSelectValue: 'userName',
      },
    },
    {
      field: 'dateBetween',
      component: 'NDatePicker',
      label: '创建日期',
      componentProps: {
        placeholder: '请选择',
        type: 'daterange',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editUser || deleteUser) {
      return reactive({
        width: 170,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let editShow = false;
          if (editUser) {
            editShow = true;
          }
          let delShow = false;
          if (deleteUser) {
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
                  return delShow && record.userId !== 1;
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
    let params = {} as UserPageParams;
    if (fieldsValue.hasOwnProperty('roleId')) {
      params.roleId = fieldsValue.roleId;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    if (fieldsValue.hasOwnProperty('dateBetween')) {
      const dateBetweenArray = fieldsValue.dateBetween;
      if (dateBetweenArray.length === 2) {
        const startDate = format(new Date(Number(dateBetweenArray[0])), 'yyyy-MM-dd');
        const endDate = format(new Date(Number(dateBetweenArray[1])), 'yyyy-MM-dd');
        params.startDate = startDate;
        params.endDate = endDate;
      }
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getUserPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageUserInfo;
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
      userId: 0,
      userName: '',
      passWord: '',
      roleId: null,
      nickName: '',
      headImg: '/src/assets/images/schoolboy.png',
      sex: 0,
      phone: '',
      email: '',
      remark: '',
    };
    modalTitle.value = '新增用户';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      userId: record.userId,
      userName: record.userName,
      passWord: '',
      roleId: record.role.roleId + '',
      nickName: record.nickName,
      headImg: record.headImg,
      sex: record.sex,
      phone: record.phone,
      email: record.email,
      remark: record.remark,
    };
    modalTitle.value = '编辑用户';
    action.value = 'edit';
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.userId,
    };

    try {
      const result = (await deleteUserById(params)) as unknown as {
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

    const result = (await deleteUserByIds(params)) as unknown as {
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
    roleArrays.value = await getRoles();
  });
</script>
