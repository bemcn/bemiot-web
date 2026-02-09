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
  <div class="main-panner">
    <div class="left-block">
      <n-card :bordered="false" style="height: 100%; overflow-y: auto; padding-bottom: 15px">
        <n-space vertical>
          <n-input v-model:value="queryKey" placeholder="搜索用户">
            <template #prefix>
              <n-icon :component="SearchOutlined" />
            </template>
          </n-input>
          <n-scrollbar style="max-height: 500px">
            <n-list hoverable clickable>
              <n-list-item
                v-for="user in userData"
                :key="user.userId"
                @click="handleUser(user.userId, user.userName)"
                :class="{ 'selected-table': selectedUserId === user.userId }"
              >
                <n-thing :title="user.userName">
                  <template #description>
                    <n-tag size="small" type="success">
                      {{ user.role.roleName }}
                    </n-tag>
                    <span class="table-label">{{ user.nickName }}</span>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-scrollbar>
        </n-space>
      </n-card>
    </div>
    <div class="right-block">
      <n-card :bordered="false">
        <BasicTable
          :columns="columns"
          :request="loadDataTable"
          :row-key="(row) => (row.deviceId ? row.deviceId : 'row_' + Math.random())"
          ref="actionRef"
          :actionColumn="actionColumn"
          :scroll-x="1260"
          @update:checked-row-keys="onCheckedRow"
        >
          <template #tableTitle>
            <n-button v-if="addAuth && selectedUserId > 0" type="primary" @click="handleAdd">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新增资产关系
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
              批量解绑
            </n-button>
          </template>

          <template #toolbar> </template>
        </BasicTable>
      </n-card>
    </div>
  </div>
  <InfoFromModal
    :showModel="showModal"
    :params="formParams"
    @close="() => (showModal = false)"
    @submit="reloadTable"
  />
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageDevice } from '@/types/DeviceModel';
  import {
    getDeviceAssetPageList,
    liftedUser,
    liftedUserArray,
    DevicePageParams,
  } from '@/api/devices/device';
  import { getUserList, UserParams } from '@/api/system/user';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('asset_attr');
  const addAuth = auth.add;
  const deleteAuth = auth.delete;

  //数据定义
  const queryRef: any = ref(null);
  const checkRow: any = ref(null);
  const queryKey = ref('');
  const selectedUserId = ref(0);
  const selectedUserName = ref('');
  const actionRef = ref();
  const showModal = ref(false);
  const formParams = ref<any>({});
  const userData = ref<any[]>([]);

  // 查询组件
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
              label: '设备编号',
              value: 'code',
            },
            {
              label: '设备名称',
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
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:2 xl:3 2xl:3' },
    labelWidth: 80,
    schemas,
  });

  // 表格操作列
  const actionCell = () => {
    if (deleteAuth) {
      return reactive({
        width: 80,
        title: '操作',
        key: 'action',
        fixed: 'right' as const,
        render(record: Recordable) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '解绑',
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
  const actionColumn = actionCell();

  /**
   * 获取用户列表
   */
  const getUserInfoList = async () => {
    let params = {} as UserParams;
    if (queryKey.value !== '') {
      params = {
        filed: 'nickName',
        key: queryKey.value,
      };
    }

    const result = (await getUserList(params)) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };

  const handleUser = (userId: number, userName: string) => {
    selectedUserId.value = userId;
    selectedUserName.value = userName;
    reloadTable();
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as DevicePageParams;
    if (selectedUserId.value > 0) {
      params.userId = selectedUserId.value;
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.current;
    params.size = res.size;
    queryRef.value = getFieldsValue();

    const result = (await getDeviceAssetPageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageDevice;
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return null;
    }
  };

  // 刷新表格
  const reloadTable = async () => {
    actionRef.value.reload();
  };

  // 新增
  const handleAdd = () => {
    let userId = selectedUserId.value;
    let userName = selectedUserName.value;

    formParams.value = {
      userId,
      userName,
    };
    showModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.deviceId,
    };

    try {
      const result = (await liftedUser(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('解绑成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('解绑失败');
    }
  };

  // 批量选择
  const onCheckedRow = (rowKeys: any) => {
    checkRow.value = rowKeys;
  };

  // 批量删除
  const handleDelArray = async () => {
    if (checkRow.value === null || checkRow.value.length === 0) {
      window['$message'].success('请选择要解绑的设备');
    } else {
      const ids = checkRow.value.join(',');
      const params = {
        ids,
      };

      const result = (await liftedUserArray(params)) as unknown as {
        status: string;
        message: string;
      };
      if (result.status === 'success') {
        window['$message'].success('解绑成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
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
    userData.value = await getUserInfoList();
  });
</script>
<style lang="less" scoped>
  .main-panner {
    width: 100%;
    height: 100%;
    padding-bottom: 207px;
    padding-right: 220px;
    position: fixed;
    top: 197px;
    left: 210px;
    z-index: 10;
    .left-block {
      width: 250px;
      height: 100%;
      float: left;
      .label-head {
        width: 100%;
        height: 34px;
        font-size: 15px;
        font-weight: 600;
      }
    }
    .right-block {
      height: 100%;
      margin-left: 265px;
      min-height: 100px;
      overflow-y: auto;
    }
  }

  .data-query-container {
    height: 100%;
  }
  .query-container {
    display: flex;
    gap: 16px;
  }
  .table-list-card {
    flex: 0 0 300px;
  }
  .sql-editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .sql-input {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  }
  .editor-toolbar {
    display: flex;
    justify-content: flex-start;
  }
  .result-message {
    margin-bottom: 16px;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
  .mt-2 {
    margin-top: 8px;
  }
  .py-8 {
    padding-top: 32px;
    padding-bottom: 32px;
  }
  .flex {
    display: flex;
  }
  .justify-center {
    justify-content: center;
  }
  .table-rows {
    margin-left: 10px;
    font-size: 12px;
    color: #666;
  }
  .selected-table {
    border-left: 3px solid #18a058;
    background-color: #f8f8f8;
  }
  .table-label {
    margin-left: 10px;
    font-size: 13px;
    color: #999999;
  }
</style>
