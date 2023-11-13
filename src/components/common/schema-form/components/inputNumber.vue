<template>
  <n-input-number
    v-model:value="modelValue"
    v-bind="binds"
    class="dnt-schema-input-number"
    v-on="{ ...formItem.events }"
  />
</template>

<script lang="ts">
import type { InputNumberProps } from 'n-designv3/es/input-number';
import { defineComponent, type PropType, computed, type ComputedRef } from 'vue';
import { InputNumber } from 'n-designv3';
import { getComponentProps } from './utils';

export default defineComponent({
  components: {
    [InputNumber.name]: InputNumber,
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
    const binds = getComponentProps(props?.formItem) as ComputedRef<InputNumberProps>;

    // 默认最小值为0
    if (!binds?.value.min) {
      binds.value.min = 0;
    }
    const modelValue = computed({
      get: () => props.value || binds?.value.min || 0,
      set: (val) => emit('update:value', val),
    });

    if (binds?.value.min) {
      emit('update:value', binds?.value.min);
    }
    return {
      modelValue,
      binds,
    };
  },
});
</script>
<style lang="less">
.ant-input-number.dnt-schema-input-number {
  width: 100%;
}
</style>
