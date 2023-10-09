export const useFormLayout = ({ formSchema, getterProps }: SchemaFormCompState) => {
  // 表单布局
  const formItemLayout = reactive({
    labelCol: { sm: { span: 5 }, xs: { span: 24 } },
    wrapperCol: { sm: { span: 17 }, xs: { span: 24 } },
    ...unref(formSchema).formItemLayout,
  });
  const getOperateLayout = () => {
    const { formItemLayout } = unref(getterProps).formSchema;
    const xs = { span: 24 };
    const layout = {
      sm: {
        span: (formItemLayout as any)?.wrapperCol?.sm?.span || 17,
        offset: (formItemLayout as any)?.labelCol?.sm?.span || 5,
      },
      xs,
    };
    return layout;
  };

  return {
    formItemLayout,
    getOperateLayout,
  };
};
