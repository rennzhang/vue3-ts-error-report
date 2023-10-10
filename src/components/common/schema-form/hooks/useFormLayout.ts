export const useFormLayout = ({ props, getProps }: any) => {
  // 表单布局
  const formItemLayout = reactive({
    labelCol: { sm: { span: 5 }, xs: { span: 24 } },
    wrapperCol: { sm: { span: 17 }, xs: { span: 24 } },
    ...props.formSchema.formItemLayout
  });
  const getOperateLayout = () => {
    const { formItemLayout } = unref(getProps).formSchema;
    const xs = { span: 24 };
    const layout = {
      sm: {
        span: formItemLayout?.wrapper?.sm?.span || 17,
        offset: formItemLayout?.labelCol?.sm?.span || 5
      },
      xs
    };
    return layout;
  };

  return {
    formItemLayout,
    getOperateLayout
  };
};
