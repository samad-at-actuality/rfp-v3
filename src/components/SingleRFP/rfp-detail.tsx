'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TRFP } from '@/types/TRfp';
import {
  Dispatch,
  JSX,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Calendar,
  FileIcon,
  Plus,
  Eye,
  Upload,
  CheckSquare,
  Target,
  AlertTriangle,
  HelpCircle,
  Info,
  History,
  XIcon,
  Loader2,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { TFolderInfoSummayType } from '@/types/TFolderInfo';
import {
  FileUploaderDialog,
  S3_UPLOADED_FILES_PAYLOAD,
} from '../file-uploader-dialog';
import { RfpSummaries } from './rfp-summary';
import { toast } from 'sonner';
import {
  generateSummary,
  getRfpAllVersion,
  updateRfp,
} from '@/lib/apis/rfpApi';
import { LoadingButton } from '../loading-button';
import { useRouter } from 'next/navigation';

import { useOrgCtx } from '@/ctx/org-ctx';
import { TOrgRole } from '@/types/TUserRole';

import { RfpFiles } from './rfp-files';
import { RfpSummmaryLinks } from './rfp-summay-links';
import Link from 'next/link';
import { formattedTimestamp } from '@/lib/utils';

const TOP_BAR_HEIGHT = 52;

export function RfpDetailPageWrapper({ rfp: rfp_ }: { rfp: TRFP }) {
  const [rfp, setRfp] = useState(rfp_);
  const { currentOrg } = useOrgCtx();
  const isViewer = currentOrg.role === TOrgRole.VIEWER;
  return (
    <RfpDetailPage
      rfp={rfp}
      allowSummaryEdit={!isViewer}
      showTopHeader={true}
      showSummaryBtn={rfp.latestVersion.inputFileKeys.length > 0}
      setRfp={setRfp}
      orgId={currentOrg.id}
      showUploadBtn={!isViewer}
      showVersinBtn={true}
    />
  );
}
export function RfpDetailPageWrapperForVersion({ rfp: rfp_ }: { rfp: TRFP }) {
  const [rfp, setRfp] = useState(rfp_);
  const { currentOrg } = useOrgCtx();

  return (
    <RfpDetailPage
      rfp={rfp}
      allowSummaryEdit={false}
      showTopHeader={false}
      showSummaryBtn={false}
      setRfp={setRfp}
      orgId={currentOrg.id}
      showUploadBtn={false}
      showVersinBtn={false}
    />
  );
}

function RfpDetailPage({
  rfp,
  orgId,
  setRfp,
  showTopHeader,
  allowSummaryEdit,
  showSummaryBtn,
  showUploadBtn,
  showVersinBtn,
}: {
  rfp: TRFP;
  orgId: string;
  setRfp: Dispatch<SetStateAction<TRFP>>;
  showTopHeader: boolean;
  allowSummaryEdit: boolean;
  showUploadBtn: boolean;
  showSummaryBtn: boolean;
  showVersinBtn: boolean;
}) {
  const router = useRouter();

  const isSummaryFound =
    Object.keys(rfp?.latestVersion?.summary || {}).length > 0;

  const summary = rfp.latestVersion?.summary;
  const uploadButtonRfp = useRef<HTMLButtonElement>(null);

  const [rfpVersions, setRfpVersions] = useState<
    (TRFP & { version: number })[]
  >([]);

  useEffect(() => {
    setRfpVersions([]);
  }, [rfp]);

  const [isVersionsPanelOpen, setIsVersionsPanelOpen] = useState(false);
  const [isLoadingRfpVersions, setIsLoadingRfpVersions] = useState(false);
  const handleGettingRfpVersions = async () => {
    if (rfpVersions.length > 0) {
      setIsVersionsPanelOpen(true);
      return;
    }
    try {
      setIsLoadingRfpVersions(true);
      const response = await getRfpAllVersion({ orgId, rfpId: rfp.id });
      if (response.data) {
        setRfpVersions(response.data);
        setIsVersionsPanelOpen(true);
      } else {
        toast.error('Failed to get rfp versions');
      }
    } catch {
      toast.error('Failed to get rfp versions');
    } finally {
      setIsLoadingRfpVersions(false);
    }
  };

  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await generateSummary({ orgId, rfpId: rfp.id });
      if (response.data) {
        toast.success(
          `Summary ${isSummaryFound ? 're-' : ''}generated successfully`
        );
        setRfp((p) => ({
          ...p,
          latestVersion: {
            ...p.latestVersion,
            summary: response.data.latestVersion.summary,
          },
        }));
      }
    } catch {
      toast.error(`Failed to ${isSummaryFound ? 're-' : ''}generate summary`);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const summary_tabs: {
    label: string;
    show: boolean;
    icon: JSX.Element;
  }[] = !summary
    ? []
    : [
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
          summary: rfp.latestVersion.summary,
          inputFileKeys: [
            ...rfp.latestVersion.inputFileKeys,
            ...payloads.map((p) => p.fileKey),
          ],
          template: rfp.latestVersion.template,
          responseContent: rfp.latestVersion.responseContent,
        },
      });
      if (res.data) {
        setRfp((p) => ({
          ...p,
          latestVersion: {
            ...p.latestVersion,
            inputFileKeys: [
              ...p.latestVersion.inputFileKeys,
              ...payloads.map((p) => p.fileKey),
            ],
          },
        }));
        return [];
      }
      return payloads;
    } catch {
      return payloads;
    }
  };
  const [openFileUploader, setFileUploader] = useState(
    rfp.latestVersion.inputFileKeys.length === 0
  );

  console.log('rfp: ', rfp);
  const [isChangingSummary, setIsChangingSummary] = useState(false);
  const handleSummayChange = async (
    key: string,
    value: string | string[] | object
  ) => {
    try {
      setIsChangingSummary(true);
      const newSummary = { ...rfp.latestVersion.summary };
      // @ts-ignore
      newSummary[key] = value;

      const payload = {
        status: rfp.status,
        summary: newSummary,
        inputFileKeys: rfp.latestVersion.inputFileKeys,
        template: rfp.latestVersion.template,
        responseContent: rfp.latestVersion.responseContent,
      };
      const res = await updateRfp({
        orgId,
        rfpId: rfp.id,
        payload,
      });
      if (res.data) {
        setRfp((p) => ({
          ...p,
          latestVersion: {
            ...p.latestVersion,
            summary: { ...newSummary },
          },
        }));
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
        <ResizablePanel defaultSize={15} minSize={5} maxSize={15}>
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
            {rfp.latestVersion.inputFileKeys?.length > 0 && (
              <RfpFiles files={rfp.latestVersion.inputFileKeys} />
            )}
            <Separator />

            {summary_tabs?.length > 0 && isSummaryFound && (
              <RfpSummmaryLinks summary_tabs={summary_tabs} />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85}>
          <div className='w-full h-full overflow-hidden flex'>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isVersionsPanelOpen ? 'w-[70%]' : 'w-full'
              }`}
            >
              <div className='w-full h-full overflow-hidden flex flex-col'>
                {showTopHeader && (
                  <>
                    <div
                      className='flex items-center py-4 mb-1 pl-2 gap-2 justify-end h-[52px] pr-'
                      style={{
                        height: `${TOP_BAR_HEIGHT}px`,
                      }}
                    >
                      <div className='flex-1'>
                        {showSummaryBtn &&
                          rfp.latestVersion.inputFileKeys.length > 0 && (
                            <LoadingButton
                              label={`${isSummaryFound ? 'Regenerate' : 'Generate'} Summary`}
                              isLoading={isLoadingSummary}
                              onClick={handleGenerateSummary}
                              className='bg-white text-gray-800  border-[1px] border-gray-200 hover:bg-gray-100'
                            />
                          )}
                      </div>
                      {showVersinBtn && (
                        <Button
                          variant='ghost'
                          disabled={isLoadingRfpVersions}
                          size='sm'
                          onClick={handleGettingRfpVersions}
                          className={`gap-1 mr-2 bg-white text-black hover:bg-gray-200 border-[1px] border-gray-100`}
                        >
                          {isLoadingRfpVersions ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <History className='h-4 w-4' />
                          )}
                        </Button>
                      )}
                      {showUploadBtn && (
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
                  </>
                )}
                <div className='flex-1 h-full overflow-y-auto scrollbar-thin p-4'>
                  <RfpSummaries
                    isChangingSummary={isChangingSummary}
                    showEdit={allowSummaryEdit}
                    summary={summary}
                    handleSummayChange={handleSummayChange}
                  />
                </div>
              </div>
            </div>
            <div
              className={`overflow-auto transition-all duration-300 border-l-2 ${
                isVersionsPanelOpen ? 'w-[30%]' : 'w-0'
              }`}
            >
              <div className='w-full h-full overflow-hidden flex flex-col'>
                <div
                  className='items-center py-4 mb-1 h-[52px] flex justify-between px-4'
                  style={{
                    height: `${TOP_BAR_HEIGHT}px`,
                  }}
                >
                  <h3 className='font-semibold'>RFP Versions</h3>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsVersionsPanelOpen(false)}
                  >
                    <XIcon className='w-4 h-4' />
                  </Button>
                </div>
                <Separator />

                <div className='flex-1 h-full overflow-y-auto scrollbar-thin p-4 pt-0 flex flex-col gap-2'>
                  {rfpVersions
                    .sort((a, b) => b.version - a.version)
                    .map((rfpVersion, index) => (
                      <Link
                        key={rfpVersion.id}
                        href={`/app/orgs/${orgId}/rfps/${rfp.id}/v/${rfpVersion.version}`}
                      >
                        <div className='p-2 hover:bg-gray-100 rounded-md cursor-pointer'>
                          <div className='flex items-end gap-2'>
                            <p className='font-medium'>
                              Version {rfpVersion.version}
                            </p>
                            {index === 0 && (
                              <p className='text-gray-500 text-xs italic'>
                                Current Version
                              </p>
                            )}
                          </div>

                          <p className='text-sm text-gray-500'>
                            {formattedTimestamp(rfpVersion.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
