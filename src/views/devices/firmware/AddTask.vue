<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showTaskState"
    :show-icon="false"
    preset="dialog"
    style="width: 840px"
    :title="'新增任务'"
    @after-leave="closeTaskAfter"
  >
    <n-form
      :model="taskParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="任务名称" path="taskName">
        <n-input
          maxlength="20"
          placeholder="请输入任务名称"
          v-model:value="taskParams.taskName"
          clearable
        />
      </n-form-item>
      <n-form-item label="升级范围" path="taskType">
        <n-select
          v-model:value="taskParams.taskType"
          :options="taskTypeOptions"
          placeholder="请选择升级范围"
        />
      </n-form-item>
      <n-form-item label="选中设备" path="devices" v-if="taskParams.taskType === '2'">
        <n-row>
          <n-col :span="24" style="padding-bottom: 15px">
            <n-button type="primary" style="width: 100px">选择设备</n-button>
          </n-col>
          <n-col :span="24" v-if="getDevicesLength() > 0">
            <n-table :bordered="false" :single-line="false" size="small">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>编号</th>
                  <th>设备名称</th>
                  <th>删除</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in taskParams.deviceArray" :key="index">
                  <td>{{ item.deviceId }}</td>
                  <td>{{ item.deviceId }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>
                    <n-button quaternary type="info" @click="deleteDevice(Number(index))"
                      >删除</n-button
                    >
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-col>
        </n-row>
      </n-form-item>
      <n-form-item label="预定升级时间" path="planTime">
        <n-date-picker
          v-model:value="taskParams.planTime"
          type="date"
          value-format="yyyy-MM-dd"
          :is-date-disabled="disabledDate"
          style="margin-right: 10px"
          clearable
        />
        <n-time-picker
          v-model:value="taskParams.planTime"
          :is-hour-disabled="disabledHour"
          clearable
        />
      </n-form-item>

      <n-form-item label="升级描述" path="remark">
        <n-input
          type="textarea"
          placeholder="请输入升级描述"
          :autosize="{
            minRows: 3,
          }"
          clearable
          v-model:value="taskParams.remark"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showTaskState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { FormItemRule, FormRules } from 'naive-ui';
  import { addFirmwareUpdateTask } from '@/api/devices/firmwareUpdateTask';

  const props = defineProps({
    showTaskModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        firmwareId: 0,
        taskName: '',
        version: '',
        installType: '1',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['taskClose', 'taskSubmit']);

  const showTaskState = ref(false);
  const taskParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const taskTypeOptions = [
    {
      label: '全部设备',
      value: '1',
    },
    {
      label: '指定设备',
      value: '2',
    },
  ];

  //时间选择限制
  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current < today;
  };
  const disabledHour = (hour: number) => {
    const currentDate = taskParams.value?.planTime
      ? new Date(taskParams.value.planTime).toDateString()
      : new Date().toDateString();
    const today = new Date().toDateString();
    if (currentDate === today) {
      const currentHour = new Date().getHours() + 1;
      return currentHour > hour;
    }
    return false;
  };

  // 表单验证
  const rules: FormRules = {
    taskName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入任务名称',
    },
    taskType: {
      required: true,
      message: '请选择升级范围',
      trigger: ['blur', 'change'],
    },
  };

  const closeTaskAfter = () => {
    emit('taskClose');
  };

  watch([() => props.showTaskModel, () => props.params], ([newShowModel, newParams]) => {
    showTaskState.value = newShowModel;
    taskParams.value = newParams;
  });

  // 删除所选设备
  const getDevicesLength = () => {
    return taskParams.value?.deviceArray?.length || 0;
  };
  const deleteDevice = (index: number) => {
    taskParams.value.deviceArray.splice(index, 1);
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const result = (await addFirmwareUpdateTask(taskParams.value)) as unknown as {
          status: string;
          message: string;
        };
        if (result.status === 'success') {
          window['$message'].success('提交成功');
          setTimeout(() => {
            showTaskState.value = false;
            emit('taskSubmit');
          });
        } else {
          window['$message'].error(result.message);
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>
<style lang="less" scoped>
  .upload-line {
    width: 100%;
    .upload-btn {
      width: 100px;
      float: right;
    }
    .upload-input {
      margin-right: 110px;
    }
  }
</style>
