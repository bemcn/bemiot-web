<template>
  <n-modal
    v-model:show="showModelState"
    :show-icon="false"
    preset="dialog"
    style="width: 1180px"
    title="选择元数据"
    @after-leave="closeAfter"
  >
    <div class="main-head">
      <div class="label">元数据名称</div>
      <div class="fromcell">
        <n-input
          maxlength="30"
          v-model:value="queryName"
          type="text"
          placeholder="请输入元数据名称"
          clearable
        />
      </div>
      <div class="btnbox">
        <n-button type="info" @click="handleQuery">查询</n-button>
      </div>
      <div class="btnbox">
        <n-button @click="handleRest">重置</n-button>
      </div>
    </div>
    <div class="main-panner">
      <div class="left-block">
        <div class="label-head">
          <n-input
            maxlength="20"
            v-model:value="queryKey"
            type="text"
            placeholder="请输入关键字"
            clearable
            @keyup="handleKeyUp"
            @clear="handleKeyClear"
          />
        </div>
        <div class="tree-box">
          <n-tree
            block-line
            :data="treeOptions"
            :expand-on-click="true"
            :default-expanded-keys="['0']"
            :node-props="nodeProps"
            v-show="!queryKey"
          />
          <div
            :class="checkDevId === item.deviceId ? 'q-line active' : 'q-line'"
            v-for="(item, index) in deviceOptions"
            :key="index"
            @click="selectDevice(item)"
            v-show="queryKey"
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
      <div class="right-block">
        <n-card :bordered="false" size="small">
          <n-data-table
            :columns="modelColumns"
            :data="modelList"
            :pagination="pagination"
            :bordered="false"
            :max-height="365"
            :scroll-x="760"
            :row-props="rowProps"
          />
        </n-card>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { TreeOption } from 'naive-ui';
  import { debounce } from 'lodash-es';
  import { getDeviceModelPageList, DeviceModelPageParams } from '@/api/devices/deviceModel';
  import { getDevicesTree, getDeviceList } from '@/api/devices/device';
  import { modelColumns } from './columns';
  // @ts-ignore
  import { CaretRightFilled } from '@vicons/antd';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  });

  const queryName = ref('');
  const queryKey = ref('');
  const treeOptions = ref<any[]>([]);
  const deviceOptions = ref<any[]>([]);

  const showModelState = ref(false);
  const subassemblyId = ref('');
  const modelType = ref('');
  const checkDevId = ref<string | null>(null);
  const checkDevName = ref('');
  const spaceData = ref<any[]>([]);
  const modelList = ref<any[]>([]);

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 40, 50],
    onChange: (page: number) => {
      pagination.page = page;
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    },
  });

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch(
    [() => props.showModel, () => props.id, () => props.type],
    async ([newShowModel, newId, newType]) => {
      showModelState.value = newShowModel;
      subassemblyId.value = newId;
      modelType.value = newType;
      if (newShowModel === true) {
        treeOptions.value = await createTreeData();
        spaceData.value = await createPositionData();
        loadDataTable();
      }
    }
  );

  /**
   * 获取设备位置树
   */
  const createTreeData = async () => {
    const params = {
      types: '1,2,3,4,6',
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
          const id = option.id + '';
          checkDevId.value = id;
          checkDevName.value = (option.label as string) || '';
          reloadTable();
        }
      },
    };
  };
  const createDeviceData = async () => {
    const params = {
      filed: 'name',
      key: queryKey.value,
    };
    console.log('params', params);

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
    checkDevId.value = '';
    reloadTable();
  };
  const selectDevice = (item: any) => {
    const devId = item.checkDevId;
    if (checkDevId.value !== devId) {
      checkDevId.value = devId;
      reloadTable();
    }
  };

  // 物模型查询
  const handleQuery = () => {
    reloadTable();
  };
  const handleRest = () => {
    queryName.value = '';
    reloadTable();
  };

  /**
   * 获取表格数据
   * @param res 响应数据
   */
  const loadDataTable = async () => {
    if (checkDevId.value && checkDevId.value.length > 0) {
      let params = {} as DeviceModelPageParams;
      params.history = 2;

      params.deviceId = checkDevId.value;
      if (queryName.value && queryName.value !== '') {
        params.name = queryName.value;
      }
      // params.index = res.page || res.current;
      // params.size = res.pageSize || res.size;
      console.log('params', params);

      const result = (await getDeviceModelPageList(params)) as unknown as {
        status: string;
        message: string;
        data: {
          records: any[];
          current: Number;
          pages: Number;
          size: Number;
          total: Number;
        };
      };
      if (result.status === 'success') {
        console.log('result.data', result.data);
        modelList.value = result.data.records;
      } else {
        modelList.value = [];
      }
    } else {
      modelList.value = [];
    }
  };

  const createPositionData = async () => {
    const params = {};
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

  // 刷新表格
  const reloadTable = () => {
    loadDataTable();
  };

  const rowProps = (row: any) => {
    return {
      onClick: () => {
        emit('checked', row);
        showModelState.value = false; // 关闭模态框
      },
    };
  };

  const closeAfter = () => {
    emit('close');
  };
</script>

<style lang="less" scoped>
  .main-head {
    height: 54px;
    border: 1px solid #eeeeee;
    padding: 10px 15px;
    margin-bottom: 15px;
    .label {
      height: 34px;
      line-height: 34px;
      margin-right: 10px;
      float: left;
    }
    .fromcell {
      width: 180px;
      height: 34px;
      margin-right: 20px;
      float: left;
    }
    .btnbox {
      height: 34px;
      margin-right: 10px;
      float: left;
    }
  }
  .main-panner {
    width: 100%;
    height: 480px;
    .left-block {
      width: 220px;
      height: 480px;
      border: 1px solid #eeeeee;
      padding: 10px;
      float: left;
      .label-head {
        width: 100%;
        height: 34px;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
    .right-block {
      height: 100%;
      margin-left: 235px;
      min-height: 100px;
      overflow-y: auto;
      border: 1px solid #eeeeee;
      .card-box {
        width: 100%;
        position: relative;
      }
    }
  }

  .tree-box {
    width: 100%;
    height: 416px;
    overflow-y: auto;
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
        margin-left: 24px;
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
</style>
