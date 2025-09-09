import { TPrimaryFolderEnum } from './TPrimaryFolderEnum';

enum TOtherInfo_Type {
  AI_TEXT = 'AI_TEXT',
}

export type TOtherInfo = {
  key: string;
  value: string;
  type?: TOtherInfo_Type;
};

export enum TFile_Progress_Enum {
  PROCESSED = 'PROCESSED',
}

export type TPeopleProject = {
  name: string;
  designations: string[];
  description: string;
  otherInfo: TOtherInfo[];
};

// secondary folders
export enum TFolderInfoSummayType {
  RFP_SUMMARY = 'RFP_SUMMARY',
  PEOPLE = 'PEOPLE',
  PROJECTS = 'PROJECTS',
  COMPANY_INFO = 'COMPANY_INFO',
  PAST_RFPS = 'PAST_RFPS',
  DYMANIC_FOLDER = 'DYMANIC_FOLDER',
  OTHER = 'OTHER',
}

export type TFolderInfo = {
  name: string;
  type: TFolderInfoSummayType;
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  summary: null | {
    type: TFolderInfoSummayType;
    createdAt: string;
    person: TFolderInfoSummary_Person;
    project: TFolderInfoSummary_Project | null;
    media: string[];
    companyInfo: TFolderInfoSummary_CompanyInfo | null;
    rfpSummary: TFolderInfoSummary_RfpSummary | null;
    dynamicFolder: TFolderInfoSummary_DynamicFolder | null;
  };
};

type TFolderInfoSummary_Person = {
  name: string;
  about: string;
  profilePics: string[];
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  website: string;
  socialMedia: [];
  projects: TPeopleProject[];
  skills: string[];
  qualifications: string[];
  exp_years: string;
  otherInfo: TOtherInfo[];
};

type TFolderInfoSummary_RfpSummary = {
  name: string | null;
  images: string[];
  startDate: string | null;
  summary: TOtherInfo[];
  endDate: string | null;
  client: string | null;
  team: string[];
  clientDescription: string | null;
  otherInfo: TOtherInfo[];
};

type TFolderInfoSummary_DynamicFolder = {
  name: string | null;
  otherInfo: TOtherInfo[];
};

type TFolderInfoSummary_CompanyInfo = {
  name: string | undefined;
  type: string | undefined;
  products: [
    {
      name: string | undefined;
      status: string | undefined;
      uploadedBy: string | undefined;
      manufacturer: string | undefined;
      images: string[];
      warranties: string[];
      sku: string | undefined;
      price: string | undefined;
      tags: string[];
      type: string | undefined;
    },
  ];
  warranties: [
    {
      name: string | undefined;
      images: string[];
      manufacturer: string | undefined;
      warrantyId: string | undefined;
      uploadedBy: string | undefined;
      size: string | undefined;
      dateUploaded: string | undefined;
    },
  ];
  sustainability: [
    {
      name: string | undefined;
      images: string[];
      credentialName: string | undefined;
      uploadedBy: string | undefined;
      size: string | undefined;
      dateUploaded: string | undefined;
    },
  ];
  policies: [
    {
      images: string[];
      name: string | undefined;
      summary: string | undefined;
      uploadedBy: string | undefined;
      dateUploaded: string | undefined;
    },
  ];
  subOrgInfo: {
    name: string | undefined;
    description: string | undefined;
    employees: string[];
    location: string | undefined;
    otherInfo: TOtherInfo[];
  };
  tnc: [
    {
      images: string[];
      name: string | undefined;
      summary: string | undefined;
      uploadedBy: string | undefined;
      dateUploaded: string | undefined;
    },
  ];
  otherInfo: [
    {
      images: string[];
      name: string | undefined;
      summary: string | undefined;
      otherInfo: TOtherInfo[];
    },
  ];
};

type TFolderInfoSummary_Project = {
  name: string | null;
  images: string[];
  designer: string | null;
  about: string | null;
  contractType: string | null;
  projectSize: string | null;
  location: string | null;
  value: string | null;
  startDate: string | null;
  endDate: string | null;
  team: string[];
  client: string | null;
  clientDescription: string | null;
  otherInfo: TOtherInfo[];
};

export type TFolderFile = {
  name: string;
  fileKey: string;
  type: TPrimaryFolderEnum;
  folderId: string;
  id: string;
  orgId: string;
  status: TFile_Progress_Enum;
  createdBy: string;
  createdAt: string;
  size: number;
};
