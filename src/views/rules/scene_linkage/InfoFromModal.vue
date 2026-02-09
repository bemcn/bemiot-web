<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 1500px"
    :title="title"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="100"
      class="py-4"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="8" label="场景名称" path="sceneName">
          <n-input
            maxlength="50"
            placeholder="请输入场景名称"
            v-model:value="localParams.sceneName"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="所属分组" path="sceneGroupId">
          <n-select
            v-model:value="localParams.sceneGroupId"
            :options="groupOptions"
            placeholder="请选择分组"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="执行方式" path="executionMethod">
          <n-select
            v-model:value="localParams.executionMethod"
            :options="methodOptions"
            placeholder="请选择执行方式"
            @update:value="handleMethod"
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="循环间隔"
          path="silentPeriod"
          v-if="localParams.executionMethod === '2'"
        >
          <n-input-group>
            <n-input
              maxlength="2"
              placeholder="请输入间隔秒数"
              v-model:value="localParams.silentPeriod"
              clearable
            />
            <n-input-group-label>秒</n-input-group-label>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi
          class="func-box"
          :span="24"
          label="定时设置"
          path="timeConditionsObj"
          v-if="localParams.executionMethod === '3'"
        >
          <div class="frm-rule">
            <div>
              <div class="frm-line">
                <n-radio-group
                  v-model:value="localParams.timeConditionsObj.repeatRules"
                  name="repeatRules"
                >
                  <div class="rule-label">定时方式:</div>
                  <div class="rule-value">
                    <n-space>
                      <n-radio value="day">每日</n-radio>
                      <n-radio value="week">每周</n-radio>
                      <n-radio value="month">每月</n-radio>
                      <n-radio value="year">每年</n-radio>
                    </n-space>
                  </div>
                </n-radio-group>
              </div>
              <div class="frm-line" v-if="localParams.timeConditionsObj.repeatRules === 'year'">
                <div class="rule-label">触发月份:</div>
                <div class="rule-value">
                  <n-checkbox-group v-model:value="localParams.timeConditionsObj.repeatMonths">
                    <n-space item-style="display: flex;">
                      <n-grid x-gap="20" y-gap="10" :cols="15">
                        <n-gi>
                          <n-checkbox :value="1" label="1月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="2" label="2月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="3" label="3月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="4" label="4月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="5" label="5月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="6" label="6月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="7" label="7月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="8" label="8月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="9" label="9月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="10" label="10月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="11" label="11月" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="12" label="12月" />
                        </n-gi>
                      </n-grid>
                    </n-space>
                  </n-checkbox-group>
                </div>
              </div>
              <div
                class="frm-line"
                v-if="
                  localParams.timeConditionsObj.repeatRules === 'year' ||
                  localParams.timeConditionsObj.repeatRules === 'month'
                "
              >
                <div class="rule-label">触发日期:</div>
                <div class="rule-value">
                  <n-checkbox-group v-model:value="localParams.timeConditionsObj.repeatDays">
                    <n-space item-style="display: flex;">
                      <n-grid x-gap="20" y-gap="10" :cols="15">
                        <n-gi>
                          <n-checkbox :value="1" label="1日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="2" label="2日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="3" label="3日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="4" label="4日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="5" label="5日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="6" label="6日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="7" label="7日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="8" label="8日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="9" label="9日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="10" label="10日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="11" label="11日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="12" label="12日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="13" label="13日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="14" label="14日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="15" label="15日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="16" label="16日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="17" label="17日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="18" label="18日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="19" label="19日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="20" label="20日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="21" label="21日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="22" label="22日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="23" label="23日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="24" label="24日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="25" label="25日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="26" label="26日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="27" label="27日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="28" label="28日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="29" label="29日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="30" label="30日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="31" label="31日" />
                        </n-gi>
                      </n-grid>
                    </n-space>
                  </n-checkbox-group>
                </div>
                <div style="clear: both"></div>
              </div>
              <div class="frm-line" v-if="localParams.timeConditionsObj.repeatRules === 'week'">
                <div class="rule-label">触发周几:</div>
                <div class="rule-value">
                  <n-checkbox-group v-model:value="localParams.timeConditionsObj.repeatWeeks">
                    <n-space item-style="display: flex;">
                      <n-grid x-gap="20" y-gap="10" :cols="15">
                        <n-gi>
                          <n-checkbox :value="0" label="周日" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="1" label="周一" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="2" label="周二" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="3" label="周三" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="4" label="周四" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="5" label="周五" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="6" label="周六" />
                        </n-gi>
                      </n-grid>
                    </n-space>
                  </n-checkbox-group>
                </div>
                <div style="clear: both"></div>
              </div>
              <div class="frm-line">
                <div class="rule-label">触发时间:</div>
                <div class="rule-value">
                  <n-checkbox-group v-model:value="localParams.timeConditionsObj.repeatHours">
                    <n-space item-style="display: flex;">
                      <n-grid x-gap="20" y-gap="10" :cols="15">
                        <n-gi>
                          <n-checkbox :value="0" label="0时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="1" label="1时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="2" label="2时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="3" label="3时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="4" label="4时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="5" label="5时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="6" label="6时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="7" label="7时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="8" label="8时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="9" label="9时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="10" label="10时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="11" label="11时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="12" label="12时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="13" label="13时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="14" label="14时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="15" label="15时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="16" label="16时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="17" label="17时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="18" label="18时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="19" label="19时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="20" label="20时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="21" label="21时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="22" label="22时" />
                        </n-gi>
                        <n-gi>
                          <n-checkbox :value="23" label="23时" />
                        </n-gi>
                      </n-grid>
                    </n-space>
                  </n-checkbox-group>
                </div>
                <div style="clear: both"></div>
              </div>
              <div class="frm-line">
                <div class="rule-label"></div>
                <div class="rule-value">
                  <div class="v-value">
                    <n-input
                      maxlength="2"
                      placeholder="请输入分钟"
                      v-model:value="localParams.timeConditionsObj.repeatMinute"
                      clearable
                    />
                  </div>
                  <div class="v-text">（分）</div>
                </div>
                <div style="clear: both"></div>
              </div>
            </div>
          </div>
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="场景规则" path="remark">
          <n-input
            type="textarea"
            placeholder="请输入规则（规则引擎开发中...）"
            :autosize="{
              minRows: 30,
            }"
            clearable
            v-model:value="localParams.remark"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="备注" path="remark">
          <n-input
            type="textarea"
            placeholder="请输入备注"
            :autosize="{
              minRows: 2,
            }"
            clearable
            v-model:value="localParams.remark"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>

  <SelectModelAttr
    :showModel="showAttrModal"
    :index="selectAttrIndex"
    @close="() => (showAttrModal = false)"
    @checked="checkAttrCall"
  />
  <SelectModelOption
    :showModel="showOptionModal"
    :index="selectOptionIndex"
    @close="() => (showOptionModal = false)"
    @checked="checkOptionCall"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addDeviceControls, editDeviceControls } from '@/api/devices/deviceControls';
  // @ts-ignore
  import { PlusOutlined, CloseCircleFilled } from '@vicons/antd';
  // @ts-ignore
  import SelectModelAttr from './SelectModelAttr.vue';
  // @ts-ignore
  import SelectModelOption from './SelectModelOption.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => false,
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
      default: () => ({}),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const fromAction = ref('');
  const localParams: any = ref(null);
  const groupOptions = ref<any[]>([]);
  const methodOptions = [
    {
      label: '触发响应',
      value: '1',
    },
    {
      label: '循环执行',
      value: '2',
    },
    {
      label: '定时执行',
      value: '3',
    },
  ];
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const judgementOptions = [
    {
      label: '等于',
      value: '=',
    },
    {
      label: '不等于',
      value: '!=',
    },
    {
      label: '小于',
      value: '<',
    },
    {
      label: '小于等于',
      value: '<=',
    },
    {
      label: '大于',
      value: '>',
    },
    {
      label: '大于等于',
      value: '>=',
    },
  ];

  const showAttrModal = ref(false);
  const selectAttrIndex = ref(0);
  const showOptionModal = ref(false);
  const selectOptionIndex = ref(0);

  // 表单验证
  const rules: FormRules = {
    sceneName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入场景名称',
      },
      {
        min: 1,
        max: 30,
        message: '场景名称长度在 1 到 50 个字符',
        trigger: ['blur', 'input'],
      },
    ],
    executionMethod: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请选择执行方式',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.options, () => props.params],
    ([newShowModel, newAction, newOptions, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      groupOptions.value = newOptions;
      localParams.value = newParams;

      // 确保 elDataObj 存在且结构正确
      if (!localParams.value.timeConditionsObj) {
        localParams.value.timeConditionsObj = {
          repeatRules: 'day',
          repeatMonths: [],
          repeatDays: [],
          repeatWeeks: [],
          repeatHours: [],
          repeatMinute: '0',
          conditions: [],
        };
        if (!localParams.value.elDataObj) {
          localParams.value.elDataObj = {
            conditions: [],
            options: [],
          };
        }
      }
    }
  );

  // 群控方法切换
  const handleMethod = (value: string) => {
    // if (value === '2') {
    //   localParams.value.silentPeriod = '0';
    //   localParams.value.timeConditionsObj = {};
    // } else if (value === '3') {
    //   localParams.value.silentPeriod = '0';
    //   localParams.value.timeConditionsObj = {
    //     repeatRules: 'day',
    //     repeatMonths: [],
    //     repeatDays: [],
    //     repeatWeeks: [],
    //     repeatHours: [],
    //     repeatMinute: '0',
    //   };
    // } else {
    //   localParams.value.silentPeriod = '0';
    //   localParams.value.timeConditionsObj = {};
    // }
    localParams.value.silentPeriod = '0';
    localParams.value.timeConditionsObj = {
      repeatRules: 'day',
      repeatMonths: [],
      repeatDays: [],
      repeatWeeks: [],
      repeatHours: [],
      repeatMinute: '0',
    };
  };

  // 群控规则---添加条件
  const handleItemAdd = () => {
    const item = {
      modelId: 0,
      modelIdentity: '',
      modelName: '',
      deviceId: 0,
      deviceCode: '',
      deviceName: '',
      position: '',
      dataType: 'int',
      judgement: '=',
      value: '0',
      link: '',
    };
    localParams.value.elDataObj.conditions.push(item);
  };

  // 群控规则---删除条件
  const handleItemDel = (index: number) => {
    localParams.value.elDataObj.conditions.splice(index, 1);
  };

  // 群控规则---添加属性
  const selectAttrModel = (index: number) => {
    selectAttrIndex.value = index;
    showAttrModal.value = true;
  };
  const checkAttrCall = (data: any) => {
    showAttrModal.value = false;
    const i = selectAttrIndex.value;
    localParams.value.elDataObj.conditions[i].modelId = data.modelId;
    localParams.value.elDataObj.conditions[i].modelIdentity = data.modelIdentity;
    localParams.value.elDataObj.conditions[i].modelName = data.modelName;
    localParams.value.elDataObj.conditions[i].deviceId = data.deviceId;
    localParams.value.elDataObj.conditions[i].deviceCode = data.deviceCode;
    localParams.value.elDataObj.conditions[i].deviceName = data.deviceName;
    localParams.value.elDataObj.conditions[i].position = data.position;
    localParams.value.elDataObj.conditions[i].dataType = data.dataType;
    localParams.value.elDataObj.conditions[i].judgement = '=';
  };

  // 群控操作--- 添加功能
  const handleModelAdd = () => {
    const item = {
      modelId: 0,
      modelIdentity: '',
      modelName: '',
      deviceId: 0,
      deviceCode: '',
      deviceName: '',
      position: '',
      dataType: 'int',
      value: '0',
      link: '',
    };
    localParams.value.elDataObj.options.push(item);
    // selectOptionIndex.value = index;
    // showOptionModal.value = true;
  };

  // 群控操作---删除条件
  const handleModelDel = (index: number) => {
    localParams.value.elDataObj.options.splice(index, 1);
  };

  // 群控操作---添加功能
  const selectOptionModel = (index: number) => {
    selectOptionIndex.value = index;
    showOptionModal.value = true;
  };
  const checkOptionCall = (data: any) => {
    showOptionModal.value = false;
    const i = selectOptionIndex.value;
    localParams.value.elDataObj.options[i].modelId = data.modelId;
    localParams.value.elDataObj.options[i].modelIdentity = data.modelIdentity;
    localParams.value.elDataObj.options[i].modelName = data.modelName;
    localParams.value.elDataObj.options[i].deviceId = data.deviceId;
    localParams.value.elDataObj.options[i].deviceCode = data.deviceCode;
    localParams.value.elDataObj.options[i].deviceName = data.deviceName;
    localParams.value.elDataObj.options[i].position = data.position;
    localParams.value.elDataObj.options[i].dataType = data.dataType;
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const elDataObj = localParams.value.elDataObj;
        if (elDataObj) {
          const controlRule = JSON.stringify(elDataObj);
          const params = {
            controlId: localParams.value.controlId,
            sceneName: localParams.value.sceneName,
            controlFunc: localParams.value.controlFunc,
            controlRule: controlRule,
            remark: localParams.value.remark,
          };

          let result: { status: any; message: any };
          if (props.action === 'add') {
            result = (await addDeviceControls(params)) as unknown as {
              status: string;
              message: string;
            };
          } else {
            result = (await editDeviceControls(params)) as unknown as {
              status: string;
              message: string;
            };
          }
          if (result.status === 'success') {
            window['$message'].success('提交成功');
            setTimeout(() => {
              showState.value = false;
              emit('submit');
            });
          } else {
            window['$message'].error(result.message);
          }
        } else {
          window['$message'].error('请填写群控规则');
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>
<style lang="less" scoped>
  .func-box /deep/ .n-form-item .n-form-item-feedback-wrapper {
    display: none;
  }
  .frm-rule {
    width: 100%;
    position: relative;
    .frm-line {
      width: 100%;
      margin-bottom: 15px;
      .rule-label {
        width: 80px;
        height: 34px;
        line-height: 34px;
        color: #999999;
        float: left;
      }
      .rule-value {
        padding-top: 7px;
        margin-left: 80px;
        .v-value {
          width: 100px;
          height: 34px;
          float: left;
        }
        .v-text {
          height: 34px;
          line-height: 34px;
          margin-left: 10px;
          float: left;
        }
        .sub-line {
          width: 100%;
          .item-line {
            width: 100%;
            height: 50px;
            padding: 10px 15px;
            border: 1px solid #dddddd;
            border-radius: 4px;
            margin-top: 10px;
            .item-label {
              height: 28px;
              margin-right: 15px;
              color: #fff;
              float: left;
            }
            .item-if {
              height: 28px;
              line-height: 28px;
              margin: 0px 5px;
              float: left;
            }
            .item-filed {
              height: 28px;
              margin: 0px 5px;
              float: left;
            }
            .item-del {
              height: 28px;
              margin: 0px 5px;
              padding-top: 3px;
              cursor: pointer;
              float: right;
            }
          }
        }
      }
    }
  }
</style>
