import { apiFetch } from '../fetchClient';

export const getPreviewUrl = (payload: { orgId: string; fileId: string }) => {
  return apiFetch<Blob>(
    `/api/${payload.orgId}/knowledge-hub/files/${payload.fileId}/preview`,
    { method: 'GET' }
  );
};

export const getUploadSignature = async (
  orgId: string,
  payload: { name: string; contentType: string }[]
) => {
  return apiFetch<{
    files: {
      fileUrl: string;
      uploadUrl: string;
      fileKey: string;
    }[];
  }>(
    `/api/${orgId}/knowledge-hub/files/upload-signature`,
    { method: 'POST' },
    { files: payload }
  );
};
