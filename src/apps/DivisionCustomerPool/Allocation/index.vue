<template>
  <GvUrlDrawer @ok="onSubmit">
    <schema-form ref="schemaFormRef" :form-schema="formSchema" />
  </GvUrlDrawer>
</template>

<script lang="ts" setup>
import { DivisionAllocation, DivisionAllocationParams } from '@/api/CompanyItem';
import { requestCommonGetLOV } from '@/api/common';

const route = useRoute();
const schemaFormRef = ref<SchemaFormRef>();
const formSchema = reactive<FormSchema>({
  formItem: [
    {
      field: 'id',
      type: 'select',
      label: '销售姓名',
      asyncOptions: () =>
        requestCommonGetLOV({
          code: (route.query.LOVCode as string) || 'curDeptUserList',
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
  const { parentSelectedRows } = window.$wujie?.props.params || {};
  const params: DivisionAllocationParams = {
    className: 'CompanyItem',
    thisObj: {
      objIdList: parentSelectedRows?.map((item) => item.objId as string),
      salesPersonId: data.id,
    },
  };
  if (!params.thisObj.objIdList?.length) {
    window.gvUtil.error('请勾选客户');
    return;
  }

  DivisionAllocation(params)
    .then((res) => {
      if (res?.mfail == '0') {
        window.gvUtil.success('分配成功');
      }
    })
    .finally(() => {
      setTimeout(() => {
        window?.postTileMsg({ type: 'closePop' });
        window?.postTileMsg({ type: 'refreshList' });
      }, 400);
    });
};
</script>

<style scoped lang="less"></style>
