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
            if (!(res.data instanceof Blob)) {
              throw new Error('Response data is not a Blob');
            }

            const url = window.URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.href = url;

            const contentType = res.headers.get('content-type');

            // Keep provided name, fallback extension if missing
            let fileName = filaName;
            if (!/\.[a-z0-9]+$/i.test(fileName)) {
              if (contentType?.includes('pdf')) {
                fileName += '.pdf';
              } else if (contentType?.includes('word')) {
                fileName += '.docx';
              } else if (contentType?.includes('excel')) {
                fileName += '.xlsx';
              } else if (contentType?.includes('png')) {
                fileName += '.png';
              } else if (contentType?.includes('jpeg')) {
                fileName += '.jpg';
              } else {
                fileName += '.bin'; // fallback
              }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
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
