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
    //'1704055851523801088'  ---'1714929505862160384, ---1714929505862160384'
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
  const commonKeys = findCommonKeys(objArray);
  let newObjArray = cloneDeep(objArray);
  const result = newObjArray.map((item) => {
    const newItem = omit(item, commonKeys);
    if (item.companyLogo && JSON.parse(item.companyLogo).length) {
      //暂时只处理一张图片
      newItem.companyLogo = JSON.parse(item.companyLogo)[0].url;
    }
    if (newItem.companyAddress) {
      const companyAddress = JSON.parse(newItem.companyAddress);
      if (companyAddress.length && Array.isArray(companyAddress)) {
        newItem.companyAddress = companyAddress.map((newItem) => newItem.rel_officialAddress).join();
      } else {
        newItem.companyAddress = '';
      }
      // console.log(item, 'item');
      // if (matchReg(item.companyLogo, 'url')) {
      //   newItem['isImg'] = matchReg(item.companyLogo);
      //   console.log(newItem, 'neewItem');
      // }
    }
    return newItem;
  });
  //------------
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
    Object.keys(newItem).forEach((key, index) => {});
    return newItem;
  });
  const computeColunmsWidth = () => {
    let width = 110;
    let strNum = comparDataSource.map((item) => {
      return item.compareItem.length;
    });
    let maxLength = Math.max(...strNum);
    if (maxLength >= 2 && maxLength <= 4) {
      width = 100;
    } else if (maxLength > 4 && maxLength <= 6) {
      width = 110;
    } else {
      width = 150;
    }
    return width;
  };
  let columns = [
    {
      title: '版本',
      dataIndex: 'compareItem',
      key: 'compareItem',
      fixed: true,
      width: computeColunmsWidth(),
    },
  ];
  result.forEach((item: any) =>
    columns.push({
      title: item.sequence,
      dataIndex: `sequence_${item.sequence}`,
      key: 'sequence',
      width: 120,
      fixed: false,
    })
  );
  const newComparDataSource = comparDataSource.map((item, index) => {
    const newItem = cloneDeep(item);
    Object.keys(item).forEach((key, ind) => {
      //console.log(item[key], 'item[key]');
      if (regImg(item[key])) {
        newItem.isImg = item[key];
      }
    });
    return newItem;
  });

  return {
    comparColumns: columns,
    comparData: result,
    comparDataSource: newComparDataSource,
  };
};
const regImg = (url) => {
  const reg = /https?:\/\/.*?\.(png|jpg|jpeg|gif|bmp|svg|tiff|webp)/gi;
  if (reg.test(url)) {
    return true;
  } else {
    return false;
  }
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
  const specialField = {
    //后端字段值有返回null、undfined 与'',这样比较会出问题，所以 给这些特殊设置同意一个值
    '': '',
    null: '',
    undefined: '',
  };
  let newObjects = objects.map((item) => {
    let newItem = cloneDeep(item);
    Object.keys(item).forEach((key) => {
      //后端字段值有返回null、undfined 与'',这样比较会出问题，所以 给这些特殊设置同意一个值
      if (specialField.hasOwnProperty(item[key])) {
        newItem[key] = '';
      }
    });
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
