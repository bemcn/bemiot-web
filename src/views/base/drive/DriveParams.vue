<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 940px"
    title="驱动参数设置"
  >
    <div class="top-panner">
      <div class="drive-name">{{ localParams.driveName }}</div>
      <div class="drive-code">{{ localParams.driveCode }}</div>
    </div>
    <div class="top-tabs">
      <n-tabs type="line" v-model:value="groupType" @update:value="handleTabChange">
        <n-tab :name="1"> 设备信息参数 </n-tab>
        <n-tab :name="2"> 物模型参数 </n-tab>
      </n-tabs>
    </div>
    <div class="main-panner">
      <div class="left-panner">
        <div class="top-box">参数列表</div>
        <Draggable
          animation="300"
          :list="list"
          group="people"
          itemKey="paramsId"
          style="width: 100%; height: 400px"
          @update="handleDragUpdate"
        >
          <template #item="{ element }">
            <div
              :class="fromParams.paramsId === element.paramsId ? 'param-check-box' : 'param-box'"
            >
              <div class="badge" @click="delParam(element.paramsId)">
                <n-icon size="12" style="display: block; padding-left: 5px; padding-top: 5px">
                  <CloseOutlined />
                </n-icon>
              </div>
              <a href="javascript:;" class="label" @click="editParam(element)">{{
                element.paramsName
              }}</a>
            </div>
          </template>
        </Draggable>
      </div>
      <div class="right-panner">
        <div class="from-top"
          >{{ fromAction === 'add' ? '新增参数' : '编辑参数' }}
          <span style="margin-left: 20px; font-size: 14px; color: #999999"
            >({{ groupType === 1 ? '设备信息参数' : '物模型参数' }})</span
          ></div
        >
        <div>
          <n-form
            :model="fromParams"
            :rules="fromAction === 'add' ? addRules : editRules"
            ref="formRef"
            label-placement="left"
            :label-width="120"
            class="py-4"
          >
            <n-form-item label="参数标识" path="paramsKey">
              <n-input
                maxlength="20"
                placeholder="请输入参数标识"
                v-model:value="fromParams.paramsKey"
                v-if="fromAction === 'add'"
              />
              <n-input
                maxlength="20"
                placeholder="请输入参数标识"
                :value="fromParams.paramsKey"
                :disabled="true"
                v-else
              />
            </n-form-item>
            <n-form-item label="参数名称" path="paramsName">
              <n-input
                maxlength="20"
                placeholder="请输入参数名称"
                v-model:value="fromParams.paramsName"
                clearable
              />
            </n-form-item>
            <n-form-item label="表单类型" path="paramsType">
              <n-select
                v-model:value="fromParams.paramsType"
                :options="inputOptions"
                placeholder="请选择表单类型"
                @update:value="handleSelectType"
              />
            </n-form-item>
            <n-form-item
              v-if="
                fromParams.paramsType === 'text' ||
                fromParams.paramsType === 'int' ||
                fromParams.paramsType === 'number'
              "
              label="默认值"
              path="defaultValue"
            >
              <n-input
                maxlength="20"
                placeholder="请输入默认值"
                v-model:value="fromParams.defaultValue"
                clearable
                v-if="fromParams.paramsType === 'text'"
              />
              <n-input
                maxlength="20"
                placeholder="请输入默认值"
                v-model:value="fromParams.defaultValue"
                clearable
                :allow-input="onlyAllowInt"
                v-if="fromParams.paramsType === 'int'"
              />
              <n-input
                maxlength="20"
                placeholder="请输入默认值"
                v-model:value="fromParams.defaultValue"
                clearable
                :allow-input="onlyAllowNumber"
                v-if="fromParams.paramsType === 'number'"
              />
            </n-form-item>
            <n-form-item
              v-if="
                fromParams.paramsType === 'date' ||
                fromParams.paramsType === 'time' ||
                fromParams.paramsType === 'datetime'
              "
              label="默认值"
              path="defaultValue"
            >
              <n-date-picker
                v-model:value="fromParams.defaultValue"
                type="date"
                value-format="yyyy-MM-dd"
                v-if="fromParams.paramsType === 'date'"
              />
              <n-time-picker
                v-model:value="fromParams.defaultValue"
                value-format="HH:mm:ss"
                v-if="fromParams.paramsType === 'time'"
              />
              <n-date-picker
                v-model:value="fromParams.defaultValue"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-if="fromParams.paramsType === 'datetime'"
              />
            </n-form-item>
            <n-form-item
              label="表单数据"
              v-if="
                fromParams.paramsType === 'select' ||
                fromParams.paramsType === 'radio' ||
                fromParams.paramsType === 'check'
              "
            >
              <div class="item-line">
                <div class="item-add">
                  <n-button
                    size="small"
                    style="color: #666666; font-size: 13px"
                    @click="addDataItem"
                  >
                    <template #icon>
                      <n-icon size="14" color="#999999">
                        <PlusOutlined />
                      </n-icon>
                    </template>
                    增加一项
                  </n-button>
                </div>
                <div class="item-box">
                  <div v-for="(item, index) in fromShowData" :key="index" class="line-item">
                    <div class="label-item">标签</div>
                    <div class="value-item1">
                      <n-input
                        maxlength="20"
                        size="small"
                        placeholder="请输入标签"
                        clearable
                        v-model:value="item.label"
                      />
                    </div>
                    <div class="label-item">值</div>
                    <div class="value-item2">
                      <n-input
                        maxlength="20"
                        size="small"
                        placeholder="请输入值"
                        clearable
                        v-model:value="item.value"
                      />
                    </div>
                    <div class="check-item" @click="checkDataItem(index)">
                      <span v-if="!item.check" style="color: #999999">设为默认选中</span>
                      <span v-if="item.check" style="color: #4492eb">取消选中</span>
                    </div>
                    <div class="del-item" v-if="index > 0" @click="delDataItem(index)">
                      <n-icon size="16" color="#666666">
                        <CloseCircleFilled />
                      </n-icon>
                    </div>
                  </div>
                </div>
              </div>
            </n-form-item>
          </n-form>
        </div>
        <div class="from-bottom">
          <n-button
            type="info"
            :loading="formBtnLoading"
            style="width: 100px; margin-right: 20px"
            @click="confirmForm"
            >确 认</n-button
          >
          <n-button style="width: 100px" @click="clearFrom">取 消</n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import {
    getDriveParamsList,
    addDriveParams,
    editDriveParams,
    updateDriveParamsOrder,
    delDriveParamsById,
  } from '@/api/base/driveParams';
  import { DriveParams } from '@/types/BaseModel';
  import { PlusOutlined, CloseOutlined, CloseCircleFilled } from '@vicons/antd';
  import Draggable from 'vuedraggable';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    title: {
      type: String,
      default: () => '',
    },
    action: {
      type: String,
      default: () => '',
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        driveCode: '',
        driveName: '',
      }),
    },
  });

  const showState = ref(false);
  const fromAction = ref('add');
  const localParams: any = ref(null);
  const groupType = ref(1);
  const list = ref<DriveParams[]>([]);
  const fromParams: any = ref({
    paramsId: 0,
    paramsKey: '',
    driveCode: '',
    paramsName: '',
    paramsType: 'text',
    defaultValue: '',
    showData: '',
  });
  const fromShowData = ref([
    {
      label: '',
      value: '',
      check: false,
    },
  ]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const inputOptions = [
    { label: '文本框', value: 'text' },
    { label: '整数框', value: 'int' },
    { label: '数字框', value: 'number' },
    { label: '下拉框', value: 'select' },
    { label: '单选框', value: 'radio' },
    { label: '多选框', value: 'check' },
    { label: '日期选择', value: 'date' },
    { label: '时间选择', value: 'time' },
    { label: '日期时间', value: 'datetime' },
  ];

  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);
  const onlyAllowNumber = (value: string) => !value || /^\d*\.?\d*$/.test(value);

  // 表单验证
  const addRules: FormRules = {
    paramsKey: {
      required: true,
      trigger: 'input',
      message: '请输入参数标识',
    },
    paramsName: {
      required: true,
      trigger: 'input',
      message: '请输入参数名称',
    },
  };
  const editRules: FormRules = {
    paramsName: {
      required: true,
      trigger: 'input',
      message: '请输入参数名称',
    },
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
    loadDataList();
  });

  // 加载数据列表
  const loadDataList = async () => {
    const params = {
      driveCode: localParams.value.driveCode,
      type: groupType.value,
    };
    const result = (await getDriveParamsList(params)) as unknown as {
      status: string;
      message: string;
      data: DriveParams[];
    };
    if (result.status === 'success') {
      list.value = result.data;
    }
  };

  // 切换TAB
  const handleTabChange = () => {
    clearFrom();
    loadDataList();
  };

  // 单击编辑参数
  const editParam = (item: any) => {
    console.log('edit:', item);
    const paramsType = item.paramsType;
    if (paramsType === 'select' || paramsType === 'radio' || paramsType === 'check') {
      fromShowData.value = JSON.parse(item.showData);
    }
    fromParams.value = {
      paramsId: item.paramsId,
      paramsKey: item.paramsKey,
      driveCode: item.driveCode,
      paramsName: item.paramsName,
      paramsType: paramsType,
      defaultValue: item.defaultValue,
      showData: item.showData,
    };
    fromAction.value = 'edit';
  };

  // 单击删除参数
  const delParam = async (id: number) => {
    const params = {
      id,
    };

    try {
      const result = (await delDriveParamsById(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        window['$message'].success('删除成功');
        clearFrom();
        loadDataList();
      } else {
        window['$message'].error(result.message);
      }
    } catch (error) {
      window['$message'].error('删除失败');
    }
  };

  // 拖拽排序
  const handleDragUpdate = async (event: any) => {
    const { newIndex, oldIndex } = event;
    const params = {
      id: list.value[newIndex].paramsId,
      orderNum: list.value[oldIndex].orderNum,
    };

    try {
      const result = (await updateDriveParamsOrder(params)) as unknown as {
        status: string;
        message: string;
      };

      if (result.status === 'success') {
        clearFrom();
        loadDataList();
      }
    } catch (error) {
      window['$message'].error('更新操作失败');
      clearFrom();
      loadDataList();
    }
  };

  //下拉框选择事件
  const handleSelectType = () => {
    fromParams.value.defaultValue = '';
    fromParams.value.showData = [];
  };

  // 增加参数表单项
  const addDataItem = () => {
    fromShowData.value.push({
      label: '',
      value: '',
      check: false,
    });
  };
  // 设为选中操作
  const checkDataItem = (index: number) => {
    const checkVal = !fromShowData.value[index].check;
    if (fromParams.value.paramsType === 'check') {
      fromShowData.value[index].check = checkVal;
    } else {
      const showDataArray = fromShowData.value;
      for (let i = 0; i < showDataArray.length; i++) {
        if (i === index) {
          showDataArray[i].check = checkVal;
        } else {
          showDataArray[i].check = false;
        }
      }
      fromShowData.value = showDataArray;
    }
  };

  // 删除选中操作
  const delDataItem = (index: number) => {
    const showDataArray = fromShowData.value;
    showDataArray.splice(index, 1);
    fromShowData.value = showDataArray;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const paramsType = fromParams.value.paramsType;
        let showData = '';
        if (paramsType === 'select' || paramsType === 'radio' || paramsType === 'check') {
          const showDataArray = fromShowData.value;
          if (showDataArray.length > 0) {
            let dtaArray: any[] = [];
            for (let i = 0; i < showDataArray.length; i++) {
              if (showDataArray[i].label !== '') {
                dtaArray.push(showDataArray[i]);
              }
            }
            if (dtaArray.length > 0) {
              showData = JSON.stringify(dtaArray);
            }
          }
        }
        fromParams.value.showData = showData;
        fromParams.value.driveCode = localParams.value.driveCode;
        fromParams.value.groupType = groupType.value;

        let result: { status: any; message: any };
        if (fromAction.value === 'add') {
          result = (await addDriveParams(fromParams.value)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editDriveParams(fromParams.value)) as unknown as {
            status: string;
            message: string;
          };
        }
        if (result.status === 'success') {
          window['$message'].success('提交成功');
          // 刷新列表
          loadDataList();
          // 初始化表单
          clearFrom();
        } else {
          window['$message'].error(result.message);
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };

  const clearFrom = () => {
    fromParams.value = {
      paramsId: 0,
      paramsKey: '',
      driveCode: '',
      paramsName: '',
      paramsType: 'text',
      defaultValue: '',
      showData: '',
    };
    fromShowData.value = [
      {
        label: '',
        value: '',
        check: false,
      },
    ];
    fromAction.value = 'add';
  };
</script>
<style lang="less" scoped>
  .top-panner {
    width: 100%;
    height: 50px;
    padding: 15px;
    background-color: #dbebfd;
    border: 1px solid #c6defa;
    margin-bottom: 10px;
    .drive-name {
      height: 20px;
      line-height: 20px;
      font-size: 17px;
      color: #4492eb;
      float: left;
    }
    .drive-code {
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      font-style: italic;
      color: #a0bbdd;
      float: right;
    }
  }
  .top-tabs {
    width: 100%;
    margin-bottom: 15px;
  }
  .main-panner {
    width: 100%;
    height: 540px;
    .left-panner {
      width: 200px;
      height: 540px;
      padding: 0px 20px;
      border: 1px solid #eeeeee;
      overflow-y: auto;
      float: left;
      .top-box {
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        margin-top: 10px;
        margin-bottom: 15px;
      }
      .param-box {
        width: 100%;
        height: 36px;
        line-height: 36px;
        border: 1px solid #eeeeee;
        background-color: #f4f4f4;
        border-radius: 4px;
        margin-top: 15px;
        margin-bottom: 15px;
        text-align: center;
        cursor: pointer;
        position: relative;
      }
      .param-check-box {
        width: 100%;
        height: 36px;
        border: 1px solid #4492eb;
        background-color: #dbebfd;
        padding: 5px 10px;
        border-radius: 4px;
        margin-top: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        position: relative;
      }
      .param-box .badge,
      .param-check-box .badge {
        position: absolute;
        width: 24px;
        height: 24px;
        text-align: center;
        background-color: #ffffff;
        border-radius: 50%;
        cursor: pointer;
        top: -8px;
        right: -8px;
        z-index: 10;
      }
      .param-box .badge {
        border: 1px solid #cccccc;
      }
      .param-check-box .badge {
        border: 1px solid #4492eb;
      }
      .param-box .label,
      .param-check-box .label {
        width: 100%;
        height: 26px;
        display: inline-block;
        line-height: 26px;
        text-align: center;
      }
      .param-box .label {
        color: #666666;
      }
      .param-check-box .label {
        color: #4492eb;
      }
    }
    .right-panner {
      height: 540px;
      padding: 10px;
      border: 1px solid #eeeeee;
      margin-left: 215px;
    }
  }
  .from-top {
    width: 100%;
    height: 36px;
    line-height: 36px;
    padding-left: 15px;
    font-size: 16px;
  }
  .item-line {
    width: 100%;
    .item-add {
      width: 100%;
      height: 28px;
      margin-bottom: 10px;
    }
    .item-box {
      width: 100%;
      height: 175px;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      padding: 15px 20px;
      overflow-y: auto;
      .line-item {
        width: 100%;
        height: 36px;
        .label-item {
          width: 40px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          text-align: right;
          padding-right: 10px;
          float: left;
        }
        .value-item1 {
          width: 130px;
          height: 28px;
          float: left;
        }
        .value-item2 {
          width: 130px;
          height: 28px;
          float: left;
        }
        .check-item {
          width: 90px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          text-align: left;
          padding-left: 10px;
          cursor: pointer;
          float: left;
        }
        .del-item {
          width: 28px;
          height: 28px;
          padding-top: 5px;
          text-align: right;
          cursor: pointer;
          float: left;
        }
      }
    }
  }
  .from-bottom {
    text-align: right;
  }
</style>
