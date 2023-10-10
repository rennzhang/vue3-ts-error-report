import { isFunction, isBoolean, isObject, isArray } from '@/utils/is';
import { merge, uniqBy } from 'lodash-es';
import type { Ref } from 'vue';
type IProps = {
  formItemsRef: Ref<FormItem[]>;
  schemaFormState: SchemaFormCompState;
};
export const useFormItem = ({ formItemsRef, schemaFormState }: IProps) => {
  // 获取组件名称
  const getComponent = (type: string) => {
    console.log(type.toLowerCase());

    return type ? 'schema-form-' + type.toLowerCase() : null;
  };

  /** @description 是否显示表单项 */
  const isShowFormItem = (formItem: FormItem) => {
    const { isShow } = formItem;
    if (isBoolean(isShow)) return isShow;
    if (isFunction(isShow)) {
      return isShow({ formModel: schemaFormState.formModel, formItem });
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
    const newFormItem: FormItem[] = [];
    updateData.forEach(item => {
      unref(schemaFormState.getterAllFormItem).forEach((val: FormItem) => {
        if (val.field === item.field) {
          const newSchema = merge(val, item);

          newFormItem.push(newSchema as FormItem);
        } else {
          newFormItem.push(val);
        }
      });
    });
    formItemsRef.value = uniqBy(newFormItem, 'field');
  }

  const handleFnAttr = (formItem: FormItem, attr: keyof FormItem) => {
    const attrValue = formItem[attr];
    if (!attrValue) return;
    if (isFunction(attrValue)) {
      return attrValue(schemaFormState.formInstance?.exposed);
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
