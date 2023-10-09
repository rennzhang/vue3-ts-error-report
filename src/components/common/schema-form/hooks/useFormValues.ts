import { getDefaultFormSchema } from './useFormDefaults';
import { isFunction, isAsyncFunction } from '@/utils/is';
import { useTimeoutFn } from '@vueuse/core';
export const useFormValues = ({ props, formModel, formInstance, formItemsRef }: { [key: string]: any }) => {
  // 异步设置默认数据
  props.formSchema.formItem.forEach(async (item: FormItem) => {
    // 是否需要loading
    if (Object.prototype.hasOwnProperty.call(item, 'loading')) {
      item.loading = true;
    }
    if (isFunction(item.asyncOptions)) {
      // if (!isReactive(props.formSchema.formItem) && !isRef(props.formSchema.formItem)) {
      //   Promise.reject({
      //     errors: `[SchemaForm]: 使用asyncOptions配置项，必须保证 "${item.field}" 表单项配置必须是一个 reactive 可响应式对象！`,
      //     target: item
      //   });
      // }
      // 异步选项
      item.options = await item.asyncOptions({ formModel, formItem: item });

      item.loading = false;
    }
    if (isFunction(item.asyncValue) || isAsyncFunction(item.asyncValue)) {
      // if (!isReactive(props.formSchema.formItem) && !isRef(props.formSchema.formItem)) {
      //   Promise.reject({
      //     errors: `[SchemaForm]: 使用asyncValue配置项，必须保证 "${item.field}" 表单项配置必须是一个 reactive 可响应式对象！`,
      //     target: item
      //   });
      // }
      // 异步默认值
      formModel[item.field] = await item.asyncValue({ formModel, formItem: item }).finally(() => (item.loading = false));
    }
  });

  const getProps = computed((): any => {
    return { ...props } as any;
  });
  const getFormSchema = computed((): FormSchema => {
    return { ...getDefaultFormSchema(), ...unref(props.formSchema) };
  });
  const formItemMap = computed(() => {
    const map: any = {};
    props.formSchema.formItem.forEach((item: FormItem) => {
      map[item.field] = item;
    });
    return map;
  });

  /**获取单个表单项的配置 */
  const getFormItem = (name: string): FormItem => {
    return formItemMap.value[name];
  };

  /**获取所有表单项的配置 */
  const getAllFormItem = computed((): FormItem[] => {
    const formItems: FormItem[] = unref(formItemsRef) || (unref(getProps).formSchema.formItem as any);
    return formItems;
  });

  const { start: startClearValidate } = useTimeoutFn(() => {
    formInstance?.exposed?.clearValidate();
  }, 50);

  // 将传入的formData合并到表单
  watch(
    () => props.formSchema.formData,
    val => {
      val && Object.assign(formModel, val);
      startClearValidate();
    },
    { deep: true, immediate: true }
  );
  return {
    getFormSchema,
    formItemMap,
    getFormItem,
    getAllFormItem,
    getProps,
  };
};
