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
      :row-key="(row) => row.roleId"
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
          新增角色
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
        <ImportExcel
          type="primary"
          :authShow="importAuth"
          modelPath="/role/modelExcel"
          importPath="/role/importExcel"
          @import-change="reloadTable"
        />
        <ExportExcel
          type="primary"
          :authShow="exportAuth"
          :queryData="queryRef"
          apiPath="/role/exportExcel"
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

    <AuthFromModal
      :showModel="showAuthModal"
      :params="formAuthParams"
      @close="() => (showAuthModal = false)"
      @submit="reloadTable"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, onMounted, onUnmounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { RoleAuth, PageRoleAuth } from '@/types/SystemModel';
  import {
    getRolePageList,
    updateRoleOrder,
    deleteRoleById,
    deleteRolesByIds,
  } from '@/api/system/role';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { columns, roleAuthData } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';
  // @ts-ignore
  import AuthFromModal from './AuthFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('role_auth');
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;
  const importAuth = auth.import;
  const exportAuth = auth.export;

  // 查询表单渲染
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const queryRef: any = ref(null);
  const actionRef = ref();
  const showModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({
    roleId: 0,
    roleName: '',
    roleAuth: '',
    orderNum: '',
    remark: '',
  });

  const showAuthModal = ref(false);
  const formAuthParams = ref<any>({
    roleId: 0,
    roleName: '',
    roleAuth: [],
  });

  // 根据权限渲染表格操作列
  const actionCell = () => {
    if (editAuth || deleteAuth) {
      return reactive({
        width: 220,
        title: '操作',
        key: 'action',
        fixed: 'right',
        render(record: Recordable) {
          let editShow = false;
          if (editAuth) {
            editShow = true;
          }
          let delShow = false;
          if (deleteAuth) {
            delShow = true;
          }
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                label: '权限配置',
                onClick: handleAuth.bind(null, record),
                ifShow: () => {
                  return editShow;
                },
              },
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
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    let params = getFieldsValue();
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getRolePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageRoleAuth;
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
      roleId: 0,
      roleName: '',
      roleAuth: '{}',
      orderNum: '1',
      remark: '',
    };
    modalTitle.value = '新增角色';
    action.value = 'add';
    showModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      roleId: record.roleId,
      roleName: record.roleName,
      roleAuth: record.roleAuth,
      orderNum: record.orderNum + '',
      remark: record.remark,
    };
    modalTitle.value = '编辑角色';
    action.value = 'edit';
    showModal.value = true;
  };

  // 权限配置
  const handleAuth = (record: Recordable) => {
    const roleAuthStr = record.roleAuth;
    const roleAuthArray = JSON.parse(roleAuthStr);

    const authData = JSON.parse(JSON.stringify(roleAuthData));

    for (let i = 0; i < roleAuthArray.length; i++) {
      const item = roleAuthArray[i];
      const itemValue = item.value;
      const isAuths = item.hasOwnProperty('auths');

      for (let j = 0; j < authData.length; j++) {
        let roleItem = authData[j];
        if (roleItem.value === itemValue) {
          roleItem.check = true;
          const isChild = roleItem.hasOwnProperty('auths');
          if (isChild && isAuths) {
            const auths = item.auths;
            let childAuths = roleItem.auths;
            if (auths.hasOwnProperty('view') && auths.view) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'view') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('add') && auths.add) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'add') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('edit') && auths.edit) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'edit') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('delete') && auths.delete) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'delete') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('import') && auths.import) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'import') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('export') && auths.export) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'export') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('download') && auths.download) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'download') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            if (auths.hasOwnProperty('option') && auths.option) {
              for (let k = 0; k < childAuths.length; k++) {
                if (childAuths[k].key === 'option') {
                  childAuths[k].check = true;
                  break;
                }
              }
            }
            roleItem.auths = childAuths;
          }
          authData[j] = roleItem;
          break;
        }
      }
    }
    const authGroup = groupByAuth(authData);
    formAuthParams.value = {
      roleId: record.roleId,
      roleName: record.roleName,
      roleAuth: authGroup,
    };
    showAuthModal.value = true;
  };

  const groupByAuth = (authData: any[]) => {
    let roleAuth: any = {};
    let deviceArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'device' ||
        item.value === 'device_controls' ||
        item.value === 'device_map' ||
        item.value === 'product' ||
        item.value === 'firmware' ||
        item.value === 'general_model'
      ) {
        deviceArray.push(item);
      }
    });
    roleAuth.deviceRole = deviceArray;

    let sceneArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'data_bridging' ||
        item.value === 'scene_group' ||
        item.value === 'scene_linkage'
      ) {
        sceneArray.push(item);
      }
    });
    roleAuth.sceneRole = sceneArray;

    let videoArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'split_screen' ||
        item.value === 'video_record' ||
        item.value === 'voice_intercom' ||
        item.value === 'voice_conf' ||
        item.value === 'video_alarm'
      ) {
        videoArray.push(item);
      }
    });
    roleAuth.videoRole = videoArray;

    let analysisArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'agg_analysis' ||
        item.value === 'data_query' ||
        item.value === 'data_analysis' ||
        item.value === 'data_maint'
      ) {
        analysisArray.push(item);
      }
    });
    roleAuth.analysisRole = analysisArray;

    let assetArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'asset_archives' ||
        item.value === 'asset_attr' ||
        item.value === 'asset_distribution' ||
        item.value === 'asset_map'
      ) {
        assetArray.push(item);
      }
    });
    roleAuth.assetRole = assetArray;

    let alarmArray: any[] = [];
    authData.forEach((item) => {
      if (item.value === 'alarm_statistics' || item.value === 'alarm_log') {
        alarmArray.push(item);
      }
    });
    roleAuth.alarmRole = alarmArray;

    let monitorArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'platform_monitor' ||
        item.value === 'scheduled_monitor' ||
        item.value === 'cache_monitor' ||
        item.value === 'message_monitor' ||
        item.value === 'data_monitor' ||
        item.value === 'run_monitor'
      ) {
        monitorArray.push(item);
      }
    });
    roleAuth.monitorRole = monitorArray;

    let baseArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'space' ||
        item.value === 'product_class' ||
        item.value === 'device_group' ||
        item.value === 'general_model_group' ||
        item.value === 'drive' ||
        item.value === 'certificate' ||
        item.value === 'alarm_config'
      ) {
        baseArray.push(item);
      }
    });
    roleAuth.baseARole = baseArray;

    let sysArray: any[] = [];
    authData.forEach((item) => {
      if (
        item.value === 'sys_param' ||
        item.value === 'ext_interface' ||
        item.value === 'role_auth' ||
        item.value === 'users' ||
        item.value === 'blacklist' ||
        item.value === 'sys_log'
      ) {
        sysArray.push(item);
      }
    });
    roleAuth.sysRole = sysArray;
    return roleAuth;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.roleId,
    };

    try {
      const result = (await deleteRoleById(params)) as unknown as {
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

    const result = (await deleteRolesByIds(params)) as unknown as {
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

  // 更新排序值的函数
  const editOrderNumber = async (index: number, value: number, record: RoleAuth) => {
    try {
      // 发送请求更新后端数据
      const params = {
        id: Number(record.roleId), // 强制转换为 number 类型
        orderNum: value,
      };

      const result = (await updateRoleOrder(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        if (actionRef.value && typeof actionRef.value.setTableData === 'function') {
          // 如果有 setTableData 方法，可以局部更新
          const currentData = [...actionRef.value.getDataSource()];
          if (currentData[index]) {
            currentData[index].orderNum = value;
            actionRef.value.setTableData(currentData);
          }
        } else {
          // 否则刷新整个表格
          reloadTable();
        }
      } else {
        window['$message'].error(result.message || '排序值更新失败');
        // 恢复原来的值
        const currentData = [...actionRef.value.getDataSource()];
        if (currentData && currentData[index]) {
          currentData[index].orderNum = record.orderNum;
        }
      }
    } catch (error) {
      window['$message'].error('排序值更新异常');
      // 恢复原来的值
      const currentData = [...actionRef.value.getDataSource()];
      if (currentData && currentData[index]) {
        currentData[index].orderNum = record.orderNum;
      }
    }
  };

  // 监听排序值更新事件的处理函数
  const handleUpdateOrderNumber = (event: CustomEvent) => {
    const { index, value, record } = event.detail;
    // 添加防抖处理，避免频繁请求
    clearTimeout((window as any).orderNumberUpdateTimer);
    (window as any).orderNumberUpdateTimer = setTimeout(() => {
      editOrderNumber(index, value, record);
    }, 500);
  };

  // 在组件挂载时监听事件
  onMounted(() => {
    window.addEventListener('updateOrderNumber', handleUpdateOrderNumber as EventListener);
  });

  // 在组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('updateOrderNumber', handleUpdateOrderNumber as EventListener);
    // 清除定时器
    if ((window as any).orderNumberUpdateTimer) {
      clearTimeout((window as any).orderNumberUpdateTimer);
    }
  });
</script>
