'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TRFP } from '@/types/TRfp';
import { JSX, useEffect, useRef, useState } from 'react';

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
  Users,
  FileText,
  Sparkles,
  MoreHorizontal,
  Pencil,
  PencilLine,
  File,
  TestTube2,
  Copy,
  X,
  RotateCcw,
  RotateCw,
  Bot,
  FilePlus2,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { TFolderInfoSummayType, TOtherInfo } from '@/types/TFolderInfo';
import {
  FileUploaderDialog,
  S3_UPLOADED_FILES_PAYLOAD,
} from '../file-uploader-dialog';
// import { PhSummary } from './rfp-summary';
import { cn, extractFileNameFromKey } from '@/lib/utils';
import { toast } from 'sonner';
import { generateSummary, updateRfp } from '@/lib/apis/rfpApi';
import { LoadingButton } from '../loading-button';
import { useRouter } from 'next/navigation';

import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';
import Link from 'next/link';
import { PhSummary } from './ph-summary';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';

const TOP_BAR_HEIGHT = 52;

export default function PhPage({
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

  console.log('isViewer: ', isViewer);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [summary, setSummary] = useState<TRFP['latestVersion']['summary']>(
    rfp_?.latestVersion?.summary || {}
  );

  const [active, setActive] = useState('prompt');

  const [openSummary, setOpenSummary] = useState(true);

  const summarySections = [
    'Overview',
    'Key dates',
    'Submission requirements',
    'Evaluation criteria',
    'Scope of work',
  ];

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<{
    [key: number]: { index: number; title: string; prompt: string };
  }>({});

  const models = [
    { id: 'gemini', label: 'Gemini 2.5', icon: '/assets/gemini.svg' },
    { id: 'gpt4.5', label: 'GPT 4.5', icon: '/assets/chatgpt.svg' },
    { id: 'gpt5', label: 'GPT 5', icon: '/assets/chatgpt.svg' },
  ];

  const [selected, setSelected] = useState(models[0]); // Default = Gemini 2.5

  // Default prompt template
  const defaultPrompt = `Based on the RFP content below, create a concise 50-word maximum overview of the RFP. Focus only on the core project purpose, client, location, and deliverables. Maintain simple English and formal tone.\n\n\${content}\n\nFormatting Rules:\n- Use 1 short paragraph.\n- Do not exceed 50 words.\n- No extra commentary.`;

  const handleOpenForm = (title: string) => {
    setActiveSection(activeSection === title ? null : title); // toggle
  };

  const [openResponse, setOpenResponse] = useState(false);

  const [prompt, setPrompt] = useState(
    `Based on the RFP content below, create a concise 50-word maximum overview of the RFP. Focus only on the core project purpose, client, location, and deliverables. Maintain simple English and formal tone.\n\n\${content}\n\nFormatting Rules:\n- Use 1 short paragraph.\n- Do not exceed 50 words.\n- No extra commentary.`
  );

  const buttons = [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'askRfp', label: 'Ask RFP', icon: FileText },
    { id: 'prompt', label: 'Prompt', icon: Sparkles },
  ];

  const [showDialog, setShowDialog] = useState(false);

  const handleCancel = () => {
    console.log('Discarded ❌');
    setShowDialog(false);
  };

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
    <div
      className='w-full h-full overflow-hidden bg-white'
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
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
        <ResizablePanel defaultSize={55} maxSize={80} minSize={40}>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            <div className='w-full h-full overflow-hidden flex flex-col'>
              <div
                className='flex items-center py-4 mb-1 pl-2 gap-2 justify-between h-[52px] pr-6'
                style={{
                  height: `${TOP_BAR_HEIGHT}px`,
                }}
              >
                <div className='buttons-summary px-2'>
                  {!isViewer && proposalFiles.length > 0 && (
                    <LoadingButton
                      label={`${Object.keys(summary).length > 0 ? 'Regenerate' : 'Generate'} Summary`}
                      isLoading={isLoadingSummary}
                      onClick={handleGenerateSummary}
                      className='bg-white text-gray-800  border-[1px] border-gray-100 hover:bg-gray-100 mr-2'
                    />
                  )}
                  {!isViewer && proposalFiles.length > 0 && (
                    <LoadingButton
                      label={`Generate Response`}
                      isLoading={isLoadingResponse}
                      // onClick={handleGenerateSummary}
                      className='bg-white text-gray-800  border-[1px] border-gray-100 hover:bg-gray-100'
                    />
                  )}
                </div>

                <div className='uploader'>
                  {!isViewer && (
                    <FileUploaderDialog
                      open={openFileUploader}
                      setOpen={setFileUploader}
                      trigger={
                        <Button
                          ref={uploadButtonRfp}
                          size='sm'
                          variant='default'
                          className={`gap-1 mr-2 bg-white text-[#6B7280] hover:bg-gray-200 border-[1px] border-gray-100`}
                        >
                          <FilePlus2 className='w-5 h-5' />
                          {/* <FileIcon className='w-4 h-4' /> */}
                        </Button>
                      }
                      orgId={rfp.orgId}
                      folderId={rfp.id}
                      type={TFolderInfoSummayType.RFP_SUMMARY}
                      onUpload={handleProposalUpload}
                    />
                  )}
                </div>
              </div>
              <Separator />
              <div className='flex-1 h-full overflow-y-auto scrollbar-thin p-4'>
                <div className='flex flex-col gap-2'>
                  {summary?.overview && (
                    <PhSummary
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
                    <PhSummary
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
                      <PhSummary
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
                    <PhSummary
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
                    <PhSummary
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
                      <PhSummary
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
                    <PhSummary
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
                    <PhSummary
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
        <ResizablePanel defaultSize={25} minSize={10} maxSize={30}>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto no-scrollbar'>
            <div className='flex flex-col items-center justify-between     bg-white border-r  '>
              {/* Top Buttons */}
              <div
                className='p-3 mb-1'
                style={{
                  height: `${TOP_BAR_HEIGHT}px`,
                }}
              >
                <div className='flex items-center gap-1 bg-gray-100  rounded-sm '>
                  {buttons.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      // onClick={() => setActive(id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all',
                        active === id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className=' w-full rounded-0'>
                {/* Summary */}
                <details
                  open={openSummary}
                  onToggle={(e) =>
                    setOpenSummary((e.target as HTMLDetailsElement).open)
                  }
                  className='w-full rounded-0'
                >
                  {/* Header */}
                  <summary
                    style={{
                      backgroundColor: openSummary ? '#EEF2FF' : 'white',
                    }}
                    className='flex items-center justify-between cursor-pointer list-none p-3 hover:bg-gray-100'
                  >
                    <div
                      className='flex items-center gap-2 text-sm'
                      style={{ fontWeight: '600' }}
                    >
                      {openSummary ? (
                        <ChevronUp className='w-4 h-4 text-gray-500' />
                      ) : (
                        <ChevronDown className='w-4 h-4 text-gray-500' />
                      )}
                      <span>Summary</span>
                    </div>
                    <MoreHorizontal className='w-4 h-4 text-gray-500' />
                  </summary>

                  {/* Section list */}
                  {summarySections.map((title, index) => {
                    return (
                      <ul className='mt-2 font-semibold' key={title}>
                        <li className='flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50'>
                          <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-500'>
                              <File className='w-4 h-4' />
                            </div>
                            <span className='text-sm text-gray-800'>
                              {title}
                            </span>
                          </div>
                          <div className='flex gap-2'>
                            {activeSection === title ? (
                              <>
                                <button className='flex items-center justify-center w-7 h-7 rounded-md   bg-white shadow-sm border border-gray-200 hover:bg-gray-50'>
                                  <RotateCcw className='w-3 h-3 text-gray-500 hover:text-gray-600 cursor-pointer' />
                                </button>
                                <button className='flex items-center justify-center w-7 h-7 rounded-md   bg-white shadow-sm border border-gray-200 hover:bg-gray-50'>
                                  <RotateCw className='w-3 h-3 text-gray-500 hover:text-gray-600 cursor-pointer' />
                                </button>
                                <button
                                  style={{ backgroundColor: '#F3F4F6' }}
                                  className='flex items-center justify-center w-7 h-7 rounded-md   bg-white shadow-sm border   '
                                >
                                  <PencilLine
                                    className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer'
                                    onClick={() => handleOpenForm(title)}
                                  />
                                </button>
                              </>
                            ) : (
                              <>
                                <PencilLine
                                  className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer'
                                  onClick={() => handleOpenForm(title)}
                                />
                              </>
                            )}
                          </div>
                        </li>

                        {activeSection === title && (
                          <div className='px-3 py-2'>
                            <Card
                              style={{ backgroundColor: '#F3F4F6' }}
                              className='w-full border rounded-lg shadow-sm pt-2 gap-0'
                            >
                              {/* Header */}
                              <CardHeader className='flex items-center gap-1 justify-end px-3'>
                                <Copy className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
                                <X
                                  onClick={() => setActiveSection(null)}
                                  className='w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer ml-1'
                                />
                              </CardHeader>

                              {/* JSON Content */}
                              <CardContent className='px-3 py-0 m-0'>
                                <pre className='text-xs text-gray-800 whitespace-pre-wrap  m-0'>
                                  {`{
  "index": ${index},
  "title": "${title}",
  "prompt": `}
                                </pre>
                                <textarea
                                  value={prompt}
                                  onChange={(e) => setPrompt(e.target.value)}
                                  rows={6}
                                  className='w-full text-xs text-xs text-gray-800 font-mono bg-transparent   px-2 py-1 my-1 rounded'
                                />
                                <pre className='text-xs text-gray-800 whitespace-pre-wrap m-0'>
                                  {`}`}
                                </pre>
                              </CardContent>

                              {/* Footer */}
                              <CardFooter className='flex items-center justify-between gap-2 px-3 mt-2'>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      className='bg-white border rounded-md px-3 py-1 text-[#6B7280] text-sm font-medium flex items-center gap-1'
                                      variant='outline'
                                      size='sm'
                                    >
                                      <img
                                        src={selected.icon}
                                        alt={selected.label}
                                        className='w-4 h-4'
                                      />
                                      {selected.label}
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent
                                    align='start'
                                    className='w-[120px]'
                                  >
                                    {models.map((model) => (
                                      <DropdownMenuItem
                                        key={model.id}
                                        onClick={() => setSelected(model)}
                                        className={`flex items-center gap-2 cursor-pointer ${
                                          selected.id === model.id
                                            ? 'text-purple-600 font-semibold bg-purple-50'
                                            : 'text-gray-700'
                                        }`}
                                      >
                                        <img
                                          src={model.icon}
                                          alt={model.label}
                                          className='w-4 h-4'
                                        />
                                        {model.label}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <div className='flex gap-1'>
                                  <Button
                                    className='bg-white'
                                    variant='outline'
                                    size={'sm'}
                                  >
                                    Test
                                  </Button>
                                  <Button
                                    size={'sm'}
                                    onClick={() => setShowDialog(true)}
                                  >
                                    Publish
                                  </Button>

                                  <Dialog
                                    open={showDialog}
                                    onOpenChange={setShowDialog}
                                  >
                                    <DialogContent className='sm:max-w-[380px] rounded-xl p-6'>
                                      {/* Close Button */}

                                      {/* Icon */}
                                      <div className='flex justify-start mb-1'>
                                        <div className='  flex items-center justify-center rounded-full bg-purple-100'>
                                          <img
                                            src='/assets/rounded-file.svg'
                                            alt='fileImage'
                                            className='w-15 h-15'
                                          />
                                        </div>
                                      </div>

                                      {/* Title */}
                                      <DialogHeader className='text-center  '>
                                        <DialogTitle
                                          style={{ fontSize: '20px' }}
                                          className='text-gray-900 font-semibold  '
                                        >
                                          Publish changes
                                        </DialogTitle>
                                        <DialogDescription
                                          style={{ fontSize: '16px' }}
                                          className='text-sm text-gray-600'
                                        >
                                          Do you want to Publish or discard
                                          changes?
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className='flex gap-2 w-full max-w-sm'>
                                        {/* Cancel Button */}
                                        <button
                                          onClick={() => setShowDialog(false)}
                                          className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-100 font-medium'
                                        >
                                          Cancel
                                        </button>

                                        {/* Publish Button */}
                                        <button
                                          onClick={() => {
                                            const jsonData = {
                                              index,
                                              title,
                                              prompt,
                                            };
                                            console.log(
                                              'Saved JSON:',
                                              jsonData
                                            );
                                            setPrompts(jsonData);
                                            // setPrompt(defaultPrompt);
                                            // setActiveSection(null);
                                            setShowDialog(false);
                                          }}
                                          className='flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium'
                                        >
                                          Publish
                                        </button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </CardFooter>
                            </Card>
                          </div>
                        )}
                      </ul>
                    );
                  })}
                </details>

                {/* Response */}
                <details
                  open={openResponse}
                  onToggle={(e) =>
                    setOpenResponse((e.target as HTMLDetailsElement).open)
                  }
                  className='w-full rounded-0 '
                >
                  {/* Header */}
                  <summary
                    style={{
                      backgroundColor: openResponse ? '#EEF2FF' : 'white',
                    }}
                    className='flex items-center justify-between cursor-pointer list-none p-3       hover:bg-gray-100'
                  >
                    <div
                      className='flex items-center gap-2   text-sm'
                      style={{ fontWeight: '600' }}
                    >
                      {openResponse ? (
                        <ChevronUp className='w-4 h-4 text-gray-500' />
                      ) : (
                        <ChevronDown className='w-4 h-4 text-gray-500' />
                      )}
                      <span>Response</span>
                    </div>
                    <MoreHorizontal className='w-4 h-4 text-gray-500' />
                  </summary>

                  {/* Dropdown content */}
                  <ul className='mt-2' style={{ fontWeight: '600' }}>
                    <li className='flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-500'>
                          <File className='w-4 h-4' />
                        </div>
                        <span className='text-sm   text-gray-800'>
                          Overview
                        </span>
                      </div>
                      <PencilLine className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
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
