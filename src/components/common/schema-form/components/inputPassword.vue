<template>
  <n-input-password v-model:value="modelValue" v-bind="binds" v-on="{ ...formItem.events }" />
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';

import { getComponentProps } from './utils';
export default defineComponent({
  props: {
    formItem: {
      // 表单项
      type: Object as PropType<FormItem>,
      default: () => ({}),
    },
    formModel: {
      // 表单值绑定对象
      type: Object as PropType<any>,
      default: () => ({}),
    },
    value: undefined as any, // 表单项值
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const modelValue = computed({
      get: () => props.value || '',
      set: val => emit('update:value', val),
    });

    return {
      modelValue,
      binds: getComponentProps(props?.formItem),
    };
  },
});
</script>
