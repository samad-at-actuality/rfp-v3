'use client';

import { FileUploaderDialog } from '@/components/file-uploader-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isImageUrl } from '@/lib/utils';
import {
  TFolderFile,
  TFolderInfo,
  TFolderInfoSummayType,
} from '@/types/TFolderInfo';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { uploadeMediaFiles } from '@/lib/apis/foldersApi';
import { apiFetch } from '@/lib/fetchClient';
import { toast } from 'sonner';
import { LoadingButton } from './loading-button';
import { ImageBase64 } from './image-base64';
import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';
import { FileDeleter } from './file-deleter';
import { FileDownloader } from './file-downloader';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // make sure shadcn table is installed
import { IoMdDownload } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

export const ProjectSummaryForm = ({
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
  const [projectSummary, setProjectSummary] = useState<
    NonNullable<NonNullable<TFolderInfo['summary']>['project']>
  >({
    name: folderInfo_?.summary?.project?.name || '',
    about: folderInfo_?.summary?.project?.about || '',
    designer: folderInfo_?.summary?.project?.designer || '',
    contractType: folderInfo_?.summary?.project?.contractType || '',
    location: folderInfo_?.summary?.project?.location || '',
    value: folderInfo_?.summary?.project?.value || '',
    startDate: folderInfo_?.summary?.project?.startDate || '',
    endDate: folderInfo_?.summary?.project?.endDate || '',
    team: folderInfo_?.summary?.project?.team || [],
    client: folderInfo_?.summary?.project?.client || '',
    clientDescription: folderInfo_?.summary?.project?.clientDescription || '',
    otherInfo: folderInfo_?.summary?.project?.otherInfo || [],

    // fields need processing
    images: folderInfo_?.summary?.project?.images || [],
    projectSize: folderInfo_?.summary?.project?.projectSize || '',
  });

  const [error, _setError] = useState({
    name: '',
    about: '',
    designer: '',
    contractType: '',
    location: '',
    value: '',
    startDate: '',
    endDate: '',
    team: '',
    client: '',
    clientDescription: '',
    otherInfo: '',
  });
  const [isReSummarizing, setIsReSummarizing] = useState<boolean>(false);

  const [isSavingSummary, setIsSavingSummary] = useState<boolean>(false);
  const handleUpdateSummary = async () => {
    try {
      setIsSavingSummary(true);
      const response = await apiFetch(
        `/api/${orgId}/knowledge-hub/folders/${folderInfo_.id}/summary`,
        {
          method: 'PUT',
        },
        {
          type: folderInfo_.type,
          project: projectSummary,
          createdAt: folderInfo_.createdAt,
        }
      );
      if (response.data) {
        toast.success('Summary updated successfully');
      } else {
        toast.error('Failed to update summary');
      }
    } catch {
      toast.error('Failed to update summary');
    } finally {
      setIsSavingSummary(false);
    }
  };
  const handleReSummarize = async () => {
    try {
      setIsReSummarizing(true);
      const response = await apiFetch(
        `/api/${orgId}/knowledge-hub/folders/${folderInfo_.id}/summarize`,
        {
          method: 'POST',
        }
      );
      if (response.data) {
        toast.success('Summary updated successfully');
      } else {
        toast.error('Failed to update summary');
      }
    } catch {
      toast.error('Failed to summarize the folder!');
    } finally {
      setIsReSummarizing(false);
    }
  };
  return (
    <div
      className='p-6 flex flex-col min-h-screen'
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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
                <span className='text-2xl font-bold'>{folderInfo_?.name}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {crtOrgAccess === TOrgRole.ADMIN && (
          <div className='flex justify-end'>
            <LoadingButton
              label='Update'
              isLoading={isReSummarizing}
              onClick={handleReSummarize}
              isDisabled={isReSummarizing || isSavingSummary}
            />
          </div>
        )}

        <div className='flex gap-8'>
          <div className='flex-[0.7]    space-y-6 '>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='name'>
                Project Name
              </Label>
              <Input
                disabled={disableEdit}
                id='name'
                className='bg-white'
                name='name'
                value={projectSummary?.name || ''}
                onChange={(e) =>
                  setProjectSummary((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
              />
              {error.name && <span className='text-red-500'>{error.name}</span>}
            </div>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='description'>
                Designer
              </Label>
              <Input
                disabled={disableEdit}
                id='description'
                className='bg-white'
                name='description'
                value={projectSummary?.designer || ''}
                onChange={(e) =>
                  setProjectSummary((p) => ({
                    ...p,
                    designer: e.target.value,
                  }))
                }
              />
              {error.designer && (
                <span className='text-red-500'>{error.designer}</span>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='email'>
                About
              </Label>
              <Textarea
                disabled={disableEdit}
                id='email'
                className='bg-white'
                name='email'
                value={projectSummary?.about || ''}
                onChange={(e) =>
                  setProjectSummary((p) => ({
                    ...p,
                    about: e.target.value,
                  }))
                }
              />
              {error.about && (
                <span className='text-red-500'>{error.about}</span>
              )}
            </div>
          </div>
          <div className='flex-[0.3]  space-y-6 '>
            <div className='space-y-2'>
              <Label className='text-lg'>Location</Label>
              <Input
                disabled={disableEdit}
                className='bg-white'
                value={projectSummary.location!}
                onChange={(e) => {
                  setProjectSummary((p) => ({
                    ...p,
                    location: e.target.value,
                  }));
                }}
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-lg'>Project Size</Label>
              <Input
                disabled={disableEdit}
                className='bg-white'
                value={projectSummary.projectSize!}
                onChange={(e) => {
                  setProjectSummary((p) => ({
                    ...p,
                    projectSize: e.target.value,
                  }));
                }}
              />
            </div>{' '}
            <div className='space-y-2'>
              <Label className='text-lg'>Project Value</Label>
              <Input
                disabled={disableEdit}
                className='bg-white'
                value={projectSummary.value!}
                onChange={(e) => {
                  setProjectSummary((p) => ({
                    ...p,
                    value: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <MediaDisplayer
            showUpload={!disableEdit}
            showDelete={!disableEdit}
            files={files}
            folderId={folderInfo_.id}
            orgId={orgId}
          />
        </div>
      </div>
      {!disableEdit && (
        <div className='sticky bottom-0 py-4 mt-6 bg-[#F9FAFB]'>
          <div className='flex justify-end'>
            <LoadingButton
              onClick={handleUpdateSummary}
              isLoading={isSavingSummary}
              label='Save'
              isDisabled={isSavingSummary || isReSummarizing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const MediaDisplayer = ({
  files: files_,
  orgId,
  folderId,
  showUpload,
  showDelete,
}: {
  files: TFolderFile[];
  orgId: string;
  folderId: string;
  showUpload: boolean;
  showDelete: boolean;
}) => {
  const [files, setFiles] = useState(files_);

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ref.current && files.length === 0) {
      ref.current.click();
    }
  }, [files]);

  const convertBytesToMB = (size: number): string => {
    if (!size || size <= 0) {
      return '0 MB';
    }
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDateTime = (
    isoString: string
  ): { date: string; time: string } => {
    const dateObj = new Date(isoString);

    // Format date (DD-MM-YYYY)
    const date = dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Format time (HH:mm AM/PM)
    const time = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return { date, time };
  };

  return (
    <div className='space-y-2 '>
      <div className='flex items-center'>
        <Label className='text-lg flex-1' htmlFor='media'>
          Media
        </Label>
        {showUpload && (
          <FileUploaderDialog
            trigger={<Button ref={ref}>Upload Files</Button>}
            orgId={orgId}
            folderId={folderId}
            type={TFolderInfoSummayType.PEOPLE}
            onUpload={async (payloads) => {
              try {
                const res = await uploadeMediaFiles(orgId, payloads);

                setFiles((p) => [...p, ...(res.data || [])]);
                return [];
              } catch {
                return payloads;
              }
            }}
          />
        )}
      </div>
      <div className='flex flex-wrap gap-4 min-h-[150px] '>
        {files
          ?.filter((media) => isImageUrl(media.name))
          .map((media) => (
            <div
              key={media.id}
              className='flex flex-col items-center gap-2 w-[120px]'
            >
              <ImageBase64
                width={100}
                height={100}
                alt={media.name}
                fileId={media.id}
                orgId={orgId}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='text-sm max-w-[120px]  overflow-hidden text-overflow-ellipsis text-ellipsis whitespace-nowrap'>
                    {media.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>{media.name}</TooltipContent>
              </Tooltip>
            </div>
          ))}
      </div>
      <Label className='text-lg flex-1' htmlFor='media'>
        Documents
      </Label>

      <div className='overflow-x-auto rounded-xl'>
        <Table>
          <TableHeader>
            <TableRow className='text-gray-500 border-b'>
              <TableHead className='py-3 px-4'>
                <input type='checkbox' />
              </TableHead>
              <TableHead className='py-3 px-4 font-normal text-lg text-[#6B7280]'>
                File name
              </TableHead>
              <TableHead className='py-3 px-4 font-normal text-lg text-[#6B7280]'>
                Uploaded by
              </TableHead>
              <TableHead className='py-3 px-4 font-normal text-lg text-[#6B7280]'>
                Size
              </TableHead>
              <TableHead className='py-3 px-4 font-normal text-lg text-[#6B7280]'>
                Date
              </TableHead>
              <TableHead className='py-3 px-4 text-right font-normal text-lg text-[#6B7280]'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {files
              ?.filter((media) => !isImageUrl(media.name))
              .map((doc) => {
                const { date, time } = formatDateTime(doc.createdAt);

                return (
                  <TableRow key={doc.id} className='border-b last:border-0'>
                    <TableCell className='py-3 px-4'>
                      <input type='checkbox' />
                    </TableCell>

                    <TableCell className='py-3 px-4 text-black-800 text-lg'>
                      {doc.name}
                    </TableCell>

                    <TableCell className='py-3 px-4 text-lg text-[#6B7280]'>
                      ABC
                    </TableCell>

                    <TableCell className='py-3 px-4 text-lg text-[#6B7280]'>
                      {convertBytesToMB(doc.size)}
                    </TableCell>

                    <TableCell className='py-3 px-4 whitespace-nowrap text-lg text-[#6B7280]'>
                      {date}{' '}
                      <span className='text-xs text-gray-400'>{time}</span>
                    </TableCell>

                    <TableCell className='py-3 px-4 text-right space-x-2'>
                      <FileDownloader
                        fileId={doc.id}
                        orgId={orgId}
                        filaName={doc.name}
                      />

                      {showDelete && (
                        <FileDeleter
                          fileId={doc.id}
                          orgId={orgId}
                          onDeleteCB={() => {
                            setFiles((p) => p.filter((f) => f.id !== doc.id));
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
