<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 1000px"
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
        <n-form-item-gi :span="12" label="群控名称" path="controlName">
          <n-input
            maxlength="30"
            placeholder="请输入群控名称"
            v-model:value="localParams.controlName"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="群控方法" path="controlFunc">
          <n-input-group>
            <n-select
              v-model:value="localParams.controlFunc"
              :style="{ width: '50%' }"
              :options="funcOptions"
              placeholder="请选择群控方法"
            />
            <n-input
              maxlength="2"
              placeholder="请输入延迟秒数"
              v-model:value="localParams.delaySecond"
              clearable
              :disabled="localParams.controlFunc === 'immediately'"
            />
            <n-input-group-label>秒</n-input-group-label>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi class="func-box" :span="24" label="群控规则" path="controlRuleData">
          <div class="frm-rule">
            <div>
              <div class="frm-line">
                <div class="rule-value">
                  <div class="sub-line" style="height: 44px">
                    <n-button @click="handleModelAdd">
                      <template #icon>
                        <n-icon>
                          <PlusOutlined />
                        </n-icon>
                      </template>
                      添加功能模型
                    </n-button>
                  </div>
                  <div class="sub-line">
                    <div
                      class="item-line"
                      v-for="(item, index) in localParams.controlRuleData"
                      :key="index"
                    >
                      <div class="item-label">
                        <n-tag
                          :color="{ color: '#13467f', textColor: '#fff', borderColor: '#13467f' }"
                        >
                          执行{{ Number(index) + 1 }}
                        </n-tag>
                      </div>
                      <div class="item-filed">
                        <n-button
                          size="small"
                          ghost
                          style="min-width: 320px; color: #666"
                          @click="selectOptionModel(Number(index))"
                        >
                          {{
                            item.modelId === 0
                              ? '选择物模型功能'
                              : item.position + '.' + item.deviceName + '.' + item.modelName
                          }}
                        </n-button>
                      </div>
                      <div class="item-if">执行值：</div>
                      <div class="item-filed" style="width: 120px">
                        <n-input
                          type="text"
                          size="small"
                          placeholder="执行值"
                          v-model:value="item.value"
                        />
                      </div>
                      <div class="item-del" v-if="Number(index) > 0">
                        <n-icon size="22" title="删除" @click="handleModelDel(Number(index))">
                          <CloseCircleFilled />
                        </n-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  const funcOptions = [
    {
      label: '立即执行',
      value: 'immediately',
    },
    {
      label: '延迟执行',
      value: 'delay',
    },
  ];
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  const showAttrModal = ref(false);
  const selectAttrIndex = ref(0);
  const showOptionModal = ref(false);
  const selectOptionIndex = ref(0);

  // 表单验证
  const rules: FormRules = {
    controlName: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入群控名称',
      },
      {
        min: 1,
        max: 30,
        message: '群控名称长度在 1 到 30 个字符',
        trigger: ['blur', 'input'],
      },
    ],
    controlFunc: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请选择群控方法',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.params],
    ([newShowModel, newAction, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;

      // 确保 controlRuleData 是一个有效的数组
      if (newParams && newParams.controlRuleData) {
        localParams.value = {
          ...newParams,
          controlRuleData: Array.isArray(newParams.controlRuleData)
            ? newParams.controlRuleData.map((item) => ({ ...item }))
            : [],
        };
        console.log('localParams.controlRuleData:', localParams.value.controlRuleData);
      } else {
        localParams.value = newParams;
      }
    }
  );

  // 群控规则---添加条件
  const handleItemAdd = () => {
    const item = {
      modelId: 0,
      modelIdentity: '',
      modelName: '',
      deviceId: '',
      deviceName: '',
      position: '',
      dataType: 'int',
      judgement: '=',
      value: '0',
      link: '',
    };
    localParams.value.controlRuleData.push(item);
  };

  // 群控规则---删除条件
  const handleItemDel = (index: number) => {
    localParams.value.controlRuleData.splice(index, 1);
  };

  // 群控规则---添加属性
  const selectAttrModel = (index: number) => {
    selectAttrIndex.value = index;
    showAttrModal.value = true;
  };
  const checkAttrCall = (data: any) => {
    showAttrModal.value = false;
    const i = selectAttrIndex.value;
    localParams.value.controlRuleData[i].modelId = data.modelId;
    localParams.value.controlRuleData[i].modelIdentity = data.modelIdentity;
    localParams.value.controlRuleData[i].modelName = data.modelName;
    localParams.value.controlRuleData[i].deviceId = data.deviceId;
    localParams.value.controlRuleData[i].deviceName = data.deviceName;
    localParams.value.controlRuleData[i].position = data.position;
    localParams.value.controlRuleData[i].dataType = data.dataType;
    localParams.value.controlRuleData[i].judgement = '=';
  };

  // 群控操作--- 添加功能
  const handleModelAdd = () => {
    const item = {
      modelId: 0,
      modelIdentity: '',
      modelName: '',
      deviceId: 0,
      deviceName: '',
      position: '',
      dataType: 'int',
      value: '0',
    };
    localParams.value.controlRuleData.push(item);
  };

  // 群控操作---删除条件
  const handleModelDel = (index: number) => {
    localParams.value.controlRuleData.splice(index, 1);
  };

  // 群控操作---选择物模型
  const selectOptionModel = (index: number) => {
    selectOptionIndex.value = index;
    showOptionModal.value = true;
  };
  const checkOptionCall = (data: any) => {
    showOptionModal.value = false;
    const i = selectOptionIndex.value;
    if (localParams.value.controlRuleData[i]) {
      localParams.value.controlRuleData[i].modelId = data.modelId;
      localParams.value.controlRuleData[i].modelIdentity = data.modelIdentity;
      localParams.value.controlRuleData[i].modelName = data.modelName;
      localParams.value.controlRuleData[i].deviceId = data.deviceId;
      localParams.value.controlRuleData[i].deviceName = data.deviceName;
      localParams.value.controlRuleData[i].position = data.position;
      localParams.value.controlRuleData[i].dataType = data.dataType;
    }
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const controlRuleData = localParams.value.controlRuleData;
        if (controlRuleData) {
          const controlRule = JSON.stringify(controlRuleData);
          const params = {
            controlId: localParams.value.controlId,
            controlName: localParams.value.controlName,
            controlFunc: localParams.value.controlFunc,
            delaySecond: localParams.value.delaySecond,
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
  .func-box :deep(.n-form-item .n-form-item-feedback-wrapper) {
    display: none;
  }
  .frm-rule {
    width: 100%;
    position: relative;
    .frm-line {
      width: 100%;
      margin-bottom: 15px;
      .rule-value {
        width: 100%;
        padding-top: 7px;
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
