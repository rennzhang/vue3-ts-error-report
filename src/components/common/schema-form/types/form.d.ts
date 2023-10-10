import { VNode, ComponentInternalInstance, HTMLAttributes, CSSProperties, ComputedRef, Ref, UnwrapNestedRefs } from 'vue';

import { FormProps, ValidationRule, validateInfos } from 'n-designv3/lib/form/Form';
import type { FormItem as SchemaFormItem } from './formItem';

declare global {
  type ProxyData<T> = T | Ref<T> | UnwrapNestedRefs<T>;

  type FormItem<T = any> = SchemaFormItem<T>;
  declare interface OptionItem<T = string | number> {
    label: string | number;
    value: T;
    disabled?: boolean;
    [key: string]: any;
  }
  declare type Rule =
    | ValidationRule
    | {
        trigger?: 'blur' | 'change' | string['blur' | 'change'];
      };

  type SchemaFormLayout = {
    labelCol?: FormProps['labelCol'];
    wrapperCol?: FormProps['wrapperCol'];
  };

  declare type SchemaFormCompProps = {
    formSchema: FormSchema;
  };

  declare type SchemaFormModel = Recordable;
  declare type SchemaFormInstance = ComponentInternalInstance;

  declare type SchemaFormCompState = {
    formInstance: SchemaFormInstance;
    allFormItem: FormItem[];
    formModel: SchemaFormModel;
    formSchema: FormSchema;
    getterAllFormItem: ComputedRef<FormItem[]>;
    getterProps: ComputedRef<SchemaFormCompProps>;
  };
  declare interface SchemaFormState<T = SchemaFormModel> {
    formModel: T;
    rules: Rule[];
    formItem: FormItem;
    validateInfos: validateInfos;
    validate: (names?: namesType, option?: validateOptions) => Promise<T>;
    resetFields: (newValues?: Props) => void;
    validateField: (name: string, value: any, rules: Record<string, unknown>[], option?: validateOptions) => Promise<RuleError[]>;
    clearValidate: (names?: namesType) => void;
    clearForm: () => void;
    updateFormModel: (formData: Recordable, isClear?: boolean) => void;
    formItems: FormItem[];
    handleSubmit: () => Promise<any>;
    updateFormItem: (data: Partial<FormItem<any>> | Partial<FormItem<any>>[]) => Promise<void>;
  }

  declare type SchemaFormRef<T = any> = Nullable<SchemaFormState<T>>;

  interface FormSchema<T = any> extends Partial<typeof FormProps> {
    /** 表单项配置 */
    formItem: ProxyData<FormItem<T>[]>;
    /**
     * 表单项默认数据或者传入接口获取的数据
     * @example
     * formData :{
     *  name: '初始名称',
     * }
     * 或者
     * formData.name = "any name"
     *  */
    formData?: Partial<T>;
    style?: CSSProperties; // 表单样式
    /**
     * 表单布局，参考https://www.antdv.com/components/grid-cn/#Col
     */
    formItemLayout?: SchemaFormLayout; // 表单布局
    // watchCallback?: (watchKeys: string[], { dynamicForm, formModel }) => any;
    submitFunc?: () => Promise<any>;
    showAction?: boolean;
    actionText?: string;
    showCancel?: boolean;
    cancelText?: string;
    // 是否全部必选，可以通过formItem.required设置
    required?: boolean;
    // 是否全部禁用
    disabled?: boolean;
    tansValue?: <T = Recordable>(formModelClone: T) => T;
  }
}
