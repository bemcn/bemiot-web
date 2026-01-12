<template>
  <div class="w-full">
    <div class="upload">
      <div class="upload-card">
        <!--图片列表-->
        <div class="upload-card-item" :style="getCSSProperties">
          <div class="upload-card-item-info">
            <div class="img-box">
              <img :src="imgUrl" />
            </div>
            <div class="img-box-actions">
              <n-icon size="18" class="mx-1 action-icon" @click="preview(imgUrl)">
                <EyeOutlined />
              </n-icon>
            </div>
          </div>
        </div>

        <!--上传图片-->
        <div class="upload-card-item upload-card-item-select-picture" :style="getCSSProperties">
          <n-upload
            class="w-auto"
            v-bind="$props"
            :file-list-style="{ display: 'none' }"
            @before-upload="beforeUpload"
            @finish="finish"
          >
            <div class="flex flex-col justify-center">
              <n-icon size="18" class="m-auto">
                <PlusOutlined />
              </n-icon>
              <span class="upload-title">上传图片</span>
            </div>
          </n-upload>
        </div>
      </div>
    </div>

    <!--上传图片-->
    <n-space>
      <div style="font-size: 12px; color: #999999;">{{ helpText }}</div>
    </n-space>
  </div>

  <!--预览图片-->
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="预览"
    :bordered="false"
    :style="{ width: '520px' }"
  >
    <img :src="previewUrl" />
  </n-modal>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, computed, watch } from 'vue';
  import { EyeOutlined, PlusOutlined } from '@vicons/antd';
  import { basicProps } from './soleProps';
  import { useMessage } from 'naive-ui';
  import componentSetting from '@/settings/componentSetting';
  import { useGlobSetting } from '@/hooks/setting';
  import { isString } from '@/utils/is';

  const globSetting = useGlobSetting();

  export default defineComponent({
    name: 'SoleUpload',

    components: { EyeOutlined, PlusOutlined },
    props: {
      ...basicProps,
    },
    emits: ['uploadChange'],
    setup(props, { emit }) {
      const getCSSProperties = computed(() => {
        return {
          width: `${props.width}px`,
          height: `${props.height}px`,
        };
      });

      const message = useMessage();

      const state = reactive({
        showModal: false,
        previewUrl: '',
        originalImgList: [] as string[],
        imgUrl: '',
      });

      //赋值默认图片显示
      watch(
        () => props.value,
        () => {
          state.imgUrl = getImgUrl(props.value);
        },
        { immediate: true }
      );

      //预览
      function preview(url: string) {
        state.showModal = true;
        state.previewUrl = url;
      }

      //组装完整图片地址
      function getImgUrl(url: string): string {
        const apiUrl = globSetting.apiUrl;
        return /(^http|https:\/\/)/g.test(url) ? url : `${apiUrl}${url}`;
      }

      function checkFileType(fileType: string) {
        return componentSetting.upload.fileType.includes(fileType);
      }

      //上传之前
      function beforeUpload({ file }) {
        const fileInfo = file.file;
        const { maxSize, accept } = props;
        const acceptRef = (isString(accept) && accept.split(',')) || [];

        // 设置最大值，则判断
        if (maxSize && fileInfo.size / 1024 / 1024 >= maxSize) {
          message.error(`上传文件最大值不能超过${maxSize}M`);
          return false;
        }

        // 设置类型,则判断
        const fileType = componentSetting.upload.fileType;
        if (acceptRef.length > 0 && !checkFileType(fileInfo.type)) {
          message.error(`只能上传文件类型为${fileType.join(',')}`);
          return false;
        }

        return true;
      }

      //上传结束
      function finish({ event: Event }) {
        const res = eval('(' + Event.target.response + ')');
        const message = res.message;
        //成功
        if (res.status === 'success') {
          const data = res.data;
          let imgUrl: string = getImgUrl(data.url);
          state.imgUrl = imgUrl;
          emit('uploadChange', data.url);
        } else message.error(message);
      }

      return {
        ...toRefs(state),
        finish,
        preview,
        beforeUpload,
        getCSSProperties,
      };
    },
  });
</script>

<style lang="less">
  .upload {
    width: 100%;
    overflow: hidden;

    &-card {
      width: auto;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      &-item {
        margin: 0 8px 8px 0;
        position: relative;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        &:hover {
          background: 0 0;

          .upload-card-item-info::before {
            opacity: 1;
          }

          &-info::before {
            opacity: 1;
          }
        }

        &-info {
          position: relative;
          height: 100%;
          width: 100%;
          padding: 0;
          overflow: hidden;

          &:hover {
            .img-box-actions {
              opacity: 1;
            }
          }

          &::before {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.3s;
            content: ' ';
          }

          .img-box {
            position: relative;
            //padding: 8px;
            //border: 1px solid #d9d9d9;
            border-radius: 2px;
          }

          .img-box-actions {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 10;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:hover {
              background: 0 0;
            }

            .action-icon {
              color: rgba(255, 255, 255, 0.85);

              &:hover {
                cursor: pointer;
                color: #fff;
              }
            }
          }
        }
      }

      &-item-select-picture {
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        background: #fafafa;
        color: #666;

        .upload-title {
          color: #666;
        }
      }
    }
  }
</style>