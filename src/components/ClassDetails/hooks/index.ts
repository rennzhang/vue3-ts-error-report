import { SetUpGetInfoScheme, requestCommonSetUpGetInfoDialog } from '@/api/common';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { DetailsItem } from '../types';
import CompMap from '../components';
import { useDetailsStore } from '../store';
type DetailsGroupRecord = {
  name: string;
  options: DetailsItem[];
};

type IProps = {
  className?: string;
};

export const useDetails = <T extends Record<string, any> = any>(props?: IProps) => {
  const route = useRoute();
  const store = useDetailsStore();

  const spinning = ref(false);

  const currentSchema = ref<SetUpGetInfoScheme<T>>();
  const detailsGroup = ref<DetailsGroupRecord[]>([]);
  const detailsList = ref<DetailsItem[]>([]);

  const getClassName = computed(() => props?.className || (route.query.className as string));

  const handleSchema = (schema: SetUpGetInfoScheme<T>, objId?: string) => {
    currentSchema.value = schema;
    detailsGroup.value = [];
    detailsList.value = [];
    schema.form.forEach((item) => {
      const options = item.children.map((child) => {
        const result: DetailsItem = {
          key: child.field,
          label: child.name,
          value: schema.values[child.field],
          fullLine: false,
          type: 'Text',
        };

        const typeMap: Recordable = {
          IMAGE: 'Image',
          FILE: 'File',
        };

        result.type = typeMap[child.props.type.toLocaleUpperCase()] || 'Text';
        result.fullLine = ['image', 'file', 'table'].includes(result.type.toLocaleLowerCase());

        if (child.isLov && result.value) {
          result.isLov = true;
          store.queryLovOptions(child.lov!, child.field, result.value);
        } else if (['RELATION_TABLE', 'TABLE'].includes(child?.dataType)) {
          // 处理表格数据
          result.type = 'Table';
          // 关联表格
          result.otherClassCode = child.props?.otherClassCode;

          result.columns = result.otherClassCode ? [{ dataIndex: 'action', width: 30 }] : [];

          // 处理表格列
          const handelColumns =
            child.props.lineAttribute?.map((col) => {
              col.lov?.code && store.queryLovOptions(col.lov!, col.field, result.value as string);
              return {
                ...col,
                title: col.name,
                dataIndex: col.field,
              };
            }) || [];

          result.columns = [...result.columns, ...handelColumns];
        }

        result.component = markRaw(CompMap[result.type]);
        return result;
      });

      detailsGroup.value.push({
        name: item.groupName,
        options,
      });

      detailsList.value.push(...options);
    });
    objId && store.setHistoryDetailsMap(objId, detailsList.value);
    return unref(detailsList);
  };

  const queryDetailSchema = async (params?: { className: string; objId: string }) => {
    spinning.value = true;

    // 从store中获取缓存
    if (params?.objId && store.detailsMap[params?.objId]) {
      spinning.value = false;
      return store.detailsMap[params?.objId];
    }

    let _params = {
      className: getClassName.value,
      thisObj: window.$wujie?.props?.params?.record || {
        objId: (route.query.objId as string) || '',
        className: getClassName.value,
      },
    };

    if (params?.objId) {
      _params.className = params.className || getClassName.value;
      _params.thisObj = {
        objId: params.objId,
        className: params.className,
      };
    }

    // 个别的详情页需要调用不同的接口，例如排行榜中调用的是 LeaderboardSetUpGetInfoDialog 二开接口
    const methodsMap: Recordable = {
      LeaderboardItem: 'LeaderboardSetUpGetInfoDialog',
    };

    const res = await requestCommonSetUpGetInfoDialog(_params, methodsMap[getClassName.value]);
    spinning.value = false;
    const _detailsList = handleSchema(res?.data?.scheme, params?.objId);
    return _detailsList;
  };

  return {
    spinning,
    currentSchema,
    detailsList,
    detailsGroup,
    getClassName,
    queryDetailSchema,
  };
};
