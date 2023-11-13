<template>
  <n-select
    v-model:value="modelValue"
    :filter-option="false"
    :not-found-content="searching ? undefined : null"
    :options="options"
    v-bind="binds"
    show-search
    @search="onSearch"
  >
    <template v-if="searching" #notFoundContent>
      <n-spin size="small" />
    </template>
  </n-select>
</template>
<script lang="ts">
import { defineComponent, type PropType, computed, type ComputedRef } from 'vue';
import { Select, type SelectProps } from 'n-designv3';
import { getComponentProps } from './utils';
import { debounce } from 'lodash-es';

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
    const formState = inject('schemaFormState') as SchemaFormState;

    const modelValue = computed({
      get: () => {
        if ((props.formItem.props as SelectProps)?.mode == 'multiple') {
          return props.value || [];
        }
        return [null, undefined].includes(props.value) ? null : props.value;
      },
      set: (val) => emit('update:value', val),
    });

    const searching = ref(false);
    const options = ref<OptionItem[]>();

    const onSearch = debounce(async (value: string) => {
      searching.value = true;
      const res = await props.formItem?.searchRequest?.(value, formState);
      options.value = res as OptionItem[];
      searching.value = false;
    }, 300);
    return {
      onSearch,
      searching,
      modelValue,
      options,
      binds: getComponentProps(props?.formItem),
    };
  },
});
</script>
