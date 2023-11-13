<template>
  <div class="py-16px px-24px h-full">
    <div class="h-[calc(100%-32px)]">
      <slot></slot>
    </div>
    <div class="flex-end-x">
      <n-space>
        <n-button class="ml-8px" @click="close">取消</n-button>
        <n-button type="primary" @click="onOk">{{ props.okText || '确定' }}</n-button>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  okText?: string;
}>();
const emit = defineEmits<{
  (event: 'ok', close: () => void): void;
}>();

/** @description 通过消息通知到乐仓控制关闭抽屉或者页面 */
const close = () => {
  window.gvUtil.postMsg({
    type: 'closePop',
  });
};

const onOk = () => {
  emit('ok', close);
};
</script>

<style scoped lang="less"></style>
