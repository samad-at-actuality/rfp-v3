'use client';

import { TFolderFile, TFolderInfo } from '@/types/TFolderInfo';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Link from 'next/link';

import Image from 'next/image';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';
import { uploadeMediaFiles } from '@/lib/apis/foldersApi';
import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';
import { FileUploaderDialog } from './file-uploader-dialog';
import { Upload } from 'lucide-react';

export const FilesTable = ({
  folderInfo: folderInfo_,
  orgId,
  primaryFolderName,
  primaryFolderSlug,
  files,
}: {
  folderInfo: TFolderInfo;
  orgId: string;
  primaryFolderName: string;
  primaryFolderSlug: string;
  files: TFolderFile[];
}) => {
  const {
    currentOrg: { role: crtOrgAccess },
  } = useOrgCtx();
  const disableEdit = crtOrgAccess !== TOrgRole.ADMIN;

  const [existingFiles, setExistingFiles] = useState<TFolderFile[]>(files);

  const formatFileSize = (bytes: any) => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(1)} ${sizes[i]}`;
  };

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ref.current && files.length === 0) {
      ref.current.click();
    }
  }, [files]);

  return (
    <>
      {/* <pre>{JSON.stringify(files, null, 2)}</pre> */}

      <div className='p-6 flex flex-col min-h-screen'>
        <div className='space-y-6 flex-1'>
          <Breadcrumb>
            <BreadcrumbList className='text-[rgb(3.939% 3.939% 3.939%)]'>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/app/orgs/${orgId}/data`}
                    className='text-2xl font-bold'
                  >
                    Knowledge Hub
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/app/orgs/${orgId}/data/${primaryFolderSlug}`}
                    className='text-2xl font-bold'
                  >
                    {primaryFolderName}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <span className='text-2xl font-bold'>
                    {folderInfo_?.name}
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
            <h3
              style={{ color: '#6B7280', fontFamily: 'Inter' }}
              className='mb-4'
            >
              {files.length} {files.length === 1 ? 'item' : 'items'}
            </h3>
          </div>
          <div>
            <h3
              style={{
                color: '#6B7280',
                fontFamily: 'Inter',
                fontWeight: '600',
              }}
              className='my-3'
            >
              Documents
            </h3>
          </div>

          <div className='overflow-x-auto rounded-xl  '>
            <Table
              style={{
                fontFamily: 'Inter',
                fontSize: '16px',
                fontWeight: '500',
              }}
              className='w-full   text-left'
            >
              <TableHeader className='text-gray-500 border-b bg-gray-50'>
                <TableRow>
                  <TableHead className='py-3 px-4'>
                    <input type='checkbox' />
                  </TableHead>
                  <TableHead className='py-3 px-4 font-normal text-md text-[#6B7280]'>
                    File name
                  </TableHead>
                  <TableHead className='py-3 px-4 font-normal text-md text-[#6B7280]'>
                    Uploaded by
                  </TableHead>
                  <TableHead className='py-3 px-4 font-normal text-md text-[#6B7280]'>
                    Size
                  </TableHead>
                  <TableHead className='py-3 px-4 font-normal text-md text-[#6B7280]'>
                    Credential name
                  </TableHead>
                  <TableHead className='py-3 px-4 font-normal text-right text-md text-[#6B7280]'>
                    Date
                  </TableHead>
                  <TableHead className='py-3 px-4 text-right font-normal text-md text-[#6B7280]'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {existingFiles.map((doc, index) => {
                  const d = new Date(doc.createdAt);
                  const formattedDate = d.toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedTime = d.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <TableRow key={index} className='border-b last:border-0'>
                      <TableCell className='py-3 px-4'>
                        <input type='checkbox' />
                      </TableCell>
                      <TableCell className='py-3 px-4 text-[#000000] text-md'>
                        {doc.name}
                      </TableCell>
                      <TableCell className='py-3 px-4 text-md text-[#6B7280]'>
                        XYZ
                      </TableCell>
                      <TableCell className='py-3 px-4 text-md text-[#6B7280]'>
                        {formatFileSize(doc.size)}
                      </TableCell>
                      <TableCell className='py-3 px-4 text-md text-[#6B7280]'>
                        ABC
                      </TableCell>
                      <TableCell className='py-3 px-4 text-right whitespace-nowrap text-md text-[#6B7280]'>
                        {formattedDate}{' '}
                        <span className='text-xs text-gray-400'>
                          {formattedTime}
                        </span>
                      </TableCell>
                      <TableCell className='py-3 px-4 text-right space-x-2'>
                        <button className='text-gray-600'>
                          <Image
                            src='/assets/edit-icon.png'
                            alt='Edit'
                            width={18}
                            height={18}
                            className='cursor-pointer'
                          />
                        </button>
                        <button className='text-gray-600'>
                          <Image
                            src='/assets/eye-icon.png'
                            alt='View'
                            width={18}
                            height={18}
                            className='cursor-pointer'
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center gap-3 mt-4'>
            {!disableEdit && (
              <FileUploaderDialog
                trigger={
                  <Button
                    style={{
                      color: '#6B7280',
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                    }}
                    ref={ref}
                  >
                    <Upload className='w-4 h-4' />
                    Upload
                  </Button>
                }
                orgId={orgId}
                folderId={folderInfo_?.id || ''}
                type={folderInfo_.type}
                onUpload={async (payloads) => {
                  try {
                    const res = await uploadeMediaFiles(orgId, payloads);

                    setExistingFiles((p) => [...p, ...(res?.data || [])]);
                    return [];
                  } catch {
                    return payloads;
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
