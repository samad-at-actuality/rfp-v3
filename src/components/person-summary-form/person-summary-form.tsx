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
import { useState } from 'react';
import { PersonProjectDialog } from './project-dialog';
import { deleteMediaFile } from '@/lib/apis/foldersApi';
import { apiFetch } from '@/lib/fetchClient';
import { toast } from 'sonner';
import { LoadingButton } from '../loading-button';
import { ImageBase64 } from '../image-base64';
import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';

export const PersonSummaryForm = ({
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
  const [personSummary, setPersonSummary] = useState<
    NonNullable<TFolderInfo['summary']>['person']
  >({
    name: folderInfo_?.summary?.person?.name || '',
    about: folderInfo_?.summary?.person?.about || '',
    email: folderInfo_?.summary?.person?.email || '',
    phone: folderInfo_?.summary?.person?.phone || '',
    exp_years: folderInfo_?.summary?.person?.exp_years || '',
    qualifications: folderInfo_?.summary?.person?.qualifications || [],
    projects: folderInfo_?.summary?.person?.projects || [],

    // fields need processing
    profilePics: folderInfo_?.summary?.person?.profilePics || [],
    otherInfo: [],
    address: folderInfo_?.summary?.person?.address || '',
    city: folderInfo_?.summary?.person?.city || '',
    state: folderInfo_?.summary?.person?.state || '',
    zip: folderInfo_?.summary?.person?.zip || '',
    country: folderInfo_?.summary?.person?.country || '',
    website: folderInfo_?.summary?.person?.website || '',
    socialMedia: folderInfo_?.summary?.person?.socialMedia || [],
    skills: folderInfo_?.summary?.person?.skills || [],
  });

  const [error, _setError] = useState({
    name: '',
    email: '',
    about: '',
    phone: '',
    exp_years: '',
    qualifications: '',
    projects: '',
  });
  const [qualificaitionTemp, setQualificaitionTemp] = useState<string>('');
  const [isSavingSummary, setIsSavingSummary] = useState<boolean>(false);
  const handleUpdateSummary = async () => {
    try {
      setIsSavingSummary(true);
      const response = await apiFetch(
        `/api/${orgId}/knowledge-hub/folders/${folderInfo_.id}/summary`,
        {
          method: 'PUT',
        },
        { type: folderInfo_.type, person: personSummary }
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
                Full Name
              </Label>
              <Input
                disabled={disableEdit}
                id='name'
                className='bg-white'
                name='name'
                value={personSummary?.name}
                onChange={(e) =>
                  setPersonSummary((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
              />
              {error.name && <span className='text-red-500'>{error.name}</span>}
            </div>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='description'>
                About
              </Label>
              <Textarea
                disabled={disableEdit}
                id='description'
                className='bg-white'
                name='description'
                value={personSummary?.about}
                onChange={(e) =>
                  setPersonSummary((p) => ({
                    ...p,
                    about: e.target.value,
                  }))
                }
              />
              {error.about && (
                <span className='text-red-500'>{error.about}</span>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='email'>
                Email
              </Label>
              <Input
                disabled={disableEdit}
                id='email'
                className='bg-white'
                name='email'
                value={personSummary?.email}
                onChange={(e) =>
                  setPersonSummary((p) => ({
                    ...p,
                    email: e.target.value,
                  }))
                }
              />
              {error.email && (
                <span className='text-red-500'>{error.email}</span>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='phone'>
                Phone No.
              </Label>
              <Input
                disabled={disableEdit}
                id='phone'
                className='bg-white'
                name='phone'
                value={personSummary?.phone}
                onChange={(e) =>
                  setPersonSummary((p) => ({
                    ...p,
                    phone: e.target.value,
                  }))
                }
              />
              {error.phone && (
                <span className='text-red-500'>{error.phone}</span>
              )}
            </div>
            <div className='space-y-2'>
              <Label className='text-lg' htmlFor='exp_years'>
                Experience
              </Label>
              <Input
                disabled={disableEdit}
                id='exp_years'
                className='bg-white'
                name='exp_years'
                type='number'
                min={0}
                value={personSummary?.exp_years}
                onChange={(e) =>
                  setPersonSummary((p) => ({
                    ...p,
                    exp_years: e.target.value,
                  }))
                }
              />
              {error.exp_years && (
                <span className='text-red-500'>{error.exp_years}</span>
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
              <Label className='text-lg'>Qualifications</Label>
              {!disableEdit && (
                <div className='  relative'>
                  <Input
                    disabled={disableEdit}
                    className='bg-white'
                    value={qualificaitionTemp}
                    onChange={(e) => {
                      setQualificaitionTemp(e.target.value);
                    }}
                  />

                  <div className='absolute right-[1px] top-0 scale-[0.8]'>
                    <Button
                      disabled={!qualificaitionTemp}
                      className='bg-white hover:bg-gray-300 cursor-pointer text-blue-500'
                      onClick={() => {
                        setPersonSummary((p) => ({
                          ...p,
                          qualifications: [
                            ...p?.qualifications,
                            qualificaitionTemp,
                          ],
                        }));
                        setQualificaitionTemp('');
                      }}
                    >
                      <PlusIcon className='w-8 h-8 ' />
                      <span className='text-lg font-semibold'>Add</span>
                    </Button>
                  </div>
                </div>
              )}

              <div className='flex flex-wrap gap-2'>
                {personSummary?.qualifications?.map((qualification) => (
                  <span
                    key={qualification}
                    className='bg-white flex cursor-pointer items-center gap-2 rounded-full border-[1px] border-gray-500 pl-2 pr-2'
                  >
                    <span>{qualification}</span>
                    {!disableEdit && (
                      <button
                        className='bg-white rounded-full p-1 active:outline-gray-500 active:outline-[1px] cursor-pointer transition-all duration-300'
                        onClick={() => {
                          setPersonSummary((p) => ({
                            ...p,
                            qualifications: p?.qualifications?.filter(
                              (q) => q !== qualification
                            ),
                          }));
                        }}
                      >
                        <XIcon className='w-4 h-4' />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {error.qualifications && (
                <span className='text-red-500'>{error.qualifications}</span>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Label className='flex-1 text-lg'>Past Projects</Label>
                {!disableEdit && (
                  <PersonProjectDialog
                    onSave={(project) => {
                      setPersonSummary((p) => ({
                        ...p,
                        projects: [...p?.projects, project],
                      }));
                    }}
                    trigger={
                      <Button className=' hover:bg-gray-300 cursor-pointer text-blue-500 outline-0 border-0 bg-transparent shadow-none '>
                        <PlusIcon className='w-8 h-8 ' />
                        <span className='text-lg font-semibold'>Add</span>
                      </Button>
                    }
                  />
                )}
              </div>

              <div className='rounded-lg shadow-[0px_1px_12px_0px_#1F29370D] p-4 space-y-4 bg-white'>
                {personSummary?.projects?.map((project) => (
                  <div key={project.name} className='flex items-start gap-4'>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzpztEZ2ykCnjQGcdYsKIMaj4Skvv_w9PPQ&s'
                      alt={project.name}
                      className='w-11 h-11 rounded-md object-cover'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-1'>
                        <p className='font-semibold text-sm text-gray-900'>
                          {project.name}
                        </p>
                      </div>
                      <p className='text-sm' style={{ color: '#6B7280' }}>
                        {project?.designations[0] || 'No designation'}
                      </p>
                    </div>
                    {!disableEdit && (
                      <Button
                        variant='ghost'
                        className='p-0 cursor-pointer'
                        onClick={() => {
                          setPersonSummary({
                            ...personSummary,
                            projects: personSummary?.projects?.filter(
                              (p) => p.name !== project.name
                            ),
                          });
                        }}
                      >
                        <Trash2 className='w-4 h-4 text-red-400' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
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

  return (
    <div className='space-y-2 '>
      <div className='flex items-center'>
        <Label className='text-lg flex-1' htmlFor='media'>
          Media
        </Label>
        {showUpload && (
          <FileUploaderDialog
            orgId={orgId}
            folderId={folderId}
            type={TFolderInfoSummayType.PEOPLE}
            onUpload={(files) => {
              setFiles((p) => [...p, ...files]);
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
