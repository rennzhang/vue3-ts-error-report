<template>
  <n-checkbox
    v-if="!options.length && !formItem.asyncOptions"
    v-model:checked="modelValue"
    v-bind="binds"
    v-on="{ ...formItem.events }"
  />
  <n-checkbox-group v-else v-model:value="modelValue" style="width: 100%" v-on="{ ...formItem.events }">
    <template v-for="option in options" :key="option.value">
      <n-checkbox :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </n-checkbox>
    </template>
  </n-checkbox-group>
</template>
<script lang="ts">
import { defineComponent, type PropType, computed, type ComputedRef } from 'vue';

import { Checkbox, Row, Col } from 'n-designv3';
import { getComponentProps } from './utils';

export default defineComponent({
  components: {
    [Checkbox.name]: Checkbox,
    [Row.name]: Row,
    [Col.name]: Col,
    [Checkbox.Group.name]: Checkbox.Group,
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
      get: () => props.value || (props.formItem.options ? [] : false),
      set: (val) => emit('update:value', val),
    });

    const options = computed(() => {
      return unref(props.formItem.options) || [];
    }) as ComputedRef<OptionItem<any>[]>;
    const checkboxGroupHeight = ref();
    const marginTop = ref('');
    const getCheckboxGroupHeight = () => {
      checkboxGroupHeight.value = (document.querySelector('.ant-checkbox-group') as any)?.clientHeight;
      if (!checkboxGroupHeight.value) return;
      marginTop.value = (checkboxGroupHeight.value > 32 ? 8 : 0) + 'px';
    };

    onMounted(() => {
      getCheckboxGroupHeight();
    });
    return {
      modelValue,
      options,
      marginTop,
      binds: getComponentProps(props?.formItem),
    };
  },
});
</script>
<style lang="less" scoped>
.ant-checkbox-group {
  .ant-checkbox-wrapper {
    margin-top: v-bind(marginTop);
  }
}
</style>
