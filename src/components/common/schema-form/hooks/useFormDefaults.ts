export const getDefaultTipsPrefix = (type: FormItem['type']) => {
  switch (type) {
    case 'input':
    case 'inputNumber':
    case 'inputPassword':
    case 'switch':
    case 'textarea':
      return '请输入';
    case 'select':
    case 'selectSearch':
    case 'radio':
    case 'checkbox':
      return '请选择';
    default:
      return '请选择';
  }
};

export const getDefaultFormSchema = () => {
  return {
    showCancel: false,
    cancelText: '取消',
    showAction: true,
    actionText: '确定',
    isShow: true,
  };
};
