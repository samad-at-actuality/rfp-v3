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
import { Loader2, PlusIcon, Trash2, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { deleteMediaFile, uploadeMediaFiles } from '@/lib/apis/foldersApi';
import { apiFetch } from '@/lib/fetchClient';
import { toast } from 'sonner';
import { LoadingButton } from './loading-button';
import { ImageBase64 } from './image-base64';
import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';

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

  const [isSavingSummary, setIsSavingSummary] = useState<boolean>(false);
  const handleUpdateSummary = async () => {
    try {
      setIsSavingSummary(true);
      const response = await apiFetch(
        `/api/${orgId}/knowledge-hub/folders/${folderInfo_.id}/summary`,
        {
          method: 'PUT',
        },
        { type: folderInfo_.type, project: projectSummary }
      );
      if (response.data) {
        toast.success('Summary updated successfully');
      } else {
        toast.error('Failed to update summary');
      }
      console.log('response from api', response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSavingSummary(false);
    }
  };

  return (
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
                <span className='text-2xl font-bold'>{folderInfo_?.name}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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

            <MediaDisplayer
              showUpload={!disableEdit}
              showDelete={!disableEdit}
              files={files}
              folderId={folderInfo_.id}
              orgId={orgId}
            />
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
      </div>
      {!disableEdit && (
        <div className='sticky bottom-0 py-4 mt-6 bg-[#F9FAFB]'>
          <div className='flex justify-end'>
            <LoadingButton
              onClick={handleUpdateSummary}
              isLoading={isSavingSummary}
              label='Save'
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
  const [deletingMediaFile, setDeletingMediaFile] = useState<string>('');

  const handleDeleteMediaFile = async (fileId: string) => {
    setDeletingMediaFile(fileId);
    try {
      const response = await deleteMediaFile({ orgId, fileId });
      console.log(response);
      if (response.status === 200) {
        setFiles((p) => p.filter((f) => f.id !== fileId));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingMediaFile('');
    }
  };

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ref.current && files.length === 0) {
      ref.current.click();
    }
  }, [files]);

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
      <div className='space-y-2'>
        {files
          ?.filter((media) => !isImageUrl(media.name))
          .map((media) => (
            <div
              key={media.id}
              className='flex items-center justify-between border p-2 rounded-lg'
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='flex-1 truncate text-sm  overflow-hidden text-overflow-ellipsis text-ellipsis whitespace-nowrap'>
                    {media.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent side='bottom'>{media.name}</TooltipContent>
              </Tooltip>

              {showDelete && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('from button');
                    handleDeleteMediaFile(media.id);
                  }}
                  className='text-red-500 hover:text-red-700'
                >
                  {deletingMediaFile === media.id ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Trash2 className='w-4 h-4' />
                  )}
                </Button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
