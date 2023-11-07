<template>
  <n-spin :spinning="spinning">
    <div class="p-16px">
      <slot name="header" v-bind="{ currentSchema }"></slot>
      <n-collapse v-model:activeKey="activeKey" :bordered="false">
        <n-collapse-panel v-for="item in details" :key="item.name" :header="item.name">
          <n-descriptions :labelStyle="{ 'white-space': 'normal' }" class="px-16px">
            <template v-for="opt in item.options">
              <n-descriptions-item :label="opt.label">
                <template v-if="opt.isLov">
                  {{ formLovValues[opt.key] }}
                </template>
                <template v-else-if="opt?.columns">
                  <n-table
                    bordered
                    :dataSource="opt.dataSource"
                    :columns="opt.columns"
                    class="w-full mr-24px"
                    :pagination="false"
                  ></n-table>
                </template>
                <template v-else-if="opt.imgUrls">
                  <n-empty v-if="!opt?.imgUrls.length" description="暂无封面" />
                  <template v-else>
                    <n-image :width="200" v-for="src in opt?.imgUrls" :src="src" />
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
import type { SetUpGetInfoScheme } from '@/api/common/model';
import { matchReg } from '@/utils';
import type { TableColumnProps } from 'n-designv3';

type DetailsItem = {
  key: string;
  label: string;
  value: string;
  imgUrls?: string[];
  isLov?: boolean;
  dataSource?: any[];
  columns?: TableColumnProps[];
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
const getValueForLOV = async (code: string, field: string, val: string) => {
  requestCommonGetLOV({ code }).then((res) => {
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
        value: schema.values[child.field] as string,
      };

      if (child.lov?.code) {
        result.isLov = true;
        getValueForLOV(child.lov.code, child.field, result.value);
      }
      // 处理表格数据
      else if (child?.dataType?.toLowerCase() === 'table') {
        try {
          result.dataSource = JSON.parse(result.value);
          result.columns = child.props.lineAttribute?.map((col) => ({
            title: col.name,
            dataIndex: col.field,
          }));
        } catch (error) {
          console.log(error);
        }
      } else if (child.props.type == 'image') {
        result.imgUrls = matchReg(result.value, 'imgUrl');
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

const getDetailSchema = () => {
  spinning.value = true;
  requestCommonSetUpGetInfoDialog({
    className: getClassName.value,
    thisObj: {
      objId: (route.query.objId as string) || '',
      className: getClassName.value,
    },
  })
    .then((res) => {
      handleSchema(res.data.scheme);
    })
    .finally(() => {
      spinning.value = false;
    });
};
getDetailSchema();
</script>

<style scoped lang="less">
.nl-collapse-borderless {
  background: #fafafa;
}
</style>
