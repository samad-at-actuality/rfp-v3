import { Button } from './ui/button';
import { useState } from 'react';
import { downloadFile } from '@/lib/apis/assetsApi';
import { DownloadIcon, Loader } from 'lucide-react';
import { toast } from 'sonner';

export const FileDownloader = ({
  fileId,
  orgId,
  filaName,
}: {
  fileId: string;
  orgId: string;
  filaName: string;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  return (
    <Button
      disabled={isDownloading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDownloading(true);
        downloadFile({ orgId, fileId })
          .then((res) => {
            if (!res.data) {
              throw new Error('File not found');
            }
            const url = window.URL.createObjectURL(res.data!);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filaName);
            document.body.appendChild(link);
            link.click();
            link.remove();
          })
          .catch(() => {
            toast.error('Failed to download file');
          })
          .finally(() => {
            setIsDownloading(false);
          });
      }}
      variant='ghost'
      size='icon'
      className=''
    >
      {!isDownloading ? (
        <DownloadIcon className='h-4 w-4' />
      ) : (
        <Loader className='animate-spin' />
      )}
    </Button>
  );
};
