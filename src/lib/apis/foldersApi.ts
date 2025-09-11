import {
  TFolderFile,
  TFolderInfo,
  TFolderInfoSummayType,
} from '@/types/TFolderInfo';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import { apiFetch } from '../fetchClient';

export const getPrimaryFoldersChildren = ({
  orgId,
  type,
}: {
  orgId: string;
  type: TPrimaryFolderEnum;
}) => {
  return apiFetch<TFolderInfo[]>(
    `/api/${orgId}/knowledge-hub/folders?type=${type}`
  );
};

export const createFolder = ({
  orgId,
  type,
  name,
}: {
  orgId: string;
  type: TPrimaryFolderEnum;
  name: string;
}) => {
  return apiFetch<TFolderInfo>(
    `/api/${orgId}/knowledge-hub/folders`,
    {
      method: 'POST',
    },
    { type, name }
  );
};

export const updateFolderSummary = ({
  orgId,
  folderId,
  payload,
}: {
  orgId: string;
  folderId: string;
  payload:
    | {
        type: TFolderInfoSummayType.PEOPLE;
        person: NonNullable<TFolderInfo['summary']>['person'];
      }
    | {
        type: TFolderInfoSummayType.PROJECTS;
        projects: NonNullable<TFolderInfo['summary']>['project'];
      }
    | {
        type: TFolderInfoSummayType.COMPANY_INFO;
        companyInfo: NonNullable<TFolderInfo['summary']>['companyInfo'];
      }
    | {
        type: TFolderInfoSummayType.RFP_SUMMARY;
        pastRfps: NonNullable<TFolderInfo['summary']>['rfpSummary'];
      }
    | {
        type: TFolderInfoSummayType.DYMANIC_FOLDER;
        dynamicFolder: NonNullable<TFolderInfo['summary']>['dynamicFolder'];
      };
}) => {
  return apiFetch<TFolderInfo>(
    `/api/${orgId}/knowledge-hub/folders/${folderId}/summary`,
    { method: 'PUT' },
    payload
  );
};

export const getFolderById = ({
  orgId,
  folderId,
}: {
  orgId: string;
  folderId: string;
}) => {
  return apiFetch<TFolderInfo>(
    `/api/${orgId}/knowledge-hub/folders/${folderId}`
  );
};

export const getFilesInFolder = ({
  orgId,
  folderId,
}: {
  orgId: string;
  folderId: string;
}) => {
  return apiFetch<TFolderFile[]>(
    `/api/${orgId}/knowledge-hub/files?folderId=${folderId}`,
    { method: 'GET' }
  );
};

export const uploadeMediaFiles = (
  orgId: string,
  payload: {
    name: string;
    fileKey: string;
    type: TFolderInfoSummayType;
    contentType: string;
    folderId: string;
  }[]
) => {
  return apiFetch<TFolderFile[]>(
    `/api/${orgId}/knowledge-hub/files/multi`,
    { method: 'POST' },
    payload
  );
};
export const deleteMediaFile = ({
  orgId,
  fileId,
}: {
  orgId: string;
  fileId: string;
}) => {
  return apiFetch<TFolderFile>(`/api/${orgId}/knowledge-hub/files/${fileId}`, {
    method: 'DELETE',
  });
};

export const deleteFolder = ({
  orgId,
  folderId,
}: {
  orgId: string;
  folderId: string;
}) => {
  return apiFetch<TFolderInfo>(
    `/api/${orgId}/knowledge-hub/folders/${folderId}`,
    {
      method: 'DELETE',
    }
  );
};

export const reSummarizePeopleForm = async ({
  orgId,
  folderId,
}: {
  orgId: string;
  folderId: string;
}) => {
  return apiFetch<{ person: NonNullable<TFolderInfo['summary']>['person'] }>(
    `/api/${orgId}/knowledge-hub/folders/${folderId}/summarize`,
    {
      method: 'POST',
    }
  );
};

export const reSummarizeProjectForm = async ({
  orgId,
  folderId,
}: {
  orgId: string;
  folderId: string;
}) => {
  return apiFetch<{ projects: NonNullable<TFolderInfo['summary']>['project'] }>(
    `/api/${orgId}/knowledge-hub/folders/${folderId}/summarize`,
    {
      method: 'POST',
    }
  );
};

export const getPrimaryFolderChildrenCount = async ({
  orgId,
}: {
  orgId: string;
}) => {
  return apiFetch<
    [
      {
        type: TPrimaryFolderEnum;
        count: number;
      },
    ]
  >(`/api/${orgId}/knowledge-hub/folders/count`, {
    method: 'GET',
  });
};
