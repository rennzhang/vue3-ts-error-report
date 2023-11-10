<template>
  <n-spin :spinning="spinning" class="!h-95vh">
    <div class="p-16px">
      <slot name="header" v-bind="{ currentSchema }"></slot>
      <n-collapse v-model:activeKey="activeKey" :bordered="false" class="!bg-white">
        <n-collapse-panel v-for="item in details" :key="item.name" :header="item.name">
          <n-descriptions :labelStyle="{ 'white-space': 'normal' }" class="pt-16px px-12px">
            <template v-for="opt in item.options">
              <n-descriptions-item :label="opt.label" :style="{ display: opt.fullLine ? 'block' : '' }">
                <template v-if="opt.isLov">
                  {{ formLovValues[opt.key] || opt.value }}
                </template>
                <template v-else-if="opt?.type === 'table'">
                  <n-table
                    bordered
                    :dataSource="opt.dataSource"
                    :columns="opt.columns"
                    class="w-full mr-24px"
                    :pagination="false"
                  >
                    <template #bodyCell="{ column, value, record }">
                      <template v-if="column.lov"> {{ formLovValues[column.dataIndex] || value }}</template>
                      <template v-if="column.dataIndex === 'code'">
                        <n-button
                          type="link"
                          class="!p-0"
                          @click="viewDetailsForId(record, opt.otherClassCode as string)"
                          >{{ value }}</n-button
                        >
                      </template>
                    </template>
                  </n-table>
                </template>
                <template v-else-if="opt.type === 'image'">
                  <n-empty v-if="!opt?.imgUrls?.length" description="暂无封面" />
                  <template v-else>
                    <n-image :width="200" v-for="src in opt?.imgUrls" :src="src" />
                  </template>
                </template>
                <template v-else-if="opt.type === 'file'">
                  <n-empty v-if="!opt?.fileList?.length" description="暂无文件" />
                  <template v-else>
                    <div>
                      <div v-for="file in opt?.fileList" class="mb-4px">
                        <file-outlined />
                        <a
                          :key="file.uid"
                          target="_blank"
                          class="mx-8px"
                          @click="downloadFileForUrl(file.url, file.name)"
                        >
                          {{ file.name }}
                        </a>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  {{ opt.value }}
                </template>
              </n-descriptions-item>
            </template>
          </n-descriptions>
        </n-collapse-panel>
      </n-collapse>
      <slot name="footer" v-bind="{ currentSchema }"></slot>
    </div>
  </n-spin>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { requestCommonSetUpGetInfoDialog, requestCommonGetLOV } from '@/api/common';
import type { LOVParams, SetUpGetInfoScheme, DetailsFile, SetUpGetInfoParams } from '@/api/common/model';
import { matchReg, downloadFileForUrl } from '@/utils';
import type { TableColumnProps } from 'n-designv3';

type DetailsItem = {
  key: string;
  type: 'text' | 'image' | 'file' | 'table' | 'relationTable' | string;
  label: string;
  value: string | null;
  imgUrls?: string[];
  isLov?: boolean;
  dataSource?: any[];
  columns?: TableColumnProps[];
  fullLine?: boolean; // 是否占满一行
  fileList?: DetailsFile[];
  otherClassCode?: string; // 关联类名
};

type DetailsGroupRecord = {
  name: string;
  options: DetailsItem[];
};

const props = defineProps<{
  className?: string;
}>();

const spinning = ref(false);
const route = useRoute();
const getClassName = computed(() => props.className || (route.query.className as string));

const details = ref<DetailsGroupRecord[]>([]);
const activeKey = ref<string[]>([]);
const currentSchema = ref<SetUpGetInfoScheme<T>>();
const formLovValues = reactive<Recordable>({});

const getValueForLOV = async (lov: LOVParams, field: string, val: string | null) => {
  if (!val) return;
  requestCommonGetLOV(lov).then((res) => {
    formLovValues[field] = res.data.details.find((c) => c.internalValue == val)?.externalValue;
  });
};

const handleSchema = (schema: SetUpGetInfoScheme<T>) => {
  currentSchema.value = schema;
  details.value = [];
  schema.form.forEach((item) => {
    const options = item.children.map((child) => {
      const result: DetailsItem = {
        key: child.field,
        label: child.name,
        value: schema.values[child.field],
        fullLine: false,
        type: 'text',
      };

      if (child.isLov) {
        result.isLov = true;
        getValueForLOV(child.lov!, child.field, result.value);
      }
      // 处理表格数据
      else if (['RELATION_TABLE', 'TABLE'].includes(child?.dataType)) {
        result.fullLine = true;
        result.type = 'table';

        result.otherClassCode = child.props.otherClassCode;
        result.columns = child.props.lineAttribute?.map((col, index) => {
          if (col.lov?.code) {
            getValueForLOV(col.lov, col.field, result.dataSource?.[index]?.[col.field]);
          }
          console.log(' col', col);
          return {
            ...col,
            title: col.name,
            dataIndex: col.field,
          };
        });
        if (child?.dataType == 'TABLE') {
          try {
            result.dataSource = JSON.parse(result.value || '[]');
          } catch (error) {
            console.log(error);
          }
        } else {
          result.dataSource = (result.value as any)?.data || [];
        }

        //
      } else if (child.props.type == 'image') {
        result.fullLine = true;
        result.type = 'image';
        result.imgUrls = matchReg(result.value, 'imgUrl');
      } else if (child.props.type == 'file') {
        result.fullLine = true;
        result.type = 'file';
        try {
          result.fileList = JSON.parse(result.value || '[]');
        } catch (error) {
          result.fileList = [];
        }
      }

      return result;
    });

    details.value.push({
      name: item.groupName,
      options,
    });

    activeKey.value.push(item.groupName);
  });
};

const queryDetailSchema = async (params: SetUpGetInfoParams) => {
  spinning.value = true;
  const res = await requestCommonSetUpGetInfoDialog(params);
  spinning.value = false;
  return res?.data?.scheme || null;
};

const initPage = async () => {
  const params = {
    className: getClassName.value,
    thisObj: window.$wujie?.props?.params?.record || {
      objId: (route.query.objId as string) || '',
      className: getClassName.value,
    },
  };

  const scheme = await queryDetailSchema(params);
  handleSchema(scheme);
};

onMounted(async () => {
  initPage();
});

const viewDetailsForId = async (record: Recordable, otherClassCode: string) => {
  if (!otherClassCode || !record.objId) return;
  const scheme = await queryDetailSchema({ className: otherClassCode, thisObj: { objId: record.objId } });
  window?.gvUtil.h(scheme);
};
</script>

<style scoped lang="less"></style>
