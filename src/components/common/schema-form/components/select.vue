<template>
  <n-select v-model:value="modelValue" v-bind="binds" v-on="{ ...formItem.events }">
    <template v-for="option in options" :key="option.value">
      <n-select-option :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </n-select-option>
    </template>
  </n-select>
</template>
<script lang="ts">
import { defineComponent, type PropType, computed, type ComputedRef } from 'vue';
import { Select, type SelectProps } from 'n-designv3';
import { getComponentProps } from './utils';

export default defineComponent({
  components: {
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
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
      get: () => {
        if ((props.formItem.props as SelectProps)?.mode == 'multiple') {
          return props.value || [];
        }
        return [null, undefined].includes(props.value) ? null : props.value;
      },
      set: val => emit('update:value', val),
    });

    const options = computed(() => {
      return unref(props.formItem.options);
    }) as ComputedRef<OptionItem[]>;
    return {
      modelValue,
      options,
      binds: getComponentProps(props?.formItem),
    };
  },
});
</script>
