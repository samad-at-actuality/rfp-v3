'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPreviewUrl } from '../lib/apis/assetsApi';

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
  }, []);

  return (
    src && (
      <Image src={src} width={width} height={height} alt={alt} style={style} />
    )
  );
};
