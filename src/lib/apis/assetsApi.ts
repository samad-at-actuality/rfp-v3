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

export const downloadFile = ({
  orgId,
  fileId,
}: {
  orgId: string;
  fileId: string;
}) => {
  return apiFetch<Blob>(`/api/${orgId}/knowledge-hub/files/${fileId}/download`);
};

export const deleteFile = ({
  orgId,
  fileId,
}: {
  orgId: string;
  fileId: string;
}) => {
  return apiFetch(`/api/${orgId}/knowledge-hub/files/${fileId}`, {
    method: 'DELETE',
  });
};
