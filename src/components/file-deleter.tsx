import { Button } from './ui/button';
import { useState } from 'react';
import { deleteFile } from '@/lib/apis/assetsApi';
import { Loader, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const FileDeleter = ({
  fileId,
  orgId,
  onDeleteCB,
}: {
  fileId: string;
  orgId: string;
  onDeleteCB: () => void;
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
          .then((res) => {
            if (res.error) {
              throw new Error(res.error);
            }
            onDeleteCB();
          })
          .catch(() => {
            toast.error('Failed to delete file');
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
