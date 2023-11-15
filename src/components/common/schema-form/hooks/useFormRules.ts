import { isBoolean } from '@/utils/is';
import { getDefaultTipsPrefix } from './useFormDefaults';

type FormRulesParams = {
  [key: string]: any;
  schemaFormState: SchemaFormCompState;
};
export const useFormRules = ({ isShowFormItem, getFormItem, schemaFormState }: FormRulesParams) => {
  const getRules = () => {
    return computed(() => {
      const ruleItems = schemaFormState.getAllFormItem().filter((item: FormItem) => isShowFormItem(item));
      const rules: any = reactive({});
      ruleItems.map((item: FormItem) => {
        rules[item.field] =
          (item?.dynamicRules &&
            item?.dynamicRules?.({
              formModel: schemaFormState.formModel,
              ...((schemaFormState.formInstance?.exposeProxy as any) || {}),
            })) ||
          item.rules;

        const isRequired = isBoolean(item.required)
          ? item.required
          : isBoolean(schemaFormState.formSchema.required)
          ? schemaFormState.formSchema.required
          : undefined;
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
