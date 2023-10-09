import { lowerFirst } from "lodash-es";
export const useFormEvents = ({ props, formModel, updateFormItem }: any) => {
  const handleEvents = () => {
    props.formSchema.formItem.forEach((item: any) => {
      item.events ??= {};
      Object.keys(item.events).forEach((key) => {
        const fn = item.events[key];
        const eventName = lowerFirst(key.replace("on", ""));
        item.events[eventName] = (e: any, ...rest: any) => {
          fn({
            event: e,
            value: formModel?.[item.field],
            formModel,
            updateFormItem,
            ...rest
          } as any);
        };
      });
    }, {});
  };
  onMounted(() => {
    handleEvents();
  });
  return {
    handleEvents
  };
};
