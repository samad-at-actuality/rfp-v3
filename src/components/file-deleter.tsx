import { Button } from './ui/button';
import { useState } from 'react';
import { deleteFile } from '@/lib/apis/assetsApi';
import { Loader, Trash2 } from 'lucide-react';

export const FileDeleter = ({
  fileId,
  orgId,
}: {
  fileId: string;
  orgId: string;
}) => {
  const [deletingMediaFile, setDeletingMediaFile] = useState(false);
  return (
    <Button
      disabled={deletingMediaFile}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDeletingMediaFile(true);
        deleteFile({ orgId, fileId })
          .then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file');
            document.body.appendChild(link);
            link.click();
            link.remove();
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setDeletingMediaFile(false);
          });
      }}
      variant='ghost'
      size='icon'
      className='text-red-500 hover:text-red-700'
    >
      {deletingMediaFile ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Trash2 className='w-4 h-4' />
      )}
    </Button>
  );
};
