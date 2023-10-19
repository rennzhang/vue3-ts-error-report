import { requestCommonGetHistoryList, type HistoryRecord } from '@/api/common/index';
import { cloneDeep, omit } from 'lodash-es';
export type DataItem = {
  companyAddress?: string;
};

export const useTable = () => {
  const columns = [
    {
      title: '企业编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '版本记录',
      dataIndex: 'sequence',
      key: 'sequence',
    },
    {
      title: '修改人',
      dataIndex: 'displayModifier',
      key: 'displayModifier',
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: '20%',
    },
  ];
  const tableData = ref<DataItem[]>([]);
  const getList = async () => {
    const objId = window.$wujie?.props.params.record.objId;
    //'1704055851523801088'  '1714929505862160384'
    const data = await requestCommonGetHistoryList({
      className: 'CompanyItem',
      thisObj: {
        objId: objId,
      },
    });
    tableData.value = data.data;
  };
  getList();
  return {
    columns,
    tableData,
    getList,
  };
};
//比较版本之间的字段的差别
export const useDataCompare = (objArray: HistoryRecord[], labelData: Array<object>) => {
  if (objArray.length < 2) {
    return {
      comparColumns: [],
      comparData: [],
      comparDataSource: [],
    };
  }
  let columns = [
    {
      title: '版本',
      dataIndex: 'compareItem',
      key: 'compareItem',
      width: 110,
      fixed: true,
    },
  ];
  const commonKeys = findCommonKeys(objArray);
  let newObjArray = cloneDeep(objArray);
  const result = newObjArray.map((item) => {
    const newItem = omit(item, commonKeys);
    if (newItem.companyAddress) {
      const companyAddress = JSON.parse(newItem.companyAddress);
      if (companyAddress.length && Array.isArray(companyAddress)) {
        newItem.companyAddress = companyAddress.map((newItem) => newItem.rel_officialAddress).join();
      } else {
        newItem.companyAddress = '';
      }
    }

    return newItem;
  });
  //------------
  result.forEach((item: any) =>
    columns.push({
      title: item.sequence,
      dataIndex: `sequence_${item.sequence}`,
      key: 'sequence',
      width: 120,
      fixed: false,
    })
  );
  let compareItem = mapFields(result[0], labelData);
  const comparDataSource: any = compareItem.map((item) => {
    let newItem: {
      compareItem: any;
      [key: string]: any;
    } = {
      compareItem: item.name,
    };
    result.forEach((ite) => {
      Object.keys(ite).forEach((key) => {
        if (item.code === key) {
          newItem[`sequence_${ite.sequence}`] = (ite as any)[item.code];
        }
      });
    });
    return newItem;
  });
  return {
    comparColumns: columns,
    comparData: result,
    comparDataSource: comparDataSource,
  };
};
const mapFields = (sourceObject: Partial<HistoryRecord>, fieldMaps: any) => {
  let result: { code: string; name: string }[] = [];
  const newSourceObject = omit(sourceObject, [
    'tenantId',
    'owner',
    'originObjId',
    'objId',
    'sequence',
    'modifier',
    'creator',
    'companyParent',
    'addressNo',
    'checkedOut',
    'className',
    'lastUpdate',
    'superseded',
    'displayName',
  ]);
  fieldMaps.forEach((fieldMap: any) => {
    const { code } = fieldMap;
    if (newSourceObject.hasOwnProperty(code)) {
      result.push({
        code: fieldMap['code'],
        name: fieldMap['name'],
      });
    }
  });
  return result;
};
const findCommonKeys = (objects: any[]) => {
  let newObjects = objects.map((item, index) => {
    let newItem = cloneDeep(item);
    if (item.companyAddress && JSON.parse(item.companyAddress).length) {
      const companyAddress = JSON.parse(item.companyAddress);

      if (companyAddress.length && Array.isArray(companyAddress)) {
        newItem.companyAddress = companyAddress.map((item) => item.rel_officialAddress).join();
      } else {
        newItem.companyAddress = '';
      }
    }
    return newItem;
  });
  const commonKeys: Record<string, any> = {};
  // 遍历第一个对象的所有键
  Object.keys(newObjects[0]).forEach((key) => {
    // 检查所有对象中该键的值是否相同
    if (newObjects.every((obj: any) => obj[key] === newObjects[0][key])) {
      // 如果相同，将该键加入结果对象中
      commonKeys[key] = newObjects[0][key];
    }
  });
  // 将结果对象的键转化为数组
  return Object.keys(commonKeys);
};
