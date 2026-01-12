<template>
  <n-card :bordered="false" title="Redis缓存信息" class="monitor-card" size="small">
    <div class="container">
      <div class="img-box">
        <img src="./../../../../assets/images/redis.png" alt="" />
      </div>
      <div class="data-box">
        <div class="data-line">
          <div class="label">软件版本:</div>
          <div class="value"
            >Redis Server {{ props.data.archBits }}位 v{{ props.data.version }}</div
          >
        </div>
        <div class="data-line">
          <div class="label">运行模式：</div>
          <div class="value">{{ props.data.model }}</div>
        </div>
        <div class="data-line">
          <div class="label">监听端口：</div>
          <div class="value">{{ props.data.port }}</div>
        </div>
        <div class="data-line">
          <div class="label">内存占用：</div>
          <div class="value">{{ props.data.memory }} Mb</div>
        </div>
        <div class="data-line">
          <div class="label">运行时长：</div>
          <div class="value">{{ props.data.runDays }} 天</div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
  // 定义props接口
  interface Props {
    data: {
      version: string;
      archBits: string;
      pid: string;
      port: string;
      model: string;
      runDays: string;
      memory: number;
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => ({
      version: '',
      archBits: '',
      pid: '',
      port: '',
      model: '',
      runDays: '',
      memory: 0,
    }),
  });
</script>

<style lang="less" scoped>
  .monitor-card {
    height: 200px;
    margin-bottom: 15px;
    .container {
      height: 130px;
      .img-box {
        width: 95px;
        height: 80px;
        float: left;
        img {
          width: 80px;
          height: 80px;
        }
        .version {
          width: 80px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      }
      .data-box {
        height: 130px;
        margin-left: 100px;
        .data-line {
          height: 25px;
          font-size: 13px;
          .label {
            width: 80px;
            height: 25px;
            color: #999;
            line-height: 25px;
            float: left;
          }
          .value {
            height: 25px;
            color: #666;
            margin-left: 80px;
            line-height: 25px;
          }
        }
      }
    }
  }
</style>
