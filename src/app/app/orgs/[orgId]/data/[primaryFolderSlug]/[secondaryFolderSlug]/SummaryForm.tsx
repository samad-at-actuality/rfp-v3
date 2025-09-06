'use client';

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
import { TFileType, TFolderInfo } from '@/types/TFolderInfo';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import { PlusIcon, Trash2, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const SummaryForm = ({
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
  files: TFileType[];
}) => {
  const [folderInfo, setFolderInfo] = useState<{
    summary: NonNullable<TFolderInfo['summary']>;
  }>({
    summary: {
      type: folderInfo_.type,
      createdAt: folderInfo_.createdAt,
      person: {
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
      },
      media: folderInfo_?.summary?.media || [],
      project: folderInfo_?.summary?.project || null,
      companyInfo: folderInfo_?.summary?.companyInfo || null,
      rfpSummary: folderInfo_?.summary?.rfpSummary || null,
      dynamicFolder: folderInfo_?.summary?.dynamicFolder || null,
    },
  });

  const [error, setError] = useState({
    summary: {
      person: {
        name: '',
        email: '',
        phone: '',
        exp_years: '',
        qualifications: '',
        projects: '',
      },
    },
  });
  const [qualificaitionTemp, setQualificaitionTemp] = useState<string>('');
  return (
    <div className='p-6 space-y-6'>
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
      <div className='flex gap-10'>
        <div className='flex-[0.6] h-[600px]  log-1 space-y-6 '>
          <div className='space-y-2'>
            <Label className='text-lg'>Full Name</Label>
            <Input
              className='bg-white'
              name='name'
              value={folderInfo?.summary?.person?.name}
              onChange={(e) =>
                setFolderInfo((p) => ({
                  summary: {
                    ...p.summary,
                    person: {
                      ...p.summary?.person,
                      name: e.target.value,
                    },
                  },
                }))
              }
            />
            {error.summary.person.name && (
              <span className='text-red-500'>{error.summary.person.name}</span>
            )}
          </div>
          <div className='space-y-2'>
            <Label className='text-lg'>About</Label>
            <Textarea
              className='bg-white'
              name='description'
              value={folderInfo?.summary?.person?.about}
              onChange={(e) =>
                setFolderInfo({
                  ...folderInfo,
                  summary: {
                    ...folderInfo?.summary,
                    person: {
                      ...folderInfo?.summary?.person,
                      about: e.target.value,
                    },
                  },
                })
              }
            />
            {error.summary.person.name && (
              <span className='text-red-500'>{error.summary.person.name}</span>
            )}
          </div>
          <div className='space-y-2'>
            <Label className='text-lg'>Email</Label>
            <Input
              className='bg-white'
              name='email'
              value={folderInfo?.summary?.person?.email}
              onChange={(e) =>
                setFolderInfo({
                  ...folderInfo,
                  summary: {
                    ...folderInfo?.summary,
                    person: {
                      ...folderInfo?.summary?.person,
                      email: e.target.value,
                    },
                  },
                })
              }
            />
            {error.summary.person.email && (
              <span className='text-red-500'>{error.summary.person.email}</span>
            )}
          </div>
          <div className='space-y-2'>
            <Label className='text-lg'>Phone No.</Label>
            <Input
              className='bg-white'
              name='phone'
              value={folderInfo?.summary?.person?.phone}
              onChange={(e) =>
                setFolderInfo({
                  ...folderInfo,
                  summary: {
                    ...folderInfo?.summary,
                    person: {
                      ...folderInfo?.summary?.person,
                      phone: e.target.value,
                    },
                  },
                })
              }
            />
            {error.summary.person.phone && (
              <span className='text-red-500'>{error.summary.person.phone}</span>
            )}
          </div>{' '}
          <div className='space-y-2'>
            <Label className='text-lg'>Experience</Label>
            <Input
              className='bg-white'
              name='exp_years'
              type='number'
              min={0}
              value={folderInfo?.summary?.person?.exp_years}
              onChange={(e) =>
                setFolderInfo({
                  ...folderInfo,
                  summary: {
                    ...folderInfo?.summary,
                    person: {
                      ...folderInfo?.summary?.person,
                      exp_years: e.target.value,
                    },
                  },
                })
              }
            />
            {error.summary.person.exp_years && (
              <span className='text-red-500'>
                {error.summary.person.exp_years}
              </span>
            )}
          </div>
          <div className='space-y-2'>
            <div className='flex flex-wrap gap-4'>
              {files?.map((media) => (
                <div key={media.id} className='flex items-center gap-2'>
                  <img
                    src={media.fileKey}
                    alt={media.name}
                    className='w-16 h-16 object-cover'
                  />
                  <span className='text-sm'>{media.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-[0.4]  space-y-6 log-1'>
          <div className='space-y-2'>
            <Label className='text-lg'>Qualifications</Label>
            <div className='  relative'>
              <Input
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
                    setFolderInfo({
                      ...folderInfo,
                      summary: {
                        ...folderInfo?.summary,
                        person: {
                          ...folderInfo?.summary?.person,
                          qualifications: [
                            ...folderInfo?.summary?.person?.qualifications,
                            qualificaitionTemp,
                          ],
                        },
                      },
                    });
                    setQualificaitionTemp('');
                  }}
                >
                  <PlusIcon className='w-8 h-8 ' />{' '}
                  <span className='text-lg font-semibold'>Add</span>
                </Button>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {folderInfo?.summary?.person?.qualifications?.map(
                (qualification) => (
                  <span
                    key={qualification}
                    className='bg-white flex cursor-pointer items-center gap-2 rounded-full border-[1px] border-gray-500 pl-2'
                  >
                    <span>{qualification}</span>
                    <button
                      className='bg-white rounded-full p-1 active:outline-gray-500 active:outline-[1px] cursor-pointer transition-all duration-300'
                      onClick={() => {
                        setFolderInfo({
                          ...folderInfo,
                          summary: {
                            ...folderInfo?.summary,
                            person: {
                              ...folderInfo?.summary?.person,
                              qualifications:
                                folderInfo?.summary?.person?.qualifications?.filter(
                                  (q) => q !== qualification
                                ),
                            },
                          },
                        });
                      }}
                    >
                      <XIcon className='w-4 h-4' />
                    </button>
                  </span>
                )
              )}
            </div>
            {error.summary.person.qualifications && (
              <span className='text-red-500'>
                {error.summary.person.qualifications}
              </span>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Label className='flex-1 text-lg'>Past Projects</Label>{' '}
              <Button className=' hover:bg-gray-300 cursor-pointer text-blue-500 outline-0 border-0 bg-transparent shadow-none '>
                <PlusIcon className='w-8 h-8 ' />{' '}
                <span className='text-lg font-semibold'>Add</span>
              </Button>
            </div>

            <div className='rounded-lg shadow-[0px_1px_12px_0px_#1F29370D] p-4 space-y-4 bg-white'>
              {folderInfo?.summary?.person?.projects?.map((project) => (
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
                  <Button
                    variant='ghost'
                    className='p-0 cursor-pointer'
                    onClick={() => {
                      setFolderInfo({
                        ...folderInfo,
                        summary: {
                          ...folderInfo?.summary,
                          person: {
                            ...folderInfo?.summary?.person,
                            projects:
                              folderInfo?.summary?.person?.projects?.filter(
                                (p) => p.name !== project.name
                              ),
                          },
                        },
                      });
                    }}
                  >
                    <Trash2 className='w-4 h-4 text-red-400' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
