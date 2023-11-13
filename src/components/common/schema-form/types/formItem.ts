import type { FormItemProps } from 'n-designv3/lib/form/FormItem';
import type { Component } from 'vue';

import type {
  InputProps,
  TextAreaProps,
  SelectProps,
  TreeSelectProps,
  RadioProps,
  CheckboxProps,
  InputNumberProps,
  SwitchProps,
  TimePickerProps,
} from 'n-designv3';
import type { DatePickerProps, RangePickerProps } from 'n-designv3/lib/date-picker';

type Without<FirstType, SecondType> = { [KeyType in Exclude<keyof FirstType, keyof SecondType>]?: null };

type MergeExclusive<FirstType, SecondType> = FirstType | SecondType extends object
  ? (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType)
  : FirstType | SecondType;

export type FormItemPropsMap = {
  input: InputProps;
  text: never; //纯文本
  inputNumber: InputNumberProps;
  inputPassword: InputProps;
  textarea: TextAreaProps;
  select: SelectProps;
  selectSearch: SelectProps;
  treeSelect: TreeSelectProps;
  radio: RadioProps;
  checkbox: CheckboxProps;
  switch: SwitchProps;
  rangePicker: RangePickerProps;
  timePicker: TimePickerProps;
  datePicker: DatePickerProps;
};

export type FormItemPropsObj<T extends Recordable = {}> = {
  [K in keyof FormItemPropsMap]: {
    type: K;
    props?: FormItemPropsMap[K] | ((formState: SchemaFormState<T>) => FormItemPropsMap[K]);
  };
};

export type FormItemMergeProps<T extends Recordable = {}> = FormItemPropsObj<T>[keyof FormItemPropsObj<T>];

declare interface EventParams {
  value: any;
  event: any;
  updateFormItem: (data: FormItem) => void;
  formModel: any;
  [key: string]: any;
}

export interface SchemaFormItemEvents {
  [key: string]: (EventParams: EventParams) => any;
  // onChange
}
type FormItemTypes = 'slotName' | 'component' | 'type';

type GetCombiFormItem<T extends Recordable = {}, ET extends FormItemTypes = 'type'> = ET extends FormItemTypes
  ? FormItemTypeMap<T>[ET]
  : never;

type FormItemTypeMap<T extends Recordable = {}> = {
  type: FormItemMergeProps<T> & FormItemBase<T>;
  slotName: { slotName: string } & FormItemBase<T>;
  component: { component: Component } & FormItemBase<T>;
};

export interface FormItemBase<T extends Recordable = {}> extends Partial<FormItemProps> {
  // type?: Copy<FormItemMergeProps['type']>;
  // 表单字段
  field: Extract<keyof T, string>;
  label?: string; // 表单标签
  value?: any; // 表单默认值
  // props?: FormItemMergeProps['props'] | ((formState: SchemaFormState<T>) => FormItemMergeProps['props']);
  events?: SchemaFormItemEvents; // 事件对象，例如：{ mousedown: doThis, mouseup: doThat } 将会动态绑定为：v-on="{ mousedown: doThis, mouseup: doThat }"
  rules?: Rule[]; // 表单验证规则
  dynamicRules?: (formState: SchemaFormState<T>) => ProxyData<Rule[]>;

  options?: ProxyData<OptionItem[]>; // 可选项
  treeData?: ProxyData<TreeSelectProps['treeData']>; // 可选项

  loading?: ProxyData<boolean>; // 异步数据是否加载
  // props?: FormItemMergeProps['props'] | ((formState: SchemaFormState<T>) => FormItemMergeProps['props']);
  searchRequest?: (
    val: string,
    formState: Pick<SchemaFormState<T>, 'formModel' | 'formItem'>
  ) => Promise<ProxyData<OptionItem[]>>;
  asyncValue?: (formState: Pick<SchemaFormState<T>, 'formModel' | 'formItem'>) => Promise<any>; // 异步数据
  asyncOptions?: (
    formState: Pick<SchemaFormState<T>, 'formModel' | 'formItem'>
  ) => Promise<ProxyData<OptionItem[]>> | ProxyData<OptionItem[]>; // 异步选项的数据
  isShow?: ((formState: Pick<SchemaFormState<T>, 'formModel' | 'formItem'>) => boolean) | boolean; // 是否隐藏表单项
  prefixText?: ((formState: SchemaFormState<T>) => string | null) | (string | null); // 前置文本
  suffixText?: ((formState: SchemaFormState<T>) => string | null) | (string | null);
  placeholder?: string;
  help?: string;
  extra?: any;
  tips?: ((formState: SchemaFormState<T>) => string | string[]) | (string | string[]); // 表单项后面的问号提示
  __INIT_EVENTS__?: boolean;
}

export type FormItem<T extends Recordable = {}> = MergeExclusive<
  MergeExclusive<GetCombiFormItem<T, 'type'>, GetCombiFormItem<T, 'slotName'>>,
  GetCombiFormItem<T, 'component'>
>;
