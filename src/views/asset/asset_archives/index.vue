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
        <div class="label-head">空间位置</div>
        <div class="class-tree">
          <n-tree
            block-line
            :data="treeData"
            :expand-on-click="false"
            :default-expanded-keys="['0']"
            :node-props="nodeProps"
          />
        </div>
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
          :headShow="false"
        />
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
  import { TreeOption } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageDevice } from '@/types/DeviceModel';
  import { DeviceAttr } from '@/types/AssetModel';
  import { getDevicePageList, DevicePageParams } from '@/api/devices/device';
  import { getProductTree } from '@/api/devices/product';
  import { getDeviceAttrList, DeviceAttrParams } from '@/api/asset/deviceAttr';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import {
    PlusOutlined,
    DeleteOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    DownOutlined,
  } from '@vicons/antd';
  // @ts-ignore
  import InfoFromModal from './InfoFromModal.vue';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('device');
  const editAuth = auth.edit;

  //数据定义
  const queryRef: any = ref(null);
  const chkTreeId = ref('');
  const chkTreeType = ref('');
  const actionRef = ref();
  const showModal = ref(false);
  const formParams = ref<any>({});

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
    if (editAuth) {
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
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                ifShow: () => {
                  return editAuth;
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
   * 获取产品树
   */
  const createTreeData = async () => {
    const result = (await getProductTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      let node = {
        key: '0',
        label: '全部类别',
        value: '0',
        type: '',
        children: result.data,
      };
      return [node];
    } else {
      return [];
    }
  };
  //树定义
  const treeData = ref<any[]>([]);
  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onClick() {
        if (option.key === '') {
          if (chkTreeId.value !== '') {
            chkTreeId.value = '';
            chkTreeType.value = '';
            reloadTable();
          }
        } else {
          const changeId = option.key ? option.key.toString() : '';
          const changeType = option.type ? option.type.toString() : '';
          if (changeId !== '') {
            if (changeId !== chkTreeId.value || changeType !== chkTreeType.value) {
              chkTreeId.value = changeId;
              chkTreeType.value = changeType;
              reloadTable();
            }
          } else {
            chkTreeId.value = '';
            chkTreeType.value = '';
            reloadTable();
          }
        }
      },
    };
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    const fieldsValue = getFieldsValue();
    let params = {} as DevicePageParams;
    if (chkTreeId.value !== '') {
      if (chkTreeType.value === 'class') {
        params.classId = parseInt(chkTreeId.value);
      } else {
        params.productId = chkTreeId.value;
      }
    }
    if (fieldsValue.hasOwnProperty('filed') && fieldsValue.hasOwnProperty('key')) {
      params.filed = fieldsValue.filed;
      params.key = fieldsValue.key;
    }
    params.index = res.current;
    params.size = res.size;
    queryRef.value = getFieldsValue();

    const result = (await getDevicePageList(params)) as unknown as {
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

  // 编辑
  const handleEdit = async (record: Recordable) => {
    let params = {} as DeviceAttrParams;
    params.deviceId = record.deviceId;

    const result = (await getDeviceAttrList(params)) as unknown as {
      status: string;
      message: string;
      data: DeviceAttr[];
    };

    let attrData: any[] | null;
    if (result.status === 'success') {
      attrData = result.data;
    } else {
      attrData = null;
    }

    formParams.value = {
      deviceId: record.deviceId,
      deviceName: record.deviceName,
      productName: record.product.productName,
      types: record.product.types,
      spaceRouteName: record.spaceRouteName,
      ipAddress: record.ipAddress,
      attrList: attrData,
    };
    showModal.value = true;
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
    treeData.value = await createTreeData();
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
</style>
