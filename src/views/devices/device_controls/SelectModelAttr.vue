<template>
  <n-modal
    v-model:show="showModelState"
    :show-icon="false"
    preset="dialog"
    style="width: 1260px"
    title="选择物模型属性/事件"
    @after-leave="closeAfter"
  >
    <n-card :bordered="false" class="mt-3" content-style="padding: 0px !important;">
      <n-grid x-gap="15" y-gap="15" :cols="24">
        <n-grid-item span="6">
          <n-card size="small" title="位置">
            <div class="box-panner">
              <n-tree
                block-line
                :data="positionTree"
                expand-on-click
                :default-expand-all="true"
                :node-props="handleSelectPosition"
              />
            </div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="9">
          <n-card size="small" title="设备">
            <div class="box-panner">
              <n-table :bordered="false" :single-line="false">
                <tbody>
                  <tr
                    v-for="item in deviceList"
                    :key="item.deviceId"
                    @click="handleSelectDevice(item)"
                    :class="selectDeviceId === item.deviceId ? 'selectRow' : ''"
                  >
                    <td>{{ item.deviceName }}</td>
                    <td>{{ item.deviceId }}</td>
                    <td>{{ item.spaceRouteName }}</td>
                  </tr>
                </tbody>
              </n-table>
            </div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="9">
          <n-card size="small" title="物模型属性/事件">
            <div class="box-panner">
              <n-table :bordered="false" :single-line="false">
                <tbody>
                  <tr
                    v-for="item in deviceModelList"
                    :key="item.modelId"
                    @click="handleSelectModel(item)"
                  >
                    <td>{{ item.modelName }}</td>
                    <td>{{ item.modelIdentity }}</td>
                    <td>{{ item.modelType === 1 ? '属性' : '事件' }}</td>
                  </tr>
                </tbody>
              </n-table>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </n-modal>
  <!-- <ViewInfo
    :showModel="showViewModal"
    :params="viewParams"
    @close="() => (showViewModal = false)"
  /> -->
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { TreeOption } from 'naive-ui';
  import { Device, DeviceModel } from '@/types/DeviceModel';
  import { getPositionTree } from '@/api/base/position';
  import { getDeviceList, DeviceParams } from '@/api/devices/device';
  import { getDeviceModelList, DeviceModelParams } from '@/api/devices/deviceModel';
  // @ts-ignore
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  // @ts-ignore
  // import ViewInfo from './../general_model/ViewInfo.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    index: {
      type: Number,
      default: () => 0,
    },
  });
  const showModelState = ref(false);

  // 回调
  const emit = defineEmits(['close', 'checked']);
  watch([() => props.showModel, () => props.index], async ([newShowModel, newIndex]) => {
    showModelState.value = newShowModel;
    localIndex.value = newIndex;
    if (newShowModel) {
      positionTree.value = await loadPositionTree();
    }
  });

  const localIndex = ref(0);
  const showViewModal = ref(false);
  const viewParams = ref<any>({});

  const positionTree = ref<any[]>([]);
  const deviceList = ref<any[]>([]);
  const deviceModelList = ref<any[]>([]);
  const selectSpaceId = ref(0);
  const selectDeviceId = ref('');
  const selectDevice = ref<any>({});

  /**
   * 获取模型分组列表
   * @param res 响应数据
   */
  const loadPositionTree = async () => {
    const result = (await getPositionTree()) as unknown as {
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

  const handleSelectPosition = ({ option }: { option: TreeOption }) => {
    return {
      async onClick() {
        if (option.key !== '0') {
          if (!option.hasChildren) {
            const changeId = option.key ? parseInt(option.key.toString(), 10) : 0;
            if (changeId > 0 && changeId !== selectSpaceId.value) {
              selectSpaceId.value = changeId;
              deviceList.value = await loadDeviceList();
            }
          }
        }
      },
    };
  };

  /**
   * 获取设备列表
   * @param res 响应数据
   */
  const loadDeviceList = async () => {
    const params = {
      spaceId: selectSpaceId.value,
    } as DeviceParams;
    const result = (await getDeviceList(params)) as unknown as {
      status: string;
      message: string;
      data: Device[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };

  const handleSelectDevice = async (item: Device) => {
    selectDeviceId.value = item.deviceId;
    selectDevice.value = item;
    deviceModelList.value = await loadDeviceModelList();
  };

  /**
   * 获取设备物模型数据
   * @param res 响应数据
   */
  const loadDeviceModelList = async () => {
    let params = {} as DeviceModelParams;
    params.deviceId = selectDeviceId.value;
    params.neModelClass = 2;

    const result = (await getDeviceModelList(params)) as unknown as {
      status: string;
      message: string;
      data: DeviceModel[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };

  const handleSelectModel = (item: DeviceModel) => {
    let dataType;
    if (
      item.dataType === 'date' ||
      item.dataType === 'bool' ||
      item.dataType === 'array' ||
      item.dataType === 'enum' ||
      item.dataType === 'struct'
    ) {
      dataType = 'text';
    } else {
      dataType = item.dataType;
    }

    const data = {
      modelId: item.modelId,
      modelIdentity: item.modelIdentity,
      modelName: item.modelName,
      deviceId: item.deviceId,
      deviceName: selectDevice.value.deviceName,
      position: selectDevice.value.spaceRouteName,
      dataType: dataType,
      judgement: '=',
    };
    emit('checked', data);
  };

  const closeAfter = () => {
    emit('close');
  };
</script>
<style lang="less" scoped>
  .box-panner {
    width: 100%;
    height: 500px;
    border-top: 4px solid #eee;
    padding-top: 20px;
    overflow-y: auto;
  }
  .selectRow {
    background-color: #f4f4f4;
  }
</style>
