<template>
  <n-switch v-model:checked="modelValue" v-bind="binds" v-on="{ ...formItem.events }" />
</template>
<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { Switch } from 'n-designv3';
import { getComponentProps } from './utils';

export default defineComponent({
  components: {
    [Switch.name]: Switch,
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
      get: () => props.value,
      set: (val) => emit('update:value', val),
    });

    const binds = getComponentProps(props?.formItem);

    const init = () => {
      emit('update:value', props.value);

      const { checkedValue, unCheckedValue } = props?.formItem.props || ({} as any);
      const defaultValue = props.value ?? props.formItem.value;
      if ([defaultValue, checkedValue, unCheckedValue].includes(undefined)) return;
      if (![typeof checkedValue, typeof unCheckedValue].every((t) => t == typeof defaultValue)) {
        console.warn(
          '[schema-form-switch]: 请确保传入的默认值和 checkedValue/unCheckedValue 的值数据类型一致!\n',
          '[schema-form-switch props:]',
          props?.formItem,
          '\n',
          '   value:',
          defaultValue,
          '\n',
          '   checkedValue:',
          checkedValue,
          '\n',
          '   unCheckedValue:',
          unCheckedValue
        );
      }
    };
    init();
    return {
      modelValue,
      binds,
    };
  },
});
</script>
