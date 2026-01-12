<template>
  <div class="view-account">
    <div class="view-account-leftbox"></div>
    <div class="view-account-container">
      <div class="view-account-frombox">
        <div class="view-account-top">
          <div class="view-account-top-logo">
            <img :src="websiteConfig.loginImage" alt="" />
          </div>
        </div>
        <div class="view-account-form">
          <h2 class="view-account-title">管理人员登录</h2>
          <div class="login-welcome">欢迎回来，请使用您的账号和密码登录</div>
          <n-form
            ref="formRef"
            label-placement="left"
            size="large"
            :model="formInline"
            :rules="rules"
            class="login-form"
          >
            <n-form-item path="userName" class="username-item">
              <n-input
                v-model:value="formInline.userName"
                placeholder="请输入用户名"
                class="login-input"
              >
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <PersonOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="userPwd" class="password-item">
              <n-input
                v-model:value="formInline.userPwd"
                type="password"
                showPasswordOn="click"
                placeholder="请输入密码"
                class="login-input"
              >
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-button
                size="large"
                :loading="loading"
                tertiary
                block
                class="login-button"
                @click="handleSubmit"
              >
                登录
              </n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>
      <div class="copyright">
        copyright © {{ nowYear }} Fujian BEM Bigdata Technology Co.,Ltd. All rights reserved.
      </div>
    </div>
  </div>
  <n-modal v-model:show="isShow">
    <n-card
      style="width: 390px"
      title="请完成安全验证"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      :style="modalOrigin"
    >
      <template #header-extra>
        <a href="javascript:" class="forgot-link" @click="onVCodeClose"
          ><n-icon :component="CloseOutline" size="20" :depth="2"
        /></a>
      </template>
      <div class="box_vcode">
        <Vcode
          type="inside"
          :show="isShow"
          :imgs="imgs"
          @success="onVCodeSuccess"
          @close="onVCodeClose"
        />
      </div>
      <template #footer></template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { storage } from '@/utils/Storage';
  import { useMessage } from 'naive-ui';
  import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types';
  import { PageEnum } from '@/enums/pageEnum';
  import { websiteConfig } from '@/config/website.config';
  import Vcode from 'vue3-puzzle-vcode';
  // @ts-ignore
  import { PersonOutline, LockClosedOutline, CloseOutline } from '@vicons/ionicons5';
  // @ts-ignore
  import WebRtc from './WebRtc.vue';
  // @ts-ignore
  import JessibucaPlayer from './JessibucaPlayer.vue';

  interface FormState {
    userName: string;
    userPwd: string;
    code: string;
  }

  //vCode 参数
  const isShow = ref(false);
  const imgs = ref([
    '/src/assets/images/codebg/bg01.jpg',
    '/src/assets/images/codebg/bg02.jpg',
    '/src/assets/images/codebg/bg03.jpg',
    '/src/assets/images/codebg/bg04.jpg',
    '/src/assets/images/codebg/bg05.jpg',
    '/src/assets/images/codebg/bg06.jpg',
    '/src/assets/images/codebg/bg07.jpg',
    '/src/assets/images/codebg/bg08.jpg',
    '/src/assets/images/codebg/bg09.jpg',
    '/src/assets/images/codebg/bg10.jpg',
    '/src/assets/images/codebg/bg11.jpg',
    '/src/assets/images/codebg/bg12.jpg',
    '/src/assets/images/codebg/bg13.jpg',
    '/src/assets/images/codebg/bg14.jpg',
    '/src/assets/images/codebg/bg15.jpg',
    '/src/assets/images/codebg/bg16.jpg',
  ]);

  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;
  const nowYear = new Date().getFullYear();
  const modalOrigin = ref('');

  const formInline = reactive({
    userName: 'admin',
    userPwd: 'admin',
    code: '',
    isCaptcha: true,
  });

  const rules = {
    userName: { required: true, message: '请输入账号', trigger: 'blur' },
    userPwd: { required: true, message: '请输入密码', trigger: 'blur' },
  };

  const userStore = useUserStore();

  const router = useRouter();
  const route = useRoute();

  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.value.validate((errors: any) => {
      if (!errors) {
        //判断页面宽度小于1200px时获取 .view-account-form 元素的坐标
        if (window.innerWidth > 1200) {
          const accountFormElement = document.querySelector('.view-account-form') as HTMLElement;
          if (accountFormElement) {
            const rect = accountFormElement.getBoundingClientRect();
            const x = rect.x;
            const y = window.innerHeight / 2 - 175;
            modalOrigin.value = 'position: fixed; top: ' + y + 'px; left: ' + x + 'px;';
          } else {
            modalOrigin.value = '';
          }
        } else {
          modalOrigin.value = '';
        }
        isShow.value = true;
      } else {
        message.error('请填写完整信息，并且进行验证码校验');
      }
    });
  };

  // 验证码事件
  const onVCodeClose = () => {
    isShow.value = false;
  };

  const onVCodeSuccess = async () => {
    onVCodeClose(); // 验证成功，手动关闭模态框

    const { userName, userPwd } = formInline;
    message.loading('登录中...');
    loading.value = true;

    try {
      const resultCode = await userStore.getCode();
      if (resultCode.status === 'success') {
        const code = resultCode.data;
        const params: FormState = {
          userName,
          userPwd,
          code,
        };

        const result = await userStore.login(params);
        const status = result.status;
        message.destroyAll();
        if (status == 'success') {
          const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          message.success('登录成功，即将进入系统');
          if (route.name === LOGIN_NAME) {
            router.replace('/');
          } else {
            router.replace(toPath);
          }
        } else {
          message.info(result.message || '登录失败');
        }
      } else {
        message.info(resultCode.message || '登录失败');
      }
    } finally {
      loading.value = false;
    }
  };

  // 测试-- 播放器
  // const showViewModal = ref(false);
  // const showViewVideo = ref(false);
  // const handleTest = () => {
  //   showViewModal.value = true;
  // };
  // const handleTest1 = () => {
  //   showViewVideo.value = true;
  // };

  /** 初始化 **/
  onMounted(() => {
    // 聚焦用户名输入框
    setTimeout(() => {
      const userNameInput = document.querySelector('input[placeholder="请输入用户名"]');
      if (userNameInput) {
        (userNameInput as HTMLElement).focus();
      }
    }, 500);
    if (storage.exists(ACCESS_TOKEN) && storage.exists(REFRESH_TOKEN)) {
      const accessToken = storage.get(ACCESS_TOKEN);
      const refreshToken = storage.get(REFRESH_TOKEN);
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);
      // 执行自动登录
    }
  });
