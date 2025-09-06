import { TFolderInfo } from '@/types/TFolderInfo';
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
  return apiFetch<TFile[]>(
    `/api/${orgId}/knowledge-hub/files?folderId=${folderId}`,
    { method: 'GET' }
  );
};
