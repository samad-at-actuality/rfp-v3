'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload } from 'lucide-react';
import { LoadingButton } from './loading-button';
import { getUploadSignature } from '@/lib/apis/assetsApi';
import { TFolderInfoSummayType } from '@/types/TFolderInfo';

import { toast } from 'sonner';

export type S3_UPLOADED_FILES_PAYLOAD = {
  name: string;
  fileKey: string;
  type: TFolderInfoSummayType;
  contentType: string;
  folderId: string;
};

export function FileUploaderDialog({
  orgId,
  folderId,
  type,
  onUpload,
  trigger,
}: {
  orgId: string;
  folderId: string;
  type: TFolderInfoSummayType;
  onUpload: (
    _: S3_UPLOADED_FILES_PAYLOAD[]
  ) => Promise<S3_UPLOADED_FILES_PAYLOAD[]>;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      const validFiles = Array.from(newFiles).filter((f) => f.type !== '');
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isImage = (file: File) => file.type.startsWith('image/');
  const handleUpload = async () => {
    try {
      setIsLoading(true);

      const signature = await getUploadSignature(
        orgId,
        files.map((file) => ({ name: file.name, contentType: file.type }))
      );

      if (signature.data) {
        const payloads: S3_UPLOADED_FILES_PAYLOAD[] = [];
        const fileNotProcessed: string[] = [];
        for (const file of signature.data.files) {
          const crtFile = files.find((f) => file.fileKey.endsWith(f.name));
          if (!crtFile) {
            fileNotProcessed.push(file.fileKey);
            continue;
          }
          const res = await fetch(file.uploadUrl, {
            method: 'PUT',
            body: crtFile,
            headers: {
              'Content-Type': crtFile.type || 'application/octet-stream',
            },
          });
          if (res.ok) {
            const payload = {
              name: crtFile.name,
              fileKey: file.fileKey,
              type,
              contentType: crtFile.type,
              folderId: folderId,
            };
            payloads.push(payload);
          } else {
            console.log('File not found', await res.text());
          }
        }

        const notUploaded = await onUpload(payloads);

        let pendingFiles = files.filter((f) =>
          fileNotProcessed.find((ff) => ff.endsWith(f.name))
        );
        const notUploadedFiles = files.filter((f) =>
          notUploaded.find((ff) => ff.name === f.name)
        );

        pendingFiles = [...pendingFiles, ...notUploadedFiles];

        setFiles(pendingFiles);
        if (pendingFiles.length === 0) {
          toast.success('Files uploaded successfully');
          setOpen(false);
        } else {
          toast.error('Some files failed to upload');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to upload files');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className='max-w-2xl max-h-[80vh] flex flex-col'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        {/* Drop Zone */}
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition p-8 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className='w-6 h-6 mb-2 text-gray-500' />
          <span className='text-sm text-gray-600'>
            Drag & drop files here or click to select
          </span>
          <input
            type='file'
            className='hidden'
            multiple
            onChange={handleFileChange}
            id='fileInput'
          />
          <label
            htmlFor='fileInput'
            className='mt-2 px-3 py-1 text-xs border rounded-md bg-white cursor-pointer hover:bg-gray-100'
          >
            Browse Files
          </label>
        </div>

        {/* Scrollable Preview */}
        <div className='flex-1 overflow-y-auto'>
          {files.length > 0 && (
            <Card className='mt-4 py-0'>
              <CardContent className='p-4 space-y-4'>
                {/* Images Grid */}
                <div className='grid grid-cols-3 gap-3'>
                  {files.map(
                    (file, index) =>
                      isImage(file) && (
                        <div key={index} className='relative group'>
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width={150}
                            height={150}
                            className='object-cover rounded-lg w-full h-32'
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className='absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100'
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </button>
                        </div>
                      )
                  )}
                </div>

                {/* Docs List */}
                <div className='space-y-2'>
                  {files.map(
                    (file, index) =>
                      !isImage(file) && (
                        <div
                          key={index}
                          className='flex items-center justify-between border p-2 rounded-lg'
                        >
                          <span className='text-sm truncate max-w-[200px]'>
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upload action (stays fixed at bottom) */}
        {files.length > 0 && (
          <LoadingButton
            label={`Upload ${files.length} Files`}
            isLoading={isLoading}
            onClick={handleUpload}
            className='w-full mt-4'
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
