import { cloneDeep, omit } from 'lodash-es';
export const useTable = (selectData: any, labelData: any) => {
  /* 
    1. 组建动态表头
    2. 组装表头对应的dataSource
 */
  //dataSource
  const data = filterCommonKey(selectData);
  const dataSource = HandleSpecialValues(data);
  //动态表头
  const keyName = getKeyLable(dataSource[0], labelData);

  let columns = [
    {
      title: '版本',
      dataIndex: 'compareItem',
      key: 'compareItem',
      fixed: true,
      width: 120,
    },
  ];
  selectData.forEach((item: any) =>
    columns.push({
      title: item.sequence,
      dataIndex: `sequence_${item.sequence}`,
      key: 'sequence',
      width: 120,
      fixed: false,
    })
  );
  const comparDataSource: any = keyName.map((item) => {
    let newItem: {
      compareItem: any;
      [key: string]: any;
    } = {
      compareItem: item.name,
    };
    dataSource.forEach((ite: any) => {
      Object.keys(ite).forEach((key) => {
        if (item.code === key) {
          newItem[`sequence_${ite.sequence}`] = (ite as any)[item.code];
        }
      });
    });
    return newItem;
  });
  return {
    column: columns,
    dataSource: comparDataSource,
  };
};
const filterCommonKey = (data: any) => {
  /*
    1. 筛选出值一样的key，并且过滤掉
    data：历史列表选中的值
 */
  const commonKeys: Record<string, any> = {};
  // 遍历第一个对象的所有键
  Object.keys(data[0]).forEach((key) => {
    // 检查所有对象中该键的值是否相同
    if (data.every((obj: any) => obj[key] === data[0][key])) {
      // 如果相同，将该键加入结果对象中
      commonKeys[key] = data[0][key];
    }
  });
  // 找到值一样的key，进行过滤
  const newData = data.map((item: any) => {
    const newItem = omit(item, Object.keys(commonKeys));
    return newItem;
  });
  //去除无用字段
  return newData;
};
const getKeyLable = (sourceObject: any, labelData: any) => {
  /*
      1. 获取字段里面key对应的 中文label
   */
  let result: { code: string; name: string }[] = [];
  labelData.forEach((fieldMap: any) => {
    const { code } = fieldMap;
    if (sourceObject.hasOwnProperty(code)) {
      result.push({
        code: fieldMap['code'],
        name: fieldMap['name'],
      });
    }
  });
  return result;
};
const HandleSpecialValues = (data: any) => {
  /*
    1. 处理特殊字段值，例如有些字段不是字符串，而是JSON。需要解析并展示字符串,
    2. 去除自定义字段
    */
  const dataSource = data.map((item: any) => {
    const newItem = omit(item, [
      'tenantId',
      'owner',
      'originObjId',
      'objId',
      //   'sequence',
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
    return newItem;
  });
  return dataSource;
};
