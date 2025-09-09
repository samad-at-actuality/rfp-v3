import { Button } from './ui/button';
import { useState } from 'react';
import { downloadFile } from '@/lib/apis/assetsApi';
import { DownloadIcon, Loader } from 'lucide-react';

export const FileDownloader = ({
  fileId,
  orgId,
}: {
  fileId: string;
  orgId: string;
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
