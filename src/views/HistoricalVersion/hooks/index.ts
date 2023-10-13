import { requestCommonGetHistoryList } from '@/api/common/index';
import { omit } from 'lodash-es';
interface DataItem {
  key: number;
  companyName: string;
  address: string;
  children?: DataItem[];
}
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
    const objId = window.$wujie.props.params.record.objId;
    const data = <any>await requestCommonGetHistoryList({
      className: 'CompanyItem',
      thisObj: {
        objId: '1704055851523801088',
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
export const useDataCompare = (objArray: any, labelData: any) => {
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
      width: 100,
      fixed: true,
    },
  ];
  // const commonValues = {};
  const commonValues = <any>{};
  const result = <any>[];
  // 找出所有对象中相同字段的共有值
  Object.keys(objArray[0]).forEach((key) => {
    const firstObjValue = objArray[0][key];
    if (objArray.every((obj) => obj[key] === firstObjValue)) {
      commonValues[key] = firstObjValue;
    }
  });
  // 遍历每个对象，只保留不是共有值的字段
  objArray.forEach((obj) => {
    const filteredObj = <any>{};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== commonValues[key]) {
        filteredObj[key] = obj[key];
      }
    });
    if (filteredObj['companyAddress']) {
      const address = JSON.parse(filteredObj['companyAddress']);
      filteredObj['companyAddress'] = address[0]?.rel_officialAddress;
    }
    result.push(filteredObj);
  });
  //
  result.forEach((item) =>
    columns.push({
      title: item.sequence,
      dataIndex: `sequence_${item.sequence}`,
      key: 'sequence',
      width: 120,
      fixed: false,
    })
  );
  let compareItem = mapFields(result[0], labelData.value);
  console.log(compareItem, 'compareItem');
  const comparDataSource = compareItem.map((item) => {
    let newItem = <any>{
      compareItem: item.name,
    };
    result.forEach((ite) => {
      Object.keys(ite).forEach((key) => {
        if (item.code === key) {
          newItem[`sequence_${ite.sequence}`] = ite[item.code];
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
const mapFields = (sourceObject: any, fieldMaps: any) => {
  let result = <any>[];
  const newSourceObject = omit(sourceObject, [
    'tenantId',
    // 'website',
    // 'taxNo',
    'owner',
    'originObjId',
    'objId',
    'sequence',
    'modifier',
    'creator',
    'companyParent',
    // 'companyParent',
    // 'accountHolder',
    'addressNo',
    'checkedOut',
    'className',
  ]);
  fieldMaps.forEach((fieldMap) => {
    const { code } = fieldMap;
    if (newSourceObject[code]) {
      result.push({
        code: fieldMap['code'],
        name: fieldMap['name'],
      });
    }
  });
  return result;
};
