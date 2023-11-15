<template>
  <GvUrlDrawer @ok="onSubmit">
    <schema-form ref="schemaFormRef" :form-schema="formSchema" />
  </GvUrlDrawer>
</template>

<script lang="ts" setup>
import { AddExistCustomersParams, addExistCustomers } from '@/api/Activity';
import { requestCommonGetLOV } from '@/api/common';

const route = useRoute();
const schemaFormRef = ref<SchemaFormRef>();
const formSchema = reactive<FormSchema>({
  formItem: [
    {
      field: 'id',
      type: 'select',
      label: '客户名称',
      asyncOptions: () =>
        requestCommonGetLOV({
          code: route.query.LOVCode as string,
          thisObj: {},
        }).then((res) => {
          return res?.data?.details?.map((item) => {
            return {
              ...item,
              label: item.externalValue,
              value: item.internalValue,
            };
          });
        }),
    },
  ],
  required: true,
  showAction: false,
  formItemLayout: {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  },
});
const onSubmit = async () => {
  const data = await schemaFormRef.value?.validate();
  const { record } = window.$wujie?.props.params || {};
  const { className, userId, tenantId } = route.query as Recordable;
  const params: AddExistCustomersParams = {
    className: className,
    thisObj: {
      tenantId,
      userId,
      leftId: record.objId,
      rightId: data.id,
    },
  };
  addExistCustomers(params).then((res) => {
    if (res?.mfail == '0') {
      window?.postTileMsg({ type: 'refreshList' });
      window.gvUtil.success('添加成功');
      setTimeout(() => {
        window?.postTileMsg({ type: 'closePop' });
      }, 400);
    }
  });
};
</script>

<style scoped lang="less"></style>
