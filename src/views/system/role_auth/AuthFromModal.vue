<template>
  <!-- 权限配置 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 960px"
    title="权限配置"
    @after-leave="closeModalAfter"
  >
    <n-form label-placement="left" :label-width="120" class="py-4">
      <n-form-item label="角色名称">
        <n-input :value="roleName" :readonly="true" />
      </n-form-item>
      <n-form-item label="权限配置">
        <div class="auth-pannel">
          <n-collapse :default-expanded-names="['1']">
            <n-collapse-item title="设备物联" name="1" class="auth-box">
              <div v-for="(role, index) in roleParams.deviceRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 1 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 1,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="规则联动" name="2" class="auth-box">
              <div v-for="(role, index) in roleParams.sceneRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 2 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 2,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="视频中心" name="3" class="auth-box">
              <div v-for="(role, index) in roleParams.videoRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 3 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 3,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="数据中心" name="4" class="auth-box">
              <div v-for="(role, index) in roleParams.analysisRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 4 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 4,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="资产管理" name="5" class="auth-box">
              <div v-for="(role, index) in roleParams.assetRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 5 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 5,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="告警中心" name="6" class="auth-box">
              <div v-for="(role, index) in roleParams.alarmRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 6 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 6,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="监控中心" name="7" class="auth-box">
              <div v-for="(role, index) in roleParams.monitorRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 7 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 7,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="基础数据" name="8" class="auth-box">
              <div v-for="(role, index) in roleParams.baseARole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 8 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 8,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>

            <n-collapse-item title="系统管理" name="9" class="auth-box">
              <div v-for="(role, index) in roleParams.sysRole" :key="index" class="auth-line">
                <div class="main-box"
                  ><n-checkbox
                    size="large"
                    :label="role.label"
                    :value="role.value"
                    :checked="role.check"
                    @update:checked="
                      checkItem(!role.check, { key: role.value, index: index, group: 9 })
                    "
                /></div>
                <div class="sub-box">
                  <n-checkbox
                    v-for="(item, n) in role.auths"
                    style="margin-left: 10px"
                    :key="n"
                    :label="item.label"
                    :value="item.key"
                    :checked="item.check"
                    :disabled="!role.check"
                    @update:checked="
                      checkSubItem(!item.check, {
                        key: role.value,
                        index: index,
                        group: 9,
                        subIndex: n,
                      })
                    "
                  />
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { editRoleAuth } from '@/api/system/role';

  interface AuthDataItem {
    label: any;
    value: any;
    auths?: { [key: string]: boolean };
  }

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        roleId: 0,
        roleName: '',
        roleAuth: [],
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const id = ref(0);
  const roleName = ref('');
  const paramsData: any = ref(null);
  const roleParams: any = ref(null);
  const formBtnLoading = ref(false);

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    paramsData.value = newParams;
    id.value = paramsData.value.roleId;
    roleName.value = paramsData.value.roleName;
    roleParams.value = paramsData.value.roleAuth;
  });

  const checkItem = (value: any, e: any) => {
    const index = e.index;
    let auths: any[] = [];
    switch (e.group) {
      case 1:
        auths = roleParams.value.deviceRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.deviceRole = auths;
        break;
      case 2:
        auths = roleParams.value.sceneRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.sceneRole = auths;
        break;
      case 3:
        auths = roleParams.value.videoRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.videoRole = auths;
        break;
      case 4:
        auths = roleParams.value.analysisRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.analysisRole = auths;
        break;
      case 5:
        auths = roleParams.value.assetRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.assetRole = auths;
        break;
      case 6:
        auths = roleParams.value.alarmRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.alarmRole = auths;
        break;
      case 7:
        auths = roleParams.value.monitorRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.monitorRole = auths;
        break;
      case 8:
        auths = roleParams.value.baseARole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.baseARole = auths;
        break;
      default:
        auths = roleParams.value.sysRole;
        if (auths && auths[index]) {
          auths[index] = optionSubCheck(auths[index], value);
        }
        roleParams.value.sysRole = auths;
        break;
    }
  };
  const optionSubCheck = (authData: any, isCheck: boolean) => {
    authData.check = isCheck;
    const subAuthArray = authData.auths;
    if (subAuthArray.length > 0) {
      for (let i = 0; i < subAuthArray.length; i++) {
        subAuthArray[i].check = isCheck;
      }
      authData.auths = subAuthArray;
    }
    return authData;
  };

  const checkSubItem = (value: any, e: any) => {
    if (showState.value) {
      const index = e.index;
      const subIndex = e.subIndex;
      let auths: any[] = [];
      switch (e.group) {
        case 1:
          auths = roleParams.value.deviceRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.deviceRole = auths;
          break;
        case 2:
          auths = roleParams.value.sceneRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.sceneRole = auths;
          break;
        case 3:
          auths = roleParams.value.videoRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.videoRole = auths;
          break;
        case 4:
          auths = roleParams.value.analysisRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.analysisRole = auths;
          break;
        case 5:
          auths = roleParams.value.assetRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.assetRole = auths;
          break;
        case 6:
          auths = roleParams.value.alarmRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.alarmRole = auths;
          break;
        case 7:
          auths = roleParams.value.monitorRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.monitorRole = auths;
          break;
        case 8:
          auths = roleParams.value.baseARole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.baseARole = auths;
          break;
        default:
          auths = roleParams.value.sysRole;
          if (auths && auths[index]) {
            auths[index] = optionSubOneCheck(auths[index], subIndex, value);
          }
          roleParams.value.sysRole = auths;
          break;
      }
    }
  };
  const optionSubOneCheck = (authData: any, subIndex: number, isCheck: boolean) => {
    if (authData.auths.length > 0) {
      authData.auths[subIndex].check = isCheck;
    }
    return authData;
  };

  // 提交表单
  const confirmForm = async (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    let roleParamArray: any[] = [];
    roleParams.value.deviceRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.sceneRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.videoRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.analysisRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.assetRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.alarmRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.monitorRole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.baseARole.forEach((item) => {
      roleParamArray.push(item);
    });
    roleParams.value.sysRole.forEach((item) => {
      roleParamArray.push(item);
    });

    const fromData: AuthDataItem[] = [];

    for (let i = 0; i < roleParamArray.length; i++) {
      const item = roleParamArray[i];
      if (item.check) {
        const auths = roleParamArray[i].auths;
        let dataItem: { label: any; value: any; auths?: {} };
        if (auths.length > 0) {
          let authData = {};
          for (let j = 0; j < auths.length; j++) {
            const authItem = auths[j];
            authData[authItem.key] = authItem.check;
          }
          dataItem = {
            label: item.label,
            value: item.value,
            auths: authData,
          };
        } else {
          dataItem = {
            label: item.label,
            value: item.value,
          };
        }
        fromData.push(dataItem);
      }
    }
    const authJson = JSON.stringify(fromData);
    const params = {
      id: id.value,
      roleAuth: authJson,
    };

    const result = (await editRoleAuth(params)) as unknown as {
      status: string;
      message: string;
    };
    if (result.status === 'success') {
      window['$message'].success('提交成功');
      setTimeout(() => {
        showState.value = false;
        emit('submit');
      });
    } else {
      window['$message'].error(result.message);
    }
    formBtnLoading.value = false;
  };
</script>
<style lang="less" scoped>
  .auth-pannel {
    width: 100%;
    height: 420px;
    overflow-y: auto;
    :deep(.n-collapse .n-collapse-item .n-collapse-item__header) {
      padding: 0;
    }
    .auth-box {
      width: 100%;
      overflow-y: auto;
      padding: 10px 15px;
      border: 1px solid #eeeeee;
      border-radius: 6px;
    }
    .auth-line {
      width: 100%;
      height: 42px;
      padding-left: 20px;
      .main-box {
        width: 150px;
        height: 42px;
        line-height: 42px;
        float: left;
      }
      .sub-box {
        height: 42px;
        margin-left: 150px;
        line-height: 42px;
        .sub-item {
          height: 42px;
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
  }
</style>
