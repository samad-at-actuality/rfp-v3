'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPreviewUrl } from '../lib/apis/assetsApi';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export const ImageBase64 = ({
  width,
  height,
  alt,
  fileId,
  orgId,
  style = {},
}: {
  width: number;
  height: number;
  alt: string;
  fileId: string;
  orgId: string;
  style?: React.CSSProperties;
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
      } catch (error) {
        console.log('error: ', error);
      }
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
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          style={{ cursor: 'pointer', ...style }}
          className='rounded-md object-cover'
        />
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
