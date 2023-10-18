<template>
  <n-modal title="添加企业" v-model:visible="showAddDrawer" width="40%">
    <schema-form ref="schemaFormRef" :formSchema="formSchema" v-if="showAddDrawer" />
    <template #footer>
      <div class="flex justify-end">
        <n-button style="margin-right: 8px" @click="showAddDrawer = false">取消</n-button>
        <n-button type="primary" @click="onAdd">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  insertCompanyTree,
  type GroupCompanyRecord,
  validateInsertCompanyTreePre,
  type ValidateCompanyParams,
} from '@/api/GroupStructure';
import { requestCommonQueryAgent } from '@/api/common';
import { message } from 'n-designv3';
type FormData = {
  companyCode: string;
};

const emit = defineEmits<{
  (event: 'refresh'): void;
}>();
const ready = ref(false);
onMounted(() => {
  ready.value = true;
});
const showAddDrawer = ref(false);
const schemaFormRef = ref<SchemaFormRef<FormData>>();

const formSchema = reactive<FormSchema<FormData>>({
  formItem: [
    {
      field: 'companyCode',
      type: 'selectSearch',
      label: '搜索公司',
      searchRequest: async (value) => {
        return requestCommonQueryAgent({
          queryArgs: {
            condition: [{ key: 'companyName', value: value, compare: 'LIKE' }],
            page: { pageNo: 1, pageSize: 9999 },
            sort: { sortBy: 'createAt', sortOrder: 'desc' },
            attrSet: [
              'code',
              'companyName',
              'companyAlias',
              'companyLevel',
              'companyCategory',
              'companyProperty',
              'companyMarket',
              'companyParent',
              'companyCeditNo',
              'displayCreator',
              'displayModifier',
              'objId',
              'className',
            ],
          },
          condition: { companyName: value },
          className: 'CompanyItem',
        }).then((res) => {
          return (
            res?.data?.data?.map((item: any) => ({
              label: item.companyName,
              value: item.code,
              ...item,
            })) || []
          );
        });
      },
    },
  ],
  required: true,
  showAction: false,
  formData: {},
});

const parentRecord = ref<GroupCompanyRecord>();

const openDrawer = (record?: GroupCompanyRecord) => {
  parentRecord.value = record;
  showAddDrawer.value = true;
};

const onAdd = async () => {
  const { user } = window?.$wujie?.props || {};

  const formData = await schemaFormRef.value?.validate();

  const insertCompanyParams: ValidateCompanyParams = {
    className: 'CompanyItemRelation',
    thisObj: {
      companyCode: formData!.companyCode,
      curCompanyCode: window?.$wujie?.props?.params?.record.code,
      parentId: parentRecord.value?.objId || '0',
      userId: user!.userId,
    },
  };
  const validateRes = await validateInsertCompanyTreePre(insertCompanyParams);

  if (validateRes.mfail !== '0') return;
  insertCompanyTree(insertCompanyParams).then((res) => {
    if (res.mfail === '0') {
      message.success('添加成功');
      showAddDrawer.value = false;
      emit('refresh');
    }
  });
};

defineExpose({
  openDrawer,
  showAddDrawer,
});
</script>

<style scoped lang="less">
.select-encase-body-123 {
  margin-top: 56px;
}
</style>
