export interface SetUpGetInfoParams {
  className: string;
  thisObj: ThisObj;
}

export interface HistoryRecord {
  accountHolder?: string;
  checkedOut: number;
  checkedOutOwner?: string;
  className: string;
  code: string;
  companyAddress: string;
  companyAlias?: string;
  companyArea?: string;
  companyBusiness?: string;
  companyCategory: string;
  companyCity?: string;
  companyHoldingRatio?: string;
  companyLegalPerson?: string;
  companyLevel: string;
  companyMarket?: string;
  companyName: string;
  companyNational?: string;
  companyParent?: string;
  companyProperty?: string;
  container?: any;
  createAt: string;
  creator: string;
  customSource?: string;
  firstIndustry?: string;
  industryLabel?: string;
  isGlobal: number;
  lastUpdate: string;
  lcmStatus?: any;
  lifeCycleState: string;
  mainBusiness?: string;
  modifier: string;
  name?: any;
  objId: string;
  openBank?: string;
  openBankAccount?: string;
  originObjId: string;
  owner: string;
  postalCode?: string;
  project?: any;
  recycled: string;
  registeredAddress?: string;
  registeredCapital?: string;
  remark?: any;
  secondIndustry?: string;
  sequence: number;
  submitter?: any;
  superseded: number;
  taxNo?: string;
  telephone?: string;
  tenantId: string;
  website?: string;
  companyCeditNo?: string;
  officialAddress?: any;
  addressNo?: any;
  displayName: string;
  displayClassName: string;
  displayCreator: string;
  parentName?: string;
  displayModifier: string;
  displaySubmitter?: any;
}
interface ThisObj {
  objId: string;
  className: string;
  code?: string;
  companyName?: string;
  companyAlias?: any;
  companyLevel?: string;
  companyCategory?: string;
  companyProperty?: any;
  companyMarket?: any;
  companyParent?: any;
  companyCeditNo?: any;

  displayCreator?: string;
  displayModifier?: string;
  iconclass?: Iconclass;
}

interface Iconclass {
  code: string;
  name: string;
  classIcon?: any;
  bgColor?: any;
  sourceName?: any;
  langPrefix?: any;
}

export interface SetUpGetInfoScheme<T extends Record<string, any> = any> {
  apis: Api[];
  form: Form<T>[];
  btnListConfig: BtnListConfig[];
  values: T;
  config: Config;
}

interface Config {
  mode: string;
  viewType: string;
  basicClass: string;
  className: string;
  popProps: PopProps;
}

interface PopProps {
  width: string;
  title: string;
}

interface BtnListConfig {
  code: string;
  name: string;
  extendProps?: any;
  bmSort: string;
  tagName: string;
  events: Events2;
  props: Props3;
}

interface Props3 {
  type: string;
}

interface Events2 {
  click: Click;
}

interface Click {
  actionType: string;
  eventId: string;
  methodName: string;
  className?: any;
  params?: any;
  url?: any;
}

interface Form<T extends Record<string, any> = any> {
  groupOrder: string;
  groupName: string;
  children: Child<T>[];
  extendProps?: any;
}

interface Child<T extends Record<string, any> = any, K extends string = Extract<keyof T, string>> {
  isSort?: any;
  groupOrder: string;
  dataType: string;
  source: number;
  bmSort: string;
  tagName: string;
  type: string;
  required: boolean;
  props: Props2;
  groupName: string;
  field: K;
  isLov: boolean;
  name: string;
  lov?: Lov;
  events?: Events;
}
export interface GetLabDataType {
  createAt: string;
  updateAt: string;
  createUserName: string;
  updateUserName: string;
  tenantId?: any;
  id: string;
  serviceCode: string;
  classCode: string;
  className: string;
  type: string;
  compoundAttributeType: string;
  code: string;
  relationClassCode?: any;
  relationAttributeCode?: string;
  sourceAttributeCode?: string;
  referenceName: string;
  name: string;
  remark?: string;
  dataType: string;
  length?: number;
  initValue?: string;
  minValue?: string;
  maxValue?: string;
  isExtend: string;
  required: string;
  isArray: string;
  isDependent: string;
  isPk: string;
  deployStatus: string;
  source: string;
  relationTableClassCode?: any;
  relationTableObjClassCode?: any;
  relationTableLeftClassCode?: any;
  relationTableLeftClassName?: any;
  relationTableRightClassCode?: any;
  relationTableRightClassName?: any;
  tableMetaData?: string;
  tableMetaDataCode?: string;
  isGlobal: number;
  langPrefix: string;
  scale?: number;
  indexed: string;
  relationType: string;
}
interface Events {
  focus: Focus;
}

interface Focus {
  actionType: string;
  methodName: string;
}

interface Lov {
  code: string;
  thisObj: ThisObj;
}

interface ThisObj {
  oneIndustry?: string;
}

interface Props2 {
  regularExpression?: any;
  DynLov?: string;
  lineAttribute?: LineAttribute[];
  lineButton?: any[];
  headButton?: any[];
}

interface LineAttribute {
  isSort: string;
  field: string;
  isLov: boolean;
  isTotal?: any;
  name: string;
  bmSort: string;
  source: string;
  type: string;
  tagName: string;
  props: Props;
}

interface Props {
  isMultilingual: boolean;
}

interface Api {
  code: string;
  interfaceUrl: string;
  isLov: boolean;
}

export interface QueryAgentParams<T extends Recordable = {}> {
  queryArgs: QueryArgs<T>;
  condition: T;
  className: string;
}

interface QueryArgs<T extends Recordable = {}> {
  condition: T[];
  page: Page;
  sort: Sort;
  attrSet: string[];
}

interface Sort {
  sortBy: string;
  sortOrder: string;
}

interface Page {
  pageNo: number;
  pageSize: number;
}

interface Condition {
  key: string;
  value: string;
  compare: string;
}
export interface RootObject {
  code: string;
  thisObj: ThisObj;
}

interface ThisObj {}
