<template>
  <div class="">
    <schema-form ref="schemaFormRef" :formSchema="formSchema" @submit="onSubmit" />
    <!-- <div>预览</div> -->
  </div>
</template>

<script lang="ts" setup>
import { message } from 'n-designv3';
import { requestCommonQueryLOVList, requestCommonUpdateLOVItem, requestCommonCreateLOVItem, LOVRecord } from '../api';
const schemaFormRef = ref<SchemaFormRef>();

const allLOVList = ref<(LOVRecord & OptionItem)[]>([]);

const getAllLOVList = () => {
  requestCommonQueryLOVList().then((res) => {
    allLOVList.value = res.data.data
      .filter((item) => item.container === 'NancalPlatform')
      .map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.code + '-' + item.objId,
        };
      });
  });
};
getAllLOVList();
const formSchema = reactive<FormSchema<any>>({
  formItem: [
    {
      field: 'type',
      type: 'radio',
      label: '操作类型',
      value: 'update',
      tips: '新增：新增一个LOV；\n 覆盖更新：该操作会覆盖原有的LOV内容',
      options: [
        {
          label: '新增',
          value: 'add',
        },
        {
          label: '覆盖更新',
          value: 'update',
        },
      ],
    },
    {
      field: 'existName',
      type: 'select',
      label: 'LOV 名称',
      options: allLOVList,
      events: {
        change({ formModel, rest }) {
          formModel.className = rest[0].className;
          formModel.code = rest[0].code;
          formModel.name = rest[0].name;
          formModel.objId = rest[0].objId;
          formModel.container = rest[0].container;
          console.log(rest[0]);
        },
      },
      isShow: ({ formModel }) => formModel.type === 'update',
    },

    {
      field: 'code',
      type: 'input',
      label: 'LOV编码',
      isShow: ({ formModel }) => formModel.type === 'add',
    },
    {
      field: 'name',
      type: 'input',
      label: 'LOV名称',
      isShow: ({ formModel }) => formModel.type === 'add',
    },
    // {
    //   field: 'className',
    //   type: 'input',
    //   label: '类名',
    // },
    {
      field: 'content',
      type: 'textarea',
      label: '填充内容',
      placeholder: '例如：\n 选项1、选项2、选项3',
    },
    {
      field: 'splitSymbol',
      type: 'input',
      label: '截断字符',
      value: '、',
    },
    // {
    //   field: 'innerPrefix',
    //   type: 'input',
    //   label: '内部值前缀',
    //   tips: "默认使用【自然数】作为内部值，从【1】开始递增；可以设置前缀，生成结果为：'前缀1'、'前缀2'",
    //   required: false,
    // },
  ],
  required: true,
  // showAction: false,
  formData: {},
});

const getStaticLovValues = (content: string, splitSymbol: string) => {
  const contentArr = content.split(splitSymbol || '、');
  const res: any[] = [];
  for (let i = 0; i < contentArr.length; i++) {
    res.push({
      objId: '',
      sort: i + 1,
      // internalValue: i + 1,
      internalValue: contentArr[i],
      externalValue: contentArr[i],
    });
  }

  return res;
};
/** @description  */
const onSubmit = async () => {
  await schemaFormRef.value?.validate();
  const { content, splitSymbol, objId, name, code, container, type } = schemaFormRef.value?.formModel;
  console.log(schemaFormRef.value?.formModel);

  if (type == 'update') {
    const params = {
      className: 'LovDef',
      thisObj: {
        objId: objId,
        code,
        name,
        lovType: 1,
        isGlobal: 0,
        container,
        prefix: null,
        staticLovValues: getStaticLovValues(content, splitSymbol),
      },
    };
    requestCommonUpdateLOVItem(params).then((res) => {
      console.log(res);
      if (res.mfail == '0') {
        message.success('覆盖成功');
      } else {
        message.error('覆盖失败');
      }
    });
  } else {
    const params = {
      className: 'LovDef',
      thisObj: {
        objId: '',
        code,
        name,
        lovType: 1,
        isGlobal: 0,
        prefix: null,
        container: 'NancalPlatform',
        staticLovValues: getStaticLovValues(content, splitSymbol),
      },
    };
    requestCommonCreateLOVItem(params).then((res) => {
      console.log(res);
      if (res.mfail == '0') {
        message.success('新建成功');
      } else {
        message.error('新建失败');
      }
    });
  }

  // const { formModel } = schemaFormRef.value;
  // const { type, existName, code, name, content, truncateCharacters } = formModel;
  // const params = {
  //   container: 'NancalPlatform',
  //   type,
  //   existName: existName?.split('-')[0],
  //   code,
  //   name,
  //   content,
  //   truncateCharacters,
  // };
  // console.log(params);
};
</script>

<style scoped lang="less"></style>
