'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TRFP } from '@/types/TRfp';
import { JSX, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileIcon,
  Plus,
  Eye,
  Upload,
  CheckSquare,
  Target,
  AlertTriangle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { TFolderInfoSummayType, TOtherInfo } from '@/types/TFolderInfo';
import {
  FileUploaderDialog,
  S3_UPLOADED_FILES_PAYLOAD,
} from '../file-uploader-dialog';
import { RfpSummary } from './rfp-summary';
import { extractFileNameFromKey } from '@/lib/utils';
import { toast } from 'sonner';
import { generateSummary, updateRfp } from '@/lib/apis/rfpApi';
import { LoadingButton } from '../loading-button';
import { useRouter } from 'next/navigation';

import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';
import Link from 'next/link';

const TOP_BAR_HEIGHT = 52;

export default function RfpPage({
  rfp: rfp_,
  orgId,
}: {
  rfp: TRFP;
  orgId: string;
}) {
  const router = useRouter();
  const [rfp, _] = useState(rfp_);
  const uploadButtonRfp = useRef<HTMLButtonElement>(null);
  const [proposalFiles, setProposalFiles] = useState<string[]>(
    rfp?.latestVersion?.inputFileKeys || []
  );
  const {
    currentOrg: { role: crtOrgAccess },
  } = useOrgCtx();

  const isAdmin = crtOrgAccess === TOrgRole.ADMIN;
  const isViewer = crtOrgAccess === TOrgRole.VIEWER;

  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summary, setSummary] = useState<TRFP['latestVersion']['summary']>(
    rfp_?.latestVersion?.summary || {}
  );

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await generateSummary({ orgId, rfpId: rfp_.id });
      if (response.data) {
        const rfp = response.data;
        toast.success(`Summary ${summary ? 're-' : ''}generated successfully`);
        setSummary(rfp.latestVersion.summary);
      }
    } catch {
      toast.error(`Failed to ${summary ? 're-' : ''}generate summary`);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (proposalFiles.length === 0 && !isViewer) {
      uploadButtonRfp.current?.click();
    }
  }, []);

  const summary_tabs: {
    label: string;
    show: boolean;
    icon: JSX.Element;
  }[] = [
    {
      label: 'Overview',
      show: !!summary.overview,
      icon: <Eye className='w-4 h-4' />, // Changed from FileIcon to Eye for better representation
    },
    {
      label: 'Key Dates',
      show: !!summary.keyDates,
      icon: <Calendar className='w-4 h-4' />, // Keep Calendar as it's appropriate
    },
    {
      label: 'Submission requirements',
      show: !!summary?.submissionRequirements?.length,
      icon: <Upload className='w-4 h-4' />, // Represents submitting/uploading documents
    },
    {
      label: 'Evaluation criteria',
      show: !!summary?.evaluationCriteria?.length,
      icon: <CheckSquare className='w-4 h-4' />, // Represents checking off criteria
    },
    {
      label: 'Scope of work',
      show: !!summary?.scopeOfWork,
      icon: <Target className='w-4 h-4' />, // Represents focus and scope
    },
    {
      label: 'Discrepencies',
      show: !!summary?.discrepancies?.length,
      icon: <AlertTriangle className='w-4 h-4' />, // Represents warnings/issues
    },
    {
      label: 'Questions',
      show: !!summary?.questions?.length,
      icon: <HelpCircle className='w-4 h-4' />, // Clearly represents questions
    },
    {
      label: 'Other info',
      show: !!summary?.otherInfo?.length,
      icon: <Info className='w-4 h-4' />, // Standard information icon
    },
  ];

  const handleProposalUpload = async (
    payloads: S3_UPLOADED_FILES_PAYLOAD[]
  ) => {
    try {
      const res = await updateRfp({
        orgId,
        rfpId: rfp.id,
        payload: {
          status: rfp.status,
          summary: summary,
          inputFileKeys: [
            ...rfp.latestVersion.inputFileKeys,
            ...payloads.map((p) => p.fileKey),
          ],
          template: rfp.latestVersion.template,
          responseContent: rfp.latestVersion.responseContent,
        },
      });
      if (res.data) {
        setProposalFiles((p) => [...p, ...payloads.map((p) => p.fileKey)]);
        return [];
      }
      return payloads;
    } catch {
      return payloads;
    }
  };
  const [openFileUploader, setFileUploader] = useState(
    proposalFiles.length === 0
  );
  console.log('rfp: ', rfp);
  const [isChangingSummary, setIsChangingSummary] = useState(false);
  const handleSummayChange = async (
    key: string,
    value: string | string[] | object
  ) => {
    try {
      setIsChangingSummary(true);
      const newSummary = { ...summary };
      // @ts-ignore
      newSummary[key] = value;

      const payload = {
        status: rfp.status,
        summary: newSummary,
        inputFileKeys: rfp.latestVersion.inputFileKeys,
        template: rfp.latestVersion.template,
        responseContent: rfp.latestVersion.responseContent,
      };
      console.log('payload: ', payload);
      const res = await updateRfp({
        orgId,
        rfpId: rfp.id,
        payload,
      });
      if (res.data) {
        setSummary(res.data.latestVersion.summary);
        toast.success(`Summary updated successfully`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update summary ${key}`);
    } finally {
      setIsChangingSummary(false);
    }
  };

  return (
    <div className='w-full h-full overflow-hidden bg-white'>
      <ResizablePanelGroup direction='horizontal' autoSaveId='rfp-layout'>
        <ResizablePanel defaultSize={20} minSize={5} maxSize={20}>
          <div className='w-full h-full overflow-hidden flex flex-col'>
            <div
              className='flex items-center py-4 mb-1 pl-2 gap-2'
              style={{
                height: `${TOP_BAR_HEIGHT}px`,
              }}
            >
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeft />
              </Button>

              <h1 className='text-xl flex-1 font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                {rfp.name}
              </h1>
            </div>
            <Separator />
            {proposalFiles?.length > 0 && (
              <RfpDocuments files={proposalFiles} />
            )}
            <Separator />

            {summary_tabs?.length > 0 && Object.keys(summary).length > 0 && (
              <SummmaryTabs summary_tabs={summary_tabs} />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            <div className='w-full h-full overflow-hidden flex flex-col'>
              <div
                className='flex items-center py-4 mb-1 pl-2 gap-2 justify-end h-[52px] pr-6'
                style={{
                  height: `${TOP_BAR_HEIGHT}px`,
                }}
              >
                {!isViewer && proposalFiles.length > 0 && (
                  <LoadingButton
                    label={`${Object.keys(summary).length > 0 ? 'Regenerate' : 'Generate'} Summary`}
                    isLoading={isLoadingSummary}
                    onClick={handleGenerateSummary}
                    className='bg-white text-gray-800  border-[1px] border-gray-100 hover:bg-gray-100'
                  />
                )}

                {!isViewer && (
                  <FileUploaderDialog
                    open={openFileUploader}
                    setOpen={setFileUploader}
                    trigger={
                      <Button
                        ref={uploadButtonRfp}
                        size='sm'
                        variant='default'
                        className={`gap-1 mr-2 bg-white text-black hover:bg-gray-200 border-[1px] border-gray-100`}
                      >
                        <Plus className='w-4 h-4' />
                        <FileIcon className='w-4 h-4' />
                      </Button>
                    }
                    orgId={rfp.orgId}
                    folderId={rfp.id}
                    type={TFolderInfoSummayType.RFP_SUMMARY}
                    onUpload={handleProposalUpload}
                  />
                )}
              </div>
              <Separator />
              <div className='flex-1 h-full overflow-y-auto scrollbar-thin p-4'>
                <div className='flex flex-col gap-2'>
                  {summary?.overview && (
                    <RfpSummary
                      id='Overview'
                      isDisableEdit={isViewer}
                      label='Overview'
                      key={summary.overview}
                      markdown={summary.overview}
                      onMarkdownChange={async (markdown) => {
                        await handleSummayChange('overview', markdown);
                      }}
                      isLoading={isChangingSummary}
                    />
                  )}
                  {summary?.keyDates && (
                    <RfpSummary
                      id='KeyDates'
                      isDisableEdit={isViewer}
                      label='Key Dates'
                      key={JSON.stringify(summary.keyDates)}
                      markdown={
                        summary.keyDates.otherDates?.find(
                          (x) => x.date === 'MANUAL'
                        )?.description ||
                        `- **Issue Date:** ${summary.keyDates.issueDate || 'N/A'}
- **Submission Deadline:** ${summary.keyDates.submissionDeadline || 'N/A'}
- **QnA Deadline:** ${summary.keyDates.qnaDeadline || 'N/A'}
- **Award Date:** ${summary.keyDates.awardDate || 'N/A'}
${summary.keyDates.otherDates
  ?.filter((it) => it.date && it.date !== 'MANUAL')
  .map((it) => `- **${it.description}**: ${it.date}`)
  .join('\n\n')}
`
                      }
                      onMarkdownChange={async (markdown) => {
                        await handleSummayChange('keyDates', {
                          ...summary.keyDates,
                          otherDates: [
                            ...(summary.keyDates?.otherDates || []).filter(
                              (x) => x.date && x.date !== 'MANUAL'
                            ),
                            { date: 'MANUAL', description: markdown },
                          ],
                        });
                      }}
                      isLoading={isChangingSummary}
                    />
                  )}
                  {summary?.submissionRequirements &&
                    summary?.submissionRequirements?.length > 0 && (
                      <RfpSummary
                        id='SubmissionRequirements'
                        isDisableEdit={isViewer}
                        label='Submission Requirements'
                        key={JSON.stringify(summary.submissionRequirements)}
                        markdown={
                          summary.submissionRequirements.length > 1
                            ? summary.submissionRequirements
                                .map((it) => `- ${it}`)
                                .join('\n\n')
                            : summary.submissionRequirements[0]
                        }
                        onMarkdownChange={async (markdown) => {
                          await handleSummayChange('submissionRequirements', [
                            markdown,
                          ]);
                        }}
                        isLoading={isChangingSummary}
                      />
                    )}
                  {summary?.evaluationCriteria && (
                    <RfpSummary
                      id='EvaluationCriteria'
                      isDisableEdit={isViewer}
                      label='Evaluation Criteria'
                      key={summary.evaluationCriteria}
                      onMarkdownChange={async (markdown) => {
                        await handleSummayChange(
                          'evaluationCriteria',
                          markdown
                        );
                      }}
                      isLoading={isChangingSummary}
                      markdown={summary.evaluationCriteria}
                    />
                  )}
                  {summary?.scopeOfWork && (
                    <RfpSummary
                      id='ScopeOfWork'
                      isDisableEdit={isViewer}
                      label='Scope of Work'
                      key={summary.scopeOfWork}
                      onMarkdownChange={async (markdown) => {
                        await handleSummayChange('scopeOfWork', markdown);
                      }}
                      isLoading={isChangingSummary}
                      markdown={summary.scopeOfWork}
                    />
                  )}
                  {summary?.discrepancies &&
                    summary?.discrepancies?.length > 0 && (
                      <RfpSummary
                        id='Discrepancies'
                        isDisableEdit={isViewer}
                        label='Discrepancies'
                        key={JSON.stringify(summary.discrepancies)}
                        markdown={
                          summary.discrepancies.find((d) => d.type === 'MANUAL')
                            ?.description ||
                          summary.discrepancies
                            .map((it) => `- ${it.description} `)
                            .join('\n\n')
                        }
                        onMarkdownChange={async (markdown) => {
                          await handleSummayChange('discrepancies', [
                            ...(summary.discrepancies?.filter(
                              (d) => d.type !== 'MANUAL'
                            ) || []),
                            { description: markdown, type: 'MANUAL' },
                          ]);
                        }}
                        isLoading={isChangingSummary}
                      />
                    )}
                  {summary?.questions && summary?.questions.length > 0 && (
                    <RfpSummary
                      id='Questions'
                      isDisableEdit={isViewer}
                      label='Questions'
                      key={JSON.stringify(summary.questions)}
                      markdown={
                        summary.questions.length > 1
                          ? summary.questions
                              .map((it) => `- ${it}`)
                              .join('\n\n')
                          : summary.questions[0]
                      }
                      onMarkdownChange={async (markdown) => {
                        await handleSummayChange('questions', [markdown]);
                      }}
                      isLoading={isChangingSummary}
                    />
                  )}
                  {summary?.otherInfo && summary?.otherInfo.length > 0 && (
                    <RfpSummary
                      id='OtherInfo'
                      isDisableEdit={isViewer}
                      label='Other Info'
                      key={JSON.stringify(summary.otherInfo)}
                      onMarkdownChange={async (markdown) => {
                        await handleSummayChange('otherInfo', [
                          ...(summary.otherInfo?.filter(
                            (o) => o.key && o.key !== 'MANUAL'
                          ) || []),
                          { value: markdown, key: 'MANUAL' },
                        ]);
                      }}
                      isLoading={isChangingSummary}
                      markdown={
                        summary.otherInfo.find((o) => o.key === 'MANUAL')
                          ?.value ||
                        summary.otherInfo
                          .map((p) => `**${p.key}**: ${p.value}`)
                          .join('\n\n')
                        // otherInfoToMDTable(
                        //   summary.otherInfo.filter(
                        //     (o) => o.key !== 'MANUAL'
                        //   ) as TOtherInfo[]
                        // )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={0} minSize={0} maxSize={20}>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'></div>
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>
    </div>
  );
}

function RfpDocuments({ files }: { files: string[] }) {
  const [open, setOpen] = useState(true);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className='w-full p-4'
    >
      <summary className='cursor-pointer list-none font-medium flex items-center gap-2'>
        {open ? (
          <ChevronUp className='w-4 h-4' />
        ) : (
          <ChevronDown className='w-4 h-4' />
        )}
        <span>RFP Documents</span>
      </summary>

      <ul className='ml-6 mt-4 space-y-6'>
        {files.map((file) => (
          <li className='flex items-center gap-2 hover:text-black' key={file}>
            <FileIcon className='w-4 h-4' />
            <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
              {extractFileNameFromKey(file)}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function SummmaryTabs({
  summary_tabs,
}: {
  summary_tabs: {
    label: string;
    show: boolean;
    icon: JSX.Element;
  }[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className='w-full p-4'
    >
      <summary className='cursor-pointer list-none font-medium flex items-center gap-2'>
        {open ? (
          <ChevronUp className='w-4 h-4' />
        ) : (
          <ChevronDown className='w-4 h-4' />
        )}
        <span>Summary</span>
      </summary>

      <ul className='ml-6 mt-4 space-y-4'>
        {summary_tabs
          .filter((x) => x.show)
          .map((tab) => (
            <li
              className='flex items-center gap-2 hover:text-black'
              key={tab.label}
            >
              <Link
                className='flex items-center gap-2 hover:text-black w-full h-full'
                href={`#${tab.label.split(' ').join('')}`}
              >
                {tab.icon}
                <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
                  {tab.label}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </details>
  );
}
