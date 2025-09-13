'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPreviewUrl } from '../lib/apis/assetsApi';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FileDownloader } from './file-downloader';
import { FileDeleter } from './file-deleter';

export const ImageBase64 = ({
  width,
  height,
  alt,
  fileId,
  orgId,
  style = {},
  onDelete,
  showActions = false,
}: {
  width: number;
  height: number;
  alt: string;
  fileId: string;
  orgId: string;
  style?: React.CSSProperties;
  onDelete?: () => Promise<void>;
  showActions?: boolean;
}) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const fetchSrc = async () => {
      try {
        const response = await getPreviewUrl({ orgId, fileId });
        if (response.data) {
          const fileURL = URL.createObjectURL(response.data!);
          setSrc(fileURL);
        }
      } catch {}
    };
    fetchSrc();
  }, [fileId, orgId]);

  if (!src) {
    return (
      <div
        className='relative overflow-hidden rounded-md'
        style={{ width, height, ...style }}
      >
        <div className='absolute inset-0 bg-gray-300 dark:bg-gray-700' />
        <div className='absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-tr from-transparent via-white/40 to-transparent' />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className='relative group rounded-md overflow-hidden'
          style={{
            width,
            height,
          }}
        >
          {showActions && (
            <div className='absolute opacity-0 group-hover:opacity-100  flex items-center gap-4 bg-white rounded-md w-full'>
              <FileDownloader fileId={fileId} orgId={orgId} filaName={alt} />
              <FileDeleter
                fileId={fileId}
                orgId={orgId}
                onDeleteCB={async () => onDelete?.()}
              />
            </div>
          )}
          <Image
            src={src}
            width={width}
            height={height}
            alt={alt}
            style={{
              cursor: 'pointer',
              ...style,
              height: 'auto',
              width: 'auto',
              objectFit: 'cover',
            }}
            className='rounded-md object-cover'
          />
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-4xl flex items-center justify-center border-0 shadow-none bg-white p-4'>
        <Image
          src={src}
          alt={alt}
          width={800}
          height={800}
          className='object-contain rounded-lg'
        />
      </DialogContent>
    </Dialog>
  );
};
