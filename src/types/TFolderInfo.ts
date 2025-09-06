import { TPrimaryFolderEnum } from './TPrimaryFolderEnum';

export type TFolderInfo = {
  name: string;
  type: TPrimaryFolderEnum;
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  summary: {
    type: TPrimaryFolderEnum;
    createdAt: string;
    person: {
      name: string;
      about: string;
      profilePics: [];
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      website: string;
      socialMedia: [];
      projects: {
        name: string;
        designations: [];
        description: string;
        otherInfo: [
          {
            key: string;
            value: string;
          },
          {
            key: string;
            value: string;
          },
        ];
      }[];
      skills: string[];
      qualifications: string[];
      exp_years: string;
      otherInfo: {
        key: string;
        value: string;
      }[];
    };
    project: null;
    media: [];
    companyInfo: null;
    rfpSummary: null;
    dynamicFolder: null;
  };
};
