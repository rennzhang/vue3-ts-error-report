<template>
  <n-form ref="schemaAntFormRef" v-bind="formItemLayout" class="schema-form">
    <div class="relative">
      <div v-if="getFormSchema.disabled" class="mask-lock-layer"></div>
      <template v-for="formItem in getAllFormItem" :key="formItem.field">
        <template v-if="isShowFormItem(formItem)">
          <n-spin :spinning="formItem.loading || false">
            <n-form-item
              :help="formItem.help"
              :extra="formItem.extra"
              :label="formItem.label"
              :name="isShowFormItem(formItem) ? formItem.field : ''"
              v-bind="{ ...formItem.props, ...validateInfos[formItem.field], ...formItem }"
              :type="undefined"
            >
              <template v-if="formItem.component">
                <component :is="formItem.component" :form-state="exposeFormState" />
              </template>
              <template v-if="formItem.slotName">
                <slot :name="formItem.slotName" v-bind="exposeFormState"></slot>
              </template>
              <template v-else>
                <div class="schema-form-item-content">
                  <span v-if="handleFnAttr(formItem, 'prefixText')" class="extra-text prefix-text">
                    {{ handleFnAttr(formItem, 'prefixText') }}
                  </span>
                  <component
                    :is="getComponent(formItem.type as string)"
                    v-model:value="formModel[formItem.field]"
                    :form-item="formItem"
                    :form-model="formModel"
                    v-on="{ ...getTriggerEvent(formItem) }"
                  />
                  <span v-if="handleFnAttr(formItem, 'suffixText')" class="extra-text suffix-text">
                    {{ handleFnAttr(formItem, 'suffixText') }}
                  </span>
                </div>
              </template>
              <NTips v-if="formItem.tips" end :title="handleFnAttr(formItem, 'tips')" />
              <slot name="itemBottom" v-bind="{ ...formItem, value: formModel[formItem.field], ...exposeFormState }"></slot>
            </n-form-item>
          </n-spin>
        </template>
      </template>
    </div>
    <template v-if="$slots['action']">
      <n-form-item :wrapper-col="getOperateLayout()">
        <slot name="action"></slot>
      </n-form-item>
    </template>
    <template v-if="getFormSchema.showAction || getFormSchema.showCancel">
      <n-form-item :wrapper-col="getOperateLayout()">
        <n-button v-if="getFormSchema.showCancel" class="mr-3" @click="handleCancel">
          {{ getFormSchema.cancelText }}
        </n-button>
        <n-button v-if="getFormSchema.showAction" type="primary" @click="handleSubmit">
          {{ getFormSchema.actionText }}
        </n-button>
      </n-form-item>
    </template>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance, ref, type PropType } from 'vue';
import { Form, Spin } from 'n-designv3';
// 源码调试
// import { Spin } from "n-designv3";
// import Form from "n-designv3/lib/form/Form";
import { isString, isFunction } from '@/utils/is';
import components from './components';
import { useFormValues } from './hooks/useFormValues';
import { useFormRules } from './hooks/useFormRules';
import { useFormItem } from './hooks/useFormItem';
import { useFormLayout } from './hooks/useFormLayout';
import { useFormEvents } from './hooks/useFormEvents';
import { cloneDeep } from 'lodash-es';
import { clearObject } from '@/utils';
import NTips from '@/components/common/n-tips/index.vue';
const useForm = Form.useForm;

