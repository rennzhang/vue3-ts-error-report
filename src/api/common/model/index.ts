export interface SetUpGetInfoParams {
  className: string;
  thisObj: ThisObj;
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

export interface SetUpGetInfoScheme {
  apis: Api[];
  form: Form[];
  btnListConfig: BtnListConfig[];
  values: Values;
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

interface Values {
  companyAlias?: any;
  companyParent?: any;
  code: string;
  companyArea?: any;
  openBank?: any;
  displayName: string;
  companyName: string;
  postalCode?: any;
  mainBusiness?: any;
  companyBusiness?: any;
  companyProperty?: any;
  registeredAddress?: any;
  companyNational?: any;
  registeredCapital?: any;
  secondIndustry?: any;
  taxNo?: any;
  companyHoldingRatio?: any;
  companyCity?: any;
  website?: any;
  companyCategory: string;
  openBankAccount?: any;
  telephone?: any;
  industryLabel?: any;
  companyLegalPerson?: any;
  companyCeditNo?: any;
  companyLevel: string;
  companyAddress: string;
  objId: string;
  firstIndustry?: any;
  customSource?: any;
  companyMarket?: any;
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

interface Form {
  groupOrder: string;
  groupName: string;
  children: Child[];
  extendProps?: any;
}

interface Child {
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
  field: string;
  isLov: boolean;
  name: string;
  lov?: Lov;
  events?: Events;
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