</script>

<style lang="less" scoped>
  body {
    height: 100%;
  }
  .view-account {
    width: 100%;
    height: 100vh;
    overflow: auto;
    position: relative;

    &-leftbox {
      width: 60%;
      height: 100vh;
      background-image: url('../../assets/images/container.jpg'); /* 背景图的路径 */
      background-size: cover; /* 背景图铺满整个元素 */
      background-position: left top; /* 背景图居中显示 */
      background-repeat: no-repeat; /* 确保背景图不重复 */
      float: left;
      display: none;
    }

    &-container {
      width: 100%;
      height: 100%;
      padding: 0px 40px;
      background-image: url('../../assets/images/container.jpg'); /* 背景图的路径 */
      background-size: cover; /* 背景图铺满整个元素 */
      background-position: left top; /* 背景图居中显示 */
      background-repeat: no-repeat; /* 确保背景图不重复 */
      display: flex;
      align-items: center;

      // border-radius: 12px;
      // box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      // margin-top: 10vh;
      // position: relative;
      // backdrop-filter: blur(10px);
      // background: rgba(255, 255, 255, 0.95);
      // border: 1px solid rgba(255, 255, 255, 0.18);
      // transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
      .copyright {
        width: 100%;
        font-size: 12px;
        color: #ffffff;
        padding: 0px 30px;
        text-align: center;
        position: absolute;
        bottom: 40px;
        left: 0;
        z-index: 10;
      }
    }

    &-frombox {
      width: 100%;
      height: auto;
      background-color: #ffffff;
      padding: 40px 40px 10px 40px;
      border-radius: 8px;
      margin-top: 40px;
    }

    &-top {
      padding: 10px 0;
      text-align: center;

      &-logo {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;

        img {
          width: auto;
          height: 32px;
        }
      }

      &-desc {
        font-size: 14px;
        color: #606266;
      }
    }

    &-title {
      text-align: center;
      font-size: 22px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: linear-gradient(to right, #5c7b75, #314146);
        border-radius: 2px;
      }
    }

    .login-welcome {
      text-align: center;
      font-size: 14px;
      color: #bbbbbb;
      margin-bottom: 30px;
      margin-top: 20px;
    }

    &-other {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }

    .login-button {
      margin-top: 10px;
      height: 42px;
      font-size: 16px;
      border-radius: 4px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;
      border: 0px;
      background-image: linear-gradient(to right, #73b3c7, #4aa393);
      color: #ffffff !important;

      &:hover {
        transform: translateY(-1px);
        background-image: linear-gradient(to right, #79b3c5, #63b1a3);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        color: #ffffff;
        background: rgba(255, 255, 255, 0.5);
        background-image: linear-gradient(to right, #639fb1, #469b8b);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
      }

      &:focus:not(:active)::after {
        animation: ripple 1s ease-out;
      }

      @keyframes ripple {
        0% {
          transform: scale(0, 0);
          opacity: 0.5;
        }
        20% {
          transform: scale(25, 25);
          opacity: 0.3;
        }
        100% {
          opacity: 0;
          transform: scale(40, 40);
        }
      }
    }

    .remember-forgot {
      margin-bottom: 5px;

      .flex-between-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .right {
        text-align: right;
      }
    }

    .forgot-link {
      color: #606266;
      transition: all 0.2s;

      &:hover {
        color: #2d8cf0;
      }
    }

    .social-login {
      display: flex;
      margin-left: 16px;
    }

    .social-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 12px;
      transition: all 0.3s;
      background-color: rgba(144, 147, 153, 0.1);

      &:hover {
        background-color: rgba(45, 140, 240, 0.2);
        transform: scale(1.1);

        :deep(svg) {
          color: #2d8cf0 !important;
        }
      }
    }

    .register-link {
      color: #2d8cf0;
      transition: all 0.3s;

      &:hover {
        color: #57a3f3;
        text-decoration: underline;
      }
    }

    .login-form {
      :deep(.n-form-item-feedback-wrapper) {
        min-height: 18px;
      }

      :deep(.n-input) {
        border-radius: 4px;
      }

      padding: 0;
    }

    .login-input {
      :deep(.n-input__input-el) {
        padding-left: 5px;
      }

      :deep(.n-input-wrapper) {
        transition: all 0.3s ease;
      }

      &:hover {
        :deep(.n-input-wrapper) {
          box-shadow: 0 0 0 1px rgba(45, 140, 240, 0.2);
        }
      }
    }

    .username-item,
    .password-item {
      margin-bottom: 24px;
    }

    .other-text {
      padding-left: 5px;
    }

    .other-item {
      margin-bottom: 0;
    }

    .n-card {
      width: 364px !important;

      .box_vcode {
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 3px 5px 1px rgba(0, 0, 0, 0.1);
      }
    }
    .box_button {
      margin-top: 20px;
    }
  }

  @media (min-width: 1200px) {
    .view-account {
      width: 100%;
      height: 100vh;
      position: relative;

      &-leftbox {
        width: 60%;
        height: 100vh;
        background-image: url('../../assets/images/container.jpg'); /* 背景图的路径 */
        background-size: cover; /* 背景图铺满整个元素 */
        background-position: left top; /* 背景图居中显示 */
        background-repeat: no-repeat; /* 确保背景图不重复 */
        float: left;
        display: block;
      }

      &-container {
        width: 40%;
        height: 100vh;
        padding: 0px 60px;
        background-image: url(''); /* 背景图的路径 */
        align-items: top;
        position: relative;
        float: right;
        .copyright {
          width: 100%;
          padding: 0px 30px;
          text-align: center;
          font-size: 13px;
          color: #bababa;
          position: absolute;
          bottom: 60px;
          left: 0;
          z-index: 10;
        }
      }

      &-frombox {
        width: 100%;
        padding: 20px 30px;
        margin-top: 0px;
        margin-bottom: 80px;
      }

      &-top {
        padding: 10px 0;
        text-align: center;

        &-logo {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;

          img {
            width: auto;
            height: 48px;
          }
        }

        &-desc {
          font-size: 14px;
          color: #606266;
        }
      }

      .username-item,
      .password-item {
        margin-bottom: 40px;
      }
    }
  }
  @media (min-width: 1480px) {
    .view-account {
      &-container {
        width: 40%;
        height: 100vh;
        padding: 0px 120px;
        background-image: url(''); /* 背景图的路径 */
        align-items: top;
        position: relative;
        float: right;
        .copyright {
          width: 100%;
          font-size: 13px;
          padding: 0px 30px;
          text-align: center;
          color: #bababa;
          position: absolute;
          bottom: 60px;
          left: 0;
          z-index: 10;
        }
      }

      &-frombox {
        width: 100%;
        padding: 20px 60px;
        margin-top: 0px;
        margin-bottom: 80px;
      }

      &-top {
        padding: 10px 0;
        text-align: center;

        &-logo {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;

          img {
            width: auto;
            height: 48px;
          }
        }

        &-desc {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
</style>
