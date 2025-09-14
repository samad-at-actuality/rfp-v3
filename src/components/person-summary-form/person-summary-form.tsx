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
import { PlusIcon, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { PersonProjectDialog } from './project-dialog';
import {
  reSummarizePeopleForm,
  uploadeMediaFiles,
} from '@/lib/apis/foldersApi';
import { apiFetch } from '@/lib/fetchClient';
import { toast } from 'sonner';
import { LoadingButton } from '../loading-button';
import { ImageBase64 } from '../image-base64';
import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';
import { FileDownloader } from '../file-downloader';
import { FileDeleter } from '../file-deleter';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // make sure shadcn table is installed
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { flushSync } from 'react-dom';
import TiptapEditor from '../tiptap-editor';
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
  const [isDirty, setIsDirty] = useState(false);
  useUnsavedChangesWarning(isDirty);

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
    otherInfo: folderInfo_?.summary?.person?.otherInfo || [],
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
    skills: '',
  });
  const [qualificaitionTemp, setQualificaitionTemp] = useState<string>('');
  const [skillsTemp, setSkillsTemp] = useState<string>('');
  const [isSavingSummary, setIsSavingSummary] = useState<boolean>(false);
  const [isReSummarizing, setIsReSummarizing] = useState<boolean>(false);
  const [isMount, setIsMount] = useState(false);
  useEffect(() => {
    if (!isMount) {
      setIsMount(true);
    } else {
      setIsDirty(true);
    }
  }, [personSummary]);

  const handleUpdateSummary = async () => {
    try {
      setIsSavingSummary(true);
      const payload = {
        type: folderInfo_.type,
        person: { ...personSummary },
        createdAt: folderInfo_.createdAt, // send explicitly at root
      };
      const response = await apiFetch(
        `/api/${orgId}/knowledge-hub/folders/${folderInfo_.id}/summary`,
        {
          method: 'PUT',
        },
        payload
      );
      if (response.data) {
        setIsDirty(false);
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

      const response = await reSummarizePeopleForm({
        orgId,
        folderId: folderInfo_.id,
      });

      if (response.data) {
        flushSync(() => {
          setPersonSummary(response.data.person);
        });
        flushSync(() => {
          setIsDirty(false);
        });
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

  const disableEdit = crtOrgAccess !== TOrgRole.ADMIN;
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
        {crtOrgAccess !== TOrgRole.VIEWER && (
          <div className='flex justify-end'>
            <LoadingButton
              label='Update'
              isLoading={isReSummarizing}
              onClick={handleReSummarize}
              isDisabled={isSavingSummary || isReSummarizing}
            />
          </div>
        )}
        <div className='flex gap-8'>
          <div className='flex-[0.7] space-y-6 '>
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
              <TiptapEditor
                key={personSummary?.about}
                content={personSummary?.about}
                editable={crtOrgAccess !== TOrgRole.VIEWER}
                onUpdate={(html) =>
                  setPersonSummary((p) => ({ ...p, about: html }))
                }
              />
              {/* <Textarea
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
              /> */}
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
            <div className='space-y-2'>
              <Label className='text-lg'>Skills</Label>
              {!disableEdit && (
                <div className='  relative'>
                  <Input
                    disabled={disableEdit}
                    className='bg-white'
                    value={skillsTemp}
                    onChange={(e) => {
                      setSkillsTemp(e.target.value);
                    }}
                  />

                  <div className='absolute right-[1px] top-0 scale-[0.8]'>
                    <Button
                      disabled={!skillsTemp}
                      className='bg-white hover:bg-gray-300 cursor-pointer text-blue-500'
                      onClick={() => {
                        setPersonSummary((p) => ({
                          ...p,
                          skills: [...p?.skills, skillsTemp],
                        }));
                        setSkillsTemp('');
                      }}
                    >
                      <PlusIcon className='w-8 h-8 ' />
                      <span className='text-lg font-semibold'>Add</span>
                    </Button>
                  </div>
                </div>
              )}

              <div className='flex flex-wrap gap-2 mt-2'>
                {personSummary?.skills?.map((skill) => (
                  <div
                    key={skill}
                    className='flex items-center text-sm px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-500 font-medium'
                  >
                    {skill}
                    {!disableEdit && (
                      <button
                        type='button'
                        onClick={() => {
                          setPersonSummary((p) => ({
                            ...p,
                            skills: p?.skills?.filter((q) => q !== skill),
                          }));
                        }}
                        className='ml-2 text-gray-500 hover:text-gray-700 cursor-pointer'
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {error.skills && (
                <span className='text-red-500'>{error.skills}</span>
              )}
            </div>
          </div>
          <div className='flex-[0.3]  space-y-6 '>
            <div className='space-y-2'>
              <Label className='text-lg'>Qualifications</Label>
              {crtOrgAccess !== TOrgRole.VIEWER && (
                <div className='  relative'>
                  <Input
                    disabled={
                      crtOrgAccess !== TOrgRole.ADMIN &&
                      crtOrgAccess !== TOrgRole.EDITOR
                    }
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

              <div className='flex flex-wrap gap-2 mt-2'>
                {personSummary?.qualifications?.map((qualification) => (
                  <div
                    key={qualification}
                    className='flex items-center text-sm px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-500 font-medium'
                  >
                    {qualification}
                    {crtOrgAccess !== TOrgRole.VIEWER && (
                      <button
                        type='button'
                        onClick={() => {
                          setPersonSummary((p) => ({
                            ...p,
                            qualifications: p?.qualifications?.filter(
                              (q) => q !== qualification
                            ),
                          }));
                        }}
                        className='ml-2 text-gray-500 hover:text-gray-700 cursor-pointer'
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {error.qualifications && (
                <span className='text-red-500'>{error.qualifications}</span>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Label className='flex-1 text-lg'>Past Projects</Label>
                {crtOrgAccess !== TOrgRole.VIEWER && (
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
                    {crtOrgAccess !== TOrgRole.VIEWER && (
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
        <div className='space-y-2'>
          <MediaDisplayer
            showUpload={crtOrgAccess !== TOrgRole.VIEWER}
            showDelete={!disableEdit}
            files={files}
            folderId={folderInfo_.id}
            orgId={orgId}
            handleReSummarize={handleReSummarize}
          />
        </div>
      </div>
      {crtOrgAccess !== TOrgRole.VIEWER && (
        <div className='sticky bottom-0 py-4 mt-6 bg-[#F9FAFB]'>
          <div className='flex justify-end'>
            <LoadingButton
              onClick={handleUpdateSummary}
              isLoading={isSavingSummary}
              label='Save'
              isDisabled={isReSummarizing || isSavingSummary}
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
  handleReSummarize,
}: {
  files: TFolderFile[];
  orgId: string;
  folderId: string;
  showUpload: boolean;
  showDelete: boolean;
  handleReSummarize: () => Promise<void>;
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
      <div className='flex items-center mb-4'>
        <Label className='text-lg flex-1' htmlFor='media'>
          Media
        </Label>
        {showUpload && (
          <FileUploaderDialog
            trigger={
              <Button ref={ref} className='bg-white' variant='outline'>
                <Upload /> Upload Files
              </Button>
            }
            orgId={orgId}
            folderId={folderId}
            type={TFolderInfoSummayType.PEOPLE}
            onUpload={async (payloads, isPostProcessing) => {
              try {
                const res = await uploadeMediaFiles(orgId, payloads);

                if (res.data) {
                  setFiles((p) => [...p, ...(res.data || [])]);
                }
                if (isPostProcessing) {
                  await handleReSummarize();
                }
                return [];
              } catch {
                return payloads;
              }
            }}
            showPostProcessing={true}
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
                showDelete={showDelete}
                onDelete={async () => {
                  setFiles((p) => p.filter((m) => m.id !== media.id));
                }}
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
      <Label className='text-lg flex-1 mt-4' htmlFor='media'>
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
