export interface CompanyDetailsValues {
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
  companyLogo?: string;
  [key: string]: any;
}

export interface QueryAgentCompanyRecord {
  code: string;
  name: string;
  companyAlias?: string;
  companyLevel: string;
  objId: string;
  className: string;
  displayCreator: string;
  displayModifier: string;
}
