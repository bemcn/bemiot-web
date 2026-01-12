<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted } from 'vue';
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
  import { AppProvider } from '@/components/Application';
  import { useRoute } from 'vue-router';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { lighten } from '@/utils/index';

  const route = useRoute();
  const designStore = useDesignSettingStore();

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6); //系统风格
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
        primaryColorSuppl: appTheme,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined)); //深色主题

  //let timer: NodeJS.Timer;
  let timer: ReturnType<typeof setInterval>;
  // const timekeeping = () => {
  //   clearInterval(timer);
  //   if (route.name == 'login' || isLock.value) return;
  //   // 设置不锁屏
  //   useScreenLock.setLock(false);
  //   // 重置锁屏时间
  //   useScreenLock.setLockTime();
  //   timer = setInterval(() => {
  //     // 锁屏倒计时递减
  //     useScreenLock.setLockTime(lockTime.value - 1);
  //     if (lockTime.value <= 0) {
  //       // 设置锁屏
  //       useScreenLock.setLock(true);
  //       return clearInterval(timer);
  //     }
  //   }, 1000);
  // };

  // onMounted(() => {
  //   document.addEventListener('mousedown', timekeeping);
  // });

  // onUnmounted(() => {
  //   document.removeEventListener('mousedown', timekeeping);
  //   if (timer) {
  //     clearInterval(timer);
  //   }
  // });
</script>
