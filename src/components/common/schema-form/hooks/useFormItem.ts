import { isFunction, isBoolean, isObject, isArray } from '@/utils/is';
import { merge, uniqBy } from 'lodash-es';

export const useFormItem = ({ getAllFormItem, formItemsRef, formInstance, formModel }: { [key: string]: any }) => {
  // 获取组件名称
  const getComponent = (type: string) => {
    return type ? 'schema-form-' + type.toLowerCase() : null;
  };

  /** @description 是否显示表单项 */
  const isShowFormItem = (formItem: FormItem) => {
    const { isShow } = formItem;
    if (isBoolean(isShow)) return isShow;
    if (isFunction(isShow)) {
      return isShow({ formModel, formItem });
    }
    return true;
  };
  async function updateFormItem(data: Partial<FormItem> | Partial<FormItem>[]) {
    let updateData: Partial<FormItem>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormItem);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every((item: any) => item.type === 'divider' || (Reflect.has(item, 'field') && item.field));

    if (!hasField) {
      console.error('All children of the form Schema array that need to be updated must contain the `field` field');
      return;
    }
    const schema: FormItem[] = [];
    updateData.forEach(item => {
      unref(getAllFormItem).forEach((val: FormItem) => {
        if (val.field === item.field) {
          const newSchema = merge(val, item);

          schema.push(newSchema as FormItem);
        } else {
          schema.push(val);
        }
      });
    });
    formItemsRef.value = uniqBy(schema, 'field');
  }

  const handleFnAttr = (formItem: FormItem, attr: keyof FormItem) => {
    const attrValue = formItem[attr];
    if (!attrValue) return;
    if (isFunction(attrValue)) {
      return attrValue(formInstance?.exposed);
    }
    return attrValue;
  };

  return {
    getComponent,
    isShowFormItem,
    updateFormItem,
    handleFnAttr,
  };
};
