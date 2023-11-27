import type { TableColumnProps } from 'n-designv3';
import type { DetailsFile } from '@/api/common/model';
import { Component } from 'vue';
export type DetailsItem = {
  key: string;
  type: 'text' | 'image' | 'file' | 'table' | 'relationTable' | string;
  label: string;
  value?: string;
  imgUrls?: string[];
  imgWidth?: number; // 图片宽度
  isLov?: boolean;
  dataSource?: any[];
  columns?: TableColumnProps[];
  fullLine?: boolean; // 是否占满一行
  fileList?: DetailsFile[];
  otherClassCode?: string; // 关联类名
  component?: Component;
};
