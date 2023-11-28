import type { TableColumnProps } from 'n-designv3';
import { Component } from 'vue';
export type DetailsItem = {
  key: string;
  type: 'Text' | 'Image' | 'File' | 'Table';
  label: string;
  value?: string;
  imgWidth?: number; // 图片宽度
  isLov?: boolean;
  columns?: TableColumnProps[];
  fullLine?: boolean; // 是否占满一行
  otherClassCode?: string; // 关联类名
  component?: Component;
};
