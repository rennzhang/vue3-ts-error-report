import { cloneDeep, omit } from 'lodash-es';
import { matchReg } from '@/utils';
export const useTable = (selectData: any, labelData: any, useNameData: any) => {
  /* 
    1. 组建动态表头
    2. 组装表头对应的dataSource
 */
  //dataSource
  if (selectData.length < 2) {
    return selectData;
  }
  let newSelectData = activityPersonnel(selectData, useNameData);
  const data = HandleSpecialValues(newSelectData);
  const dataSource = filterCommonKey(data);
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
  const newComparDataSource = comparDataSource.map((item) => {
    const newItem = cloneDeep(item);
    Object.keys(item).forEach((key) => {
      if (Array.isArray(item[key]) && typeof item[key][0] === 'string') {
        newItem['isImg'] = true;
      }
      if (Array.isArray(item[key]) && item[key][0] instanceof Object) {
        newItem['isFile'] = true;
      }
    });
    return newItem;
  });
  const tableDataSource = newComparDataSource.filter((item) => {
    return item.compareItem !== '版次';
  });
  return {
    column: columns,
    dataSource: tableDataSource,
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
  const specialField = {
    //后端字段值有返回null、undfined 与'',这样比较会出问题，所以 给这些特殊设置同意一个值
    '': '',
    null: '',
    undefined: '',
  };
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
      'activityAnnex',
      'displayCreator',
      'createAt',
    ]);
    //对公司地址进行处理
    if (item.companyAddress && JSON.parse(item.companyAddress).length) {
      const companyAddress = JSON.parse(item.companyAddress);
      if (companyAddress.length && Array.isArray(companyAddress)) {
        newItem.companyAddress = companyAddress.map((item) => item.rel_officialAddress).join();
      } else {
        newItem.companyAddress = '';
      }
    } else {
      newItem.companyAddress = '';
    }
    //对特殊字段进行处理
    Object.keys(item).forEach((key) => {
      //后端字段值有返回null、undfined 与'',这样比较会出问题，所以 给这些特殊设置同意一个值
      if (specialField.hasOwnProperty(item[key])) {
        newItem[key] = '';
      }
    });
    //企业logo && 图片
    if (item.activityPictures && JSON.parse(item.activityPictures).length) {
      //暂时只处理一张图片
      newItem.activityPictures = matchReg(item.activityPictures, 'imgUrl');
    }
    //活动成员
    if (item.activityMembers && JSON.parse(item.activityMembers).length) {
      const activityMembers = JSON.parse(item.activityMembers);
      if (activityMembers.length && Array.isArray(activityMembers)) {
        newItem.activityMembers = activityMembers.map((item) => item.name).join();
      } else {
        newItem.activityMembers = '';
      }
    } else {
      newItem.activityMembers = '';
    }
    //活动成员
    if (item.activityAnnex && JSON.parse(item.activityAnnex)) {
      newItem.activityAnnex = JSON.parse(item.activityAnnex);
    }
    return newItem;
  });
  return dataSource;
};
const computeColunmsWidth = (comparDataSource: any) => {
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
//活动人员单独处理
const activityPersonnel = (dataSource, useName) => {
  let data = dataSource.map((item) => {
    const newItem = cloneDeep(item);
    const activityMembers = JSON.parse(item.activityMembers);
    if (activityMembers && activityMembers.length) {
      let membersDataId = activityMembers.map((members) => {
        return members.rel_activityPersonnel;
      });
      const result = membersDataId.map((id) => ({ name: useName.find((user) => user.objId === id).externalValue }));
      newItem.activityMembers = JSON.stringify(result); // 因为 后面有处理，这里转成字符串先，有些多余，以后在改
    }
    return newItem;
  });
  return data;
};
