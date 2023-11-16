<template>
  <GvUrlDrawer @ok="onSubmit">
    <schema-form ref="schemaFormRef" :form-schema="formSchema" />
  </GvUrlDrawer>
</template>

<script lang="ts" setup>
import { GroupAllocation, GroupAllocationParams } from '@/api/CompanyItem';
import { requestCommonGetLOV } from '@/api/common';

const route = useRoute();
const schemaFormRef = ref<SchemaFormRef>();
const formSchema = reactive<FormSchema>({
  formItem: [
    {
      field: 'deptId',
      type: 'select',
      label: '事业部名称',
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
  const { parentSelectedRows } = window.$wujie?.props.params || {};
  const params: GroupAllocationParams = {
    className: 'CompanyItem',
    thisObj: {
      objIdList: parentSelectedRows?.map((item) => item.objId as string),
      deptId: data.deptId,
    },
  };
  if (!params.thisObj.objIdList?.length) {
    window.gvUtil.error('请勾选客户');
    return;
  }

  GroupAllocation(params).then((res) => {
    if (res?.mfail == '0') {
      window.gvUtil.success('分配成功');
      setTimeout(() => {
        // window?.postTileMsg({ type: 'refreshList' });
        window?.postTileMsg({ type: 'refreshList', data: { customPoolType: 1 } });
        window?.postTileMsg({ type: 'closePop' });
      }, 400);
    }
  });
};
</script>

<style scoped lang="less"></style>
