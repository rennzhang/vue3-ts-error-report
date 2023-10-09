import { getDefaultTipsPrefix } from './../hooks/useFormDefaults';
import { isFunction } from '@/utils/is';
const getPlaceholder = (type: FormItem['type'], label?: string) => {
  return getDefaultTipsPrefix(type) + label;
};
export const getComponentProps = (formItem: FormItem, mergeData?: any) => {
  const formState = inject('schemaFormState') as SchemaFormState;
  return computed(() => {
    const binds: any = {};
    let _props: any = {};
    if (isFunction(formItem.props)) {
      _props = formItem.props({ ...formState, formItem });
    } else {
      _props = formItem.props || {};
    }
    binds.placeholder = _props?.placeholder || formItem.placeholder;
    Object.assign(binds, _props);
    if (!binds?.placeholder && !['rangePicker', 'timeRangePicker'].includes(formItem.type as string)) {
      binds.placeholder = getPlaceholder(formItem.type, formItem.label);
    }
    return { ...binds, ...mergeData };
  });
};
