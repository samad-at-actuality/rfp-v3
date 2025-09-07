'use client';

import { TFolderFile } from '@/types/TFolderInfo';

export const FilesTable = ({ files }: { files: TFolderFile[] }) => {
  return <pre>{JSON.stringify(files, null, 2)}</pre>;
};
