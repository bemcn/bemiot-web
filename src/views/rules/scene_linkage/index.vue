<template>
  <div v-show="viewMain">
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
        :row-key="(row) => row.sceneId"
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
            新增场景联动
          </n-button>
          <n-button v-if="addAuth" style="margin-left: 10px" type="primary" @click="handleTest">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            测试规则编辑
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
    </n-card>
  </div>
  <div v-show="viewMain === false">
    <RulesEditor
      :name="rulesName"
      :data="null"
      @close="() => (viewMain = true)"
      @submit="reloadTable"
    />
  </div>
  <InfoFromModal
    :showModel="showModal"
    :title="modalTitle"
    :options="groupOptions"
    :params="formParams"
    :action="action"
    @close="() => (showModal = false)"
    @submit="reloadTable"
  />
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageSceneLinkage, SceneGroup } from '@/types/RulesModel';
  import {
    getSceneLinkagePageList,
    updateStatus,
    delSceneLinkageById,
    delSceneLinkageByIds,
    SceneLinkagePageParams,
  } from '@/api/rules/sceneLinkage';
  import { getSceneGroupList } from '@/api/rules/sceneGroup';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';
  // @ts-ignore
  import RulesEditor from '@/components/RulesEditor/RulesEditor.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('scene_linkage');
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  const viewMain = ref(false);
  const queryRef: any = ref(null);
  const groupOptions = ref<any[]>([]);
  const actionRef = ref();
  const showModal = ref(false);
  const showTestModal = ref(false);
  const modalTitle = ref('');
  const action = ref('');
  const checkRow: any = ref(null);
  const formParams = ref<any>({});
  const rulesName = ref('测试场景联动');

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
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入群控名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  // 表格操作列
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
                label: record.status === 0 ? '启用' : '禁用',
                onClick: handleStatic.bind(null, record),
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
  const actionColumn = actionCell();
  // 查询表单对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  /**
   * 获取分组列表
   * @param res 响应数据
   */
  const loadGroupOptions = async () => {
    const result = (await getSceneGroupList()) as unknown as {
      status: string;
      message: string;
      data: SceneGroup[];
    };
    if (result.status === 'success') {
      const list = result.data;
      let options = list.map((item: SceneGroup) => {
        return {
          label: item.groupName,
          value: item.sceneGroupId + '',
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
    let params = {} as SceneLinkagePageParams;
    if (fieldsValue.hasOwnProperty('groupId')) {
      params.sceneGroupId = fieldsValue.groupId;
    }
    if (fieldsValue.hasOwnProperty('key')) {
      params.key = fieldsValue.key;
    }
    params.index = res.page || res.current;
    params.size = res.pageSize || res.size;
    queryRef.value = getFieldsValue();

    const result = (await getSceneLinkagePageList(params)) as unknown as {
      status: string;
      message: string;
      data: PageSceneLinkage;
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
      sceneId: 0,
      sceneGroupId: null,
      sceneName: '',
      executionMethod: '1',
      silentPeriod: '0',
      timeConditions: '',
      timeConditionsObj: {
        repeatRules: 'day',
        repeatMonths: [],
        repeatDays: [],
        repeatWeeks: [],
        repeatHours: [],
        repeatMinute: '0',
      },
      elData: '',
      elDataObj: {},
      remark: '',
    };
    viewMain.value = false;
  };

  // 测试规则编辑器
  const handleTest = () => {
    showTestModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    const executionMethod = record.executionMethod;
    let timeConditionsObj = {};
    if (executionMethod === 3) {
      timeConditionsObj = JSON.parse(record.timeConditions);
    }
    const elDataObj = JSON.parse(record.elData);

    formParams.value = {
      sceneId: record.sceneId,
      sceneGroupId: record.sceneGroupId === 0 ? null : record.sceneGroupId + '',
      sceneName: record.sceneName,
      executionMethod: record.executionMethod + '',
      silentPeriod: record.silentPeriod + '',
      timeConditions: record.timeConditions,
      timeConditionsObj,
      elData: record.elData,
      elDataObj,
      remark: record.remark,
    };
    modalTitle.value = '编辑场景联动';
    action.value = 'edit';
    showModal.value = true;
  };

  // 禁用/启用
  const handleStatic = async (record: Recordable) => {
    const params = {
      id: record.sceneId,
      status: record.status === 0 ? 1 : 0,
    };

    try {
      const result = (await updateStatus(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('变更状态成功');
        reloadTable();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('变更状态失败');
    }
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.sceneId,
    };

    try {
      const result = (await delSceneLinkageById(params)) as unknown as {
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

    const result = (await delSceneLinkageByIds(params)) as unknown as {
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
