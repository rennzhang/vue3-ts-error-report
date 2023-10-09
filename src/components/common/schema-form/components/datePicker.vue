<template>
  <n-date-picker v-model:value="modelValue" :value-format="valueFormat" v-bind="binds" v-on="{ ...formItem.events }" />
</template>
<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { DatePicker } from 'n-designv3';
import { getComponentProps } from './utils';
export default defineComponent({
  components: {
    [DatePicker.name]: DatePicker,
  },
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

    const valueFormat = (props?.formItem?.props as any)?.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';

    return {
      modelValue,
      valueFormat,
      binds: getComponentProps(props?.formItem),
    };
  },
});
</script>
