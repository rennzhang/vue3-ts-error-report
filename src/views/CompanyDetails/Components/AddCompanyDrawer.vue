<template>
  <n-drawer title="添加企业" v-model:visible="showAddDrawer" width="40%">
    <!-- <div class="select-body" ref="selectBodyRef"> -->
    <schema-form ref="schemaFormRef" :formSchema="formSchema" v-if="showAddDrawer" />
    <!-- </div> -->
    <template #footer>
      <div class="flex justify-end">
        <n-button style="margin-right: 8px" @click="showAddDrawer = false">取消</n-button>
        <n-button type="primary" @click="onAdd">确定</n-button>
      </div>
    </template>
  </n-drawer>
</template>

<script lang="ts" setup>
import { insertCompanyTree, type GroupCompanyRecord, validateInsertCompanyTreePre } from '@/api/GroupStructure';
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
const selectBodyRef = ref<HTMLDivElement>();
const schemaFormRef = ref<SchemaFormRef<FormData>>();

const formSchema = reactive<FormSchema<FormData>>({
  formItem: [
    {
      field: 'companyCode',
      type: 'selectSearch',
      label: '搜索公司',
      // props: {
      //   getPopupContainer: () => selectBodyRef.value,
      // },
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
  if (!record) parentRecord.value = window?.$wujie?.props?.params?.record;
  else parentRecord.value = record;
  showAddDrawer.value = true;
};

const onAdd = async () => {
  const { user } = window?.$wujie?.props || {};

  const formData = await schemaFormRef.value?.validate();

  const parentCompanyCode = parentRecord.value?.companyCode || parentRecord.value?.code;
  const insertCompanyParams = {
    className: 'CompanyItemRelation',
    thisObj: {
      companyCode: formData!.companyCode,
      // 如果是顶级企业，parentId 为 0
      parentId: formData!.companyCode == parentCompanyCode ? '0' : parentRecord.value!.objId,
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

<style scoped lang="less"></style>
