'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TRFP } from '@/types/TRfp';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileIcon,
  Plus,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { TFolderInfoSummayType, TOtherInfo } from '@/types/TFolderInfo';
import {
  FileUploaderDialog,
  S3_UPLOADED_FILES_PAYLOAD,
} from '../file-uploader-dialog';
import { RfpSummary } from './rfp-summary';
import { __sample_markdown, otherInfoToMDTable } from '@/lib/utils';
import { toast } from 'sonner';
import { generateSummary, updateRfp } from '@/lib/apis/rfpApi';
import { LoadingButton } from '../loading-button';
import { useRouter } from 'next/navigation';

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

  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summary, setSummary] = useState(rfp_?.latestVersion?.summary);
  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await generateSummary({ orgId, rfpId: rfp_.id });
      if (response.data) {
        toast.success(`Summary ${summary ? 're-' : ''}generated successfully`);
        setSummary(response.data.latestVersion.summary);
      }
    } catch {
      toast.error(`Failed to ${summary ? 're-' : ''}generate summary`);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (proposalFiles.length === 0) {
      uploadButtonRfp.current?.click();
    }
  }, []);

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
            {proposalFiles.length > 0 && <RfpDocuments files={proposalFiles} />}
            <Separator />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            <div className='w-full h-full overflow-hidden flex flex-col'>
              <div
                className='flex items-center py-4 mb-1 pl-2 gap-2 justify-end h-[52px] pr-6'
                style={{
                  height: `${TOP_BAR_HEIGHT}px`,
                }}
              >
                {proposalFiles.length > 0 && (
                  <LoadingButton
                    label={summary ? 'Re-Generate Summary' : 'Generate Summary'}
                    isLoading={isLoadingSummary}
                    onClick={handleGenerateSummary}
                    className='bg-white text-gray-800  border-[1px] border-gray-100 hover:bg-gray-100'
                  />
                )}

                <FileUploaderDialog
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
              </div>
              <Separator />
              <div className='flex-1 h-full overflow-y-auto scrollbar-thin p-4'>
                <div className='flex flex-col gap-2'>
                  {summary?.coverLetter && (
                    <RfpSummary
                      label='Cover Letter'
                      markdown={summary.coverLetter}
                    />
                  )}
                  {summary?.submissionRequirements && (
                    <RfpSummary
                      label='Submission Requirements'
                      markdown={summary.submissionRequirements
                        .map((it) => `- ${it}`)
                        .join('\n\n')}
                    />
                  )}
                  {summary?.evaluationCriteria && (
                    <RfpSummary
                      label='Evaluation Criteria'
                      markdown={summary.evaluationCriteria}
                    />
                  )}
                  {summary?.scopeOfWork && (
                    <RfpSummary
                      label='Scope of Work'
                      markdown={summary.scopeOfWork}
                    />
                  )}{' '}
                  {summary?.discrepancies && (
                    <RfpSummary
                      label='Discrepancies'
                      markdown={summary.discrepancies
                        .map((it) => `- ${it.description} (${it.type})`)
                        .join('\n\n')}
                    />
                  )}
                  {summary?.questions && (
                    <RfpSummary
                      label='Questions'
                      markdown={summary.questions
                        .map((it) => `- ${it}`)
                        .join('\n\n')}
                    />
                  )}
                  {summary?.otherInfo.length > 0 && (
                    <RfpSummary
                      label='Other Info'
                      markdown={otherInfoToMDTable(
                        summary.otherInfo as TOtherInfo[]
                      )}
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
      <summary className='cursor-pointer list-none font-medium flex items-center gap-1'>
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
              {file}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
