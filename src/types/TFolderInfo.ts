import { TPrimaryFolderEnum } from './TPrimaryFolderEnum';

type TOtherInfo = {
  key: string;
  value: string;
};
export enum TPROGRESS_ENUM {
  PROCESSED = 'PROCESSED',
}

export type TPeopleProject = {
  name: string;
  designations: string[];
  description: string;
  otherInfo: TOtherInfo[];
};

export type TFolderInfo = {
  name: string;
  type: TPrimaryFolderEnum;
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  summary: null | {
    type: TPrimaryFolderEnum;
    createdAt: string;
    person: {
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
    project: null;
    media: [];
    companyInfo: null;
    rfpSummary: null;
    dynamicFolder: null;
  };
};

export type TFileType = {
  name: string;
  fileKey: string;
  type: TPrimaryFolderEnum;
  folderId: string;
  id: string;
  orgId: string;
  status: TPROGRESS_ENUM;
  createdBy: string;
  createdAt: string;
  size: number;
};
