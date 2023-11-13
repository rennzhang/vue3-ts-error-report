<template>
  <n-radio-group v-model:value="modelValue" v-bind="binds" v-on="{ ...formItem.events }">
    <template v-for="option in options" :key="option.value">
      <n-radio :value="option.value">
        {{ option.label }}
      </n-radio>
    </template>
  </n-radio-group>
</template>
<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { Radio } from 'n-designv3';
import { getComponentProps } from './utils';

export default defineComponent({
  components: {
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
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
      get: () => props.value || 0,
      set: (val) => emit('update:value', val),
    });
    const options = computed(() => {
      return unref(props.formItem.options);
    });
    const binds = getComponentProps(props?.formItem);

    return {
      modelValue,
      options,
      binds,
    };
  },
});
</script>
