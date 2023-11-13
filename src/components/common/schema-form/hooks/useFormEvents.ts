import { lowerFirst } from 'lodash-es';
import type { UpdateFormItemFn } from '../types/compAttrs';
import type { SchemaFormItemEvents } from '../types/formItem';

type IProps = {
  updateFormItem: UpdateFormItemFn;
  schemaFormState: SchemaFormCompState;
};
export const useFormEvents = ({ updateFormItem, schemaFormState }: IProps) => {
  const handleEvents = () => {
    schemaFormState.getAllFormItem().forEach((item) => {
      item.events ??= {};
      // 如果已经初始化过事件，则不再初始化
      if (item.__INIT_EVENTS__) return;
      Object.keys(item.events).forEach((key) => {
        const _events = item.events as SchemaFormItemEvents;
        const fn = _events[key];
        const eventName = lowerFirst(key.replace('on', ''));
        _events[eventName] = (e: any, ...rest: unknown[]) => {
          fn({
            e,
            event: e,
            value: schemaFormState.formModel?.[item.field],
            formModel: schemaFormState.formModel,
            updateFormItem,
            rest,
          });
        };
      });
      item.__INIT_EVENTS__ = true;
    }, {});
  };
  handleEvents();
  return {
    handleEvents,
  };
};
