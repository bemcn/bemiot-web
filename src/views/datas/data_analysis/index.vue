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
      <n-card size="small" :bordered="false" style="min-height: 540px">
        <template #header>
          <n-input
            maxlength="20"
            v-model:value="queryKey"
            type="text"
            placeholder="请输入关键字"
            clearable
            @keyup="handleKeyUp"
            @clear="handleKeyClear"
          />
        </template>
        <div class="card-content">
          <n-tree
            block-line
            :data="treeOptions"
            :expand-on-click="true"
            :default-expanded-keys="['0']"
            :node-props="nodeProps"
            v-show="!queryKey"
          />
          <div class="q-box" v-show="queryKey">
            <div
              :class="deviceId === item.deviceId ? 'q-line active' : 'q-line'"
              v-for="(item, index) in deviceOptions"
              :key="index"
              @click="selectDevice(item)"
            >
              <div class="item-icon">
                <n-icon size="10" color="#777">
                  <CaretRightFilled />
                </n-icon>
              </div>
              <div class="item-label">{{ item.deviceName }}</div>
            </div>
          </div>
        </div>
      </n-card>
    </div>
    <div class="right-block">
      <n-card :bordered="false">
        <div>
          <BasicTable
            :columns="columns"
            :request="loadDataTable"
            :row-key="(row) => (row.channelId ? row.channelId : 'row_' + Math.random())"
            ref="actionRef"
            :actionColumn="actionColumn"
            :scroll-x="1680"
            :headShow="false"
            @update:checked-row-keys="onCheckedRow"
          />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref } from 'vue';
  import { TreeOption } from 'naive-ui';
  import { debounce } from 'lodash-es';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PageProduct } from '@/types/DeviceModel';
  import {
    getDeviceChannelPageList,
    delDeviceChannelById,
    delDeviceChannelByIds,
    DeviceChannelPageParams,
  } from '@/api/video/deviceChannel';
  import { getDevicesTree, getDeviceList } from '@/api/devices/device';
  import { columns } from './columns';
  import { useUserStore } from '@/store/modules/user';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined, ReloadOutlined, CaretRightFilled } from '@vicons/antd';

  // 获取权限
  const userStore = useUserStore();
  const auth = userStore.parseAuthByModule('product');
  const viewAuth = auth.view;
  const addAuth = auth.add;
  const editAuth = auth.edit;
  const deleteAuth = auth.delete;

  //数据定义
  const queryRef: any = ref(null);
  const deviceId = ref(0);
  const queryKey = ref('');
  const treeOptions = ref<any[]>([]);
  const deviceOptions = ref<any[]>([]);
  const checkRow: any = ref(null);
  const actionRef = ref();
  const showAddModal = ref(false);
  const showEditModal = ref(false);
  const showViewModal = ref(false);
  const formParams = ref<any>({});

  // 查询组件
  const schemas: FormSchema[] = [
    {
      field: 'key',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  // 查询组件工具对象
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:4 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
  });

  // 表格操作列对象
  const actionColumn = {};

  /**
   * 获取设备位置树
   */
  const createTreeData = async () => {
    const params = {
      types: 3,
      lastType: 0,
    };

    const result = (await getDevicesTree(params)) as unknown as {
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
  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onClick() {
        if (option.type === 'device') {
          const key = option.key + '';
          const devId = parseInt(key);
          if (deviceId.value !== devId) {
            deviceId.value = devId;
            reloadTable();
          }
        }
      },
    };
  };
  const createDeviceData = async () => {
    const params = {
      types: 3,
      key: queryKey.value,
    };

    const result = (await getDeviceList(params)) as unknown as {
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
  // 防抖处理查询函数
  const debouncedHandleQuery = debounce(async () => {
    if (queryKey.value) {
      deviceOptions.value = await createDeviceData();
    } else {
      deviceOptions.value = [];
    }
  }, 500);
  const handleKeyUp = () => {
    debouncedHandleQuery();
  };
  const handleKeyClear = async () => {
    queryKey.value = '';
    deviceId.value = 0;
    reloadTable();
  };
  const selectDevice = (item: any) => {
    const devId = item.deviceId;
    if (deviceId.value !== devId) {
      deviceId.value = devId;
      reloadTable();
    }
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async (res: any) => {
    return null;
  };

  // 刷新表格
  const reloadTable = async () => {
    actionRef.value.reload();
  };

  const reloadOptionTable = async () => {
    queryKey.value = '';
    deviceId.value = 0;
    actionRef.value.reload();
  };

  // 查看
  const handleView = (record: Recordable) => {
    formParams.value = {
      channelId: record.channelId,
      channelName: record.channelName,
    };
    showViewModal.value = true;
  };

  // 新增
  const handleAdd = () => {
    formParams.value = {
      deviceId: deviceId.value > 0 ? deviceId.value + '' : null,
      serverId: null,
      ipAddress: '',
      port: '1935',
      account: '',
      password: '',
      ptzType: '0',
      count: '1',
    };
    showAddModal.value = true;
  };

  // 编辑
  const handleEdit = (record: Recordable) => {
    formParams.value = {
      channelId: record.channelId,
      serverId: record.serverId + '',
      channelName: record.channelName,
      ipAddress: record.ipAddress,
      port: record.port + '',
      account: record.account,
      password: record.password,
      ptzType: record.ptzType,
      device: record.device,
      server: record.server,
    };
    showEditModal.value = true;
  };

  // 删除
  const handleDel = async (record: Recordable) => {
    const params = {
      id: record.channelId,
    };

    try {
      const result = (await delDeviceChannelById(params)) as unknown as {
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

  // 查询点击
  const handleSubmit = () => {
    reloadTable();
  };

  // 重置点击
  const handleReset = () => {
    reloadTable();
  };

  // 批量选择
  const onCheckedRow = (rowKeys: any) => {
    checkRow.value = rowKeys;
  };

  const handleDelArray = async () => {
    const ids = checkRow.value.join(',');
    const params = {
      ids,
    };

    const result = (await delDeviceChannelByIds(params)) as unknown as {
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

  onMounted(async () => {
    treeOptions.value = await createTreeData();
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
      .card-box {
        width: 100%;
        position: relative;
      }
    }
  }

  .card-content {
    width: 100%;
    height: 100%;
    padding: 0px 0px 20px 0px;
    color: #333333;
    font-size: 14px;
    .card-info {
      width: 100%;
      height: 48px;
      margin-bottom: 15px;
      padding: 10px 10px 10px 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
    .q-box {
      width: 100%;
      position: relative;
      .q-line {
        width: 100%;
        height: 24px;
        background-color: #ffffff;
        margin: 5px 0px;
        .item-icon {
          width: 24px;
          height: 22px;
          text-align: center;
          float: left;
        }
        .item-label {
          height: 22px;
          line-height: 22px;
          margin-left: 26px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .q-line:hover {
        background-color: #f5f5f5;
      }
      .active {
        background-color: #eaf3fd;
      }
    }
  }
</style>
