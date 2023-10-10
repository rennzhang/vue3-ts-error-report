<template>
  <n-tooltip v-bind="binds">
    <template #title>
      <template v-if="!slots.title">
        <template v-if="isArray(props.title)">
          <p v-for="(content, index) in props.title" :key="index">{{ content }}</p>
        </template>
        <template v-else>
          {{ props.title }}
        </template>
      </template>
      <slot v-else name="title"></slot>
    </template>
    <span :class="['custom-tips', { end: props.end }]" :style="style">
      <div class="custom-tips-content">
        <slot>
          <template v-if="props.showIcon">
            <SyncOutlined
              v-if="props.title.includes('刷新')"
              class="tooltip-icon sync-icon"
              :style="{ color: props.iconColor }"
              :class="[{ loading: props.loading == undefined ? _loading : props.loading }]"
              @click="onClick('刷新')"
            />
            <QuestionCircleOutlined v-else :style="{ color: props.iconColor }" @click="onClick" />
          </template>
        </slot>
      </div>
    </span>
  </n-tooltip>
</template>

<script setup lang="ts">
/**
 * 表单项后面的问号鼠标悬浮提示
 */
import { useSlots, useAttrs, type PropType } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { isArray } from 'lodash-es';
const slots = useSlots();
const emit = defineEmits(['click']);
const attrs = useAttrs();
const props = defineProps({
  title: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  placement: {
    type: String,
    default: 'top',
  },
  // 是否显示图标
  showIcon: {
    type: Boolean,
    default: true,
  },
  // 去除默认样式
  clearStyle: {
    type: Boolean,
    default: false,
  },
  // 是否放到元素最后（定位），可用于表单项的说明
  end: {
    type: Boolean,
    default: false,
  },
  // 控制刷新动画
  loading: {
    type: Boolean,
    default: undefined,
  },
  iconColor: {
    type: String,
    default: 'rgba(0,0,0,0.75)',
  },
});

// binds
const binds: any = { ...props, ...attrs };
delete binds.title;

// styles
const style = Object.assign((attrs.style as {}) || {});

// 如果没传isSpinning，则给一个假动画
const _loading = ref(false);

/** @description 开始刷新 */
const startSpin = () => {
  if (props.loading == undefined) {
    _loading.value = true;
    useTimeoutFn(() => {
      _loading.value = false;
    }, 1200);
  }
};

const onClick = (type: string) => {
  emit('click');
  if (type == '刷新') return startSpin();
};
</script>

<style scoped lang="less">
@-webkit-keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.custom-tips {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  vertical-align: middle !important;
  margin: 0;
  line-height: initial;
  &.end {
    position: absolute;
    right: -24px;
    top: 8px;
  }
  .custom-tips-content {
    height: 100%;
    width: 100%;
  }
}
.custom-tips :deep(.custom-tips-content) .anticon {
  cursor: pointer;
  &.loading {
    animation: rotate 1.3s infinite linear;
  }
}
.tooltip-icon {
  &.sync-icon {
    &:hover {
      color: #69a1ff;
    }
  }
}
</style>
