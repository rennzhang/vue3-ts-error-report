import { isBoolean } from '@/utils/is';
type FormRulesParams = {
  [key: string]: any;
};
export const useFormRules = ({ props, isShowFormItem, getFormItem, getDefaultTipsPrefix, formInstance, formModel }: FormRulesParams) => {
  const getRules = () => {
    return computed(() => {
      const ruleItems = props.formSchema.formItem.filter((item: FormItem) => isShowFormItem(item));
      const rules: any = reactive({});
      ruleItems.map((item: FormItem) => {
        rules[item.field] = (item?.dynamicRules && item?.dynamicRules?.({ formModel, ...(formInstance?.exposeProxy || {}) })) || item.rules;

        const isRequired = isBoolean(item.required) ? item.required : isBoolean(props.formSchema.required) ? props.formSchema.required : undefined;
        if (isRequired && !rules[item.field]) {
          const _rule: Rule = {
            required: true,
            message: `${getDefaultTipsPrefix(item.type)}${item.label}`,
            trigger: ['blur', 'change'],
          };
          if (item.type === 'inputNumber') {
            _rule.type = 'number';
          }
          rules[item.field] = [_rule];
        }
      });

      Object.entries(rules).forEach(([key, rule]: any) => {
        const schema: any = getFormItem(key);
        if (!rule) return;
        rule?.forEach?.((ruleItem: any) => {
          if (ruleItem.validator) return;
          if (!ruleItem.message) {
            ruleItem.message = getDefaultTipsPrefix(schema.type) + schema.label;
          }
        });
      });
      return rules;
    });
  };

  return {
    getRules,
  };
};