export default defineComponent({
  name: 'SchemaForm',
  components: {
    ...components,
    [Spin.name]: Spin,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
  },
  props: {
    formSchema: {
      // 动态验证表单
      required: true,
      type: Object as PropType<FormSchema>,
    },
  },
  // emits: ["ready", "submit", "cancel"],
  emits: {
    ready: (formState: Partial<SchemaFormState>) => true,
    submit: (values: any, clearForm: () => void) => true,
    cancel: (clearForm: () => void) => true,
  },
  expose: [
    'formModel',
    'rules',
    'formItems',
    'validateInfos',
    'validate',
    'resetFields',
    'validateField',
    'clearValidate',
    'clearForm',
    'updateFormModel',
    'handleSubmit',
    '__INIT_EVENT__',
  ],
  setup(props, { emit }) {
    const formItemsRef = ref<FormItem[]>(null);

    const schemaFormState = reactive({
      // 表单实例
      formInstance: getCurrentInstance(),
      formSchema: computed(() => props.formSchema),
      formModel: (unref(props.formSchema.formItem) as FormItem[]).reduce((previousValue: any, currentValue: any) => {
        previousValue[currentValue.field] = currentValue.value;
        return previousValue;
      }, {}),
      allFormItem: [],
      getterProps: computed((): any => {
        return { ...props } as any;
      }),
      getterAllFormItem: computed<FormItem[]>(() => {
        return unref(formItemsRef) || (props.formSchema.formItem as FormItem[]);
      }),
    }) as unknown as SchemaFormCompState;

    // a-form
    const schemaAntFormRef = ref<InstanceType<typeof Form>>()!;

    // 表单项
    const formModel = reactive(
      (unref(props.formSchema.formItem) as FormItem[]).reduce((previousValue: any, currentValue: any) => {
        previousValue[currentValue.field] = currentValue.value;
        return previousValue;
      }, {})
    );
    provide('schemaFormModel', formModel);
    const { getFormSchema, getFormItem } = useFormValues(schemaFormState);
    const { formItemLayout, getOperateLayout } = useFormLayout(schemaFormState);
    const { getComponent, isShowFormItem, updateFormItem, handleFnAttr } = useFormItem({
      formItemsRef,
      schemaFormState,
    });

    useFormEvents({ updateFormItem, schemaFormState });

    const { getRules } = useFormRules({
      schemaFormState,
      isShowFormItem,
      getFormItem,
    });

    const rulesRef = getRules();

    const { resetFields, validate, validateInfos, validateField, clearValidate } = useForm(formModel, rulesRef, {
      debounce: { wait: 20 },
    });

    const clearForm = () => {
      clearObject(formModel);
      let t = setTimeout(() => {
        clearValidate(Object.keys(formModel));
        clearTimeout(t);
      }, 50);
    };

    const updateFormModel = (formData: Recordable, isClear?: boolean) => {
      if (isClear) {
        clearForm();
      }
      Object.keys(formData).forEach(key => {
        formModel[key] = formData[key];
      });
    };
    const handleCancel = () => {
      emit('cancel', clearForm);
    };

    /**
     * @description: Form submission
     */
    async function handleSubmit(e?: Event): Promise<any> {
      e && e.preventDefault();

      const { submitFunc } = schemaFormState.formSchema;
      if (submitFunc && isFunction(submitFunc)) {
        await submitFunc();
        return;
      }
      const formEl = unref(schemaAntFormRef);
      if (!formEl) return;
      let values = await validate();

      if (props.formSchema.tansValue) {
        values = props.formSchema.tansValue(cloneDeep(values));
      }
      emit('submit', values, clearForm);
      return values;
    }

    // 设置触发表单项验证的事件
    const setTriggerEvent =
      ({ field, trigger }: any) =>
      () =>
        validate(field, { trigger }).catch(() => ({}));

    // 获取触发表单项验证的时机
    const getTriggerEvent = (formItem: FormItem) => {
      const events: any = {};
      const field = formItem.field;
      if (Array.isArray(formItem.rules)) {
        // 如果是数组
        formItem.rules.forEach(ruleItem => {
          if (!ruleItem.trigger) ruleItem.trigger = 'change';

          if (Array.isArray(ruleItem.trigger)) {
            ruleItem.trigger.forEach(triggerItem => (events[triggerItem] = setTriggerEvent({ field, trigger: triggerItem })));
          } else if (isString(ruleItem.trigger)) {
            events[ruleItem.trigger] = setTriggerEvent({ field, trigger: ruleItem.trigger });
          }
        });
      } else if (formItem.rules?.['trigger']) {
        // 如果是对象
        const trigger: any = formItem.rules?.['trigger'];
        events[trigger] = setTriggerEvent({ field, trigger });
        if (Array.isArray(trigger)) {
          trigger.forEach(triggerItem => (events[triggerItem] = setTriggerEvent({ field, trigger: triggerItem })));
        } else if (isString(trigger)) {
          events[trigger] = setTriggerEvent({ field, trigger: trigger });
        }
      }
      return events;
    };

    const exposeFormState = {
      formModel,
      rules: rulesRef,
      formItems: unref(schemaFormState.getterAllFormItem),
      validateInfos,
      validate,
      resetFields,
      validateField,
      clearValidate,
      clearForm,
      updateFormModel,
      handleSubmit,
    };

    provide('schemaFormState', exposeFormState);

    onMounted(() => {
      emit('ready', exposeFormState as any);
    });
    return {
      formItemLayout,
      schemaAntFormRef,
      getTriggerEvent,
      getComponent,
      handleCancel,
      formItemsRef,
      getAllFormItem: schemaFormState.getterAllFormItem,
      getFormSchema,
      isShowFormItem,
      handleFnAttr,
      getOperateLayout,
      ...exposeFormState,
      exposeFormState,
    };
  },
});
</script>

<style lang="less" scoped>
.ant-form {
  .ant-input-group {
    display: flex;
  }
}
.mask-lock-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
}
:deep(.dnt-tips) {
  z-index: 2;
}

.schema-form-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .extra-text {
    word-break: keep-all;
    color: rgba(0, 0, 0, 0.7);
    &.prefix-text {
      margin-right: 8px;
    }
    &.suffix-text {
      margin-left: 8px;
    }
  }
}
</style>
