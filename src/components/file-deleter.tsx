import { Button } from './ui/button';
import { useState } from 'react';
import { deleteFile } from '@/lib/apis/assetsApi';
import { Loader, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm-dialog';

export const FileDeleter = ({
  fileId,
  orgId,
  onDeleteCB,
}: {
  fileId: string;
  orgId: string;
  onDeleteCB: () => void;
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [deletingMediaFile, setDeletingMediaFile] = useState(false);
  const handleDeletingMediaFile = async () => {
    try {
      setDeletingMediaFile(true);
      const res = await deleteFile({ orgId, fileId });
      if (res.error) {
        throw new Error(res.error);
      }
      onDeleteCB();
    } catch (error) {
      toast.error('Failed to delete file');
    } finally {
      setDeletingMediaFile(false);
    }
  };
  return (
    <>
      <Button
        disabled={deletingMediaFile}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenConfirm(true);
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
      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        isLoading={deletingMediaFile}
        handleConfirmClose={handleDeletingMediaFile}
        title='Delete File'
        description='Are you sure you want to delete this file?'
        btnLabel='Delete'
      />
    </>
  );
};
