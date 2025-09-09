'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TRFP } from '@/types/TRfp';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileIcon,
  Plus,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { TFolderInfoSummayType } from '@/types/TFolderInfo';
import { FileUploaderDialog } from '../file-uploader-dialog';
import { RfpSummary } from './rfp-summary';
import { __sample_markdown } from '@/lib/utils';

const TOP_BAR_HEIGHT = 52;
export default function RfpPage({ rfp: rfp_ }: { rfp: TRFP }) {
  const [rfp, setRfp] = useState(rfp_);

  return (
    <div className='w-full h-full overflow-hidden'>
      <ResizablePanelGroup direction='horizontal' autoSaveId='rfp-layout'>
        <ResizablePanel defaultSize={20} minSize={5} maxSize={20}>
          <div className='w-full h-full overflow-hidden flex flex-col'>
            <div
              className='flex items-center py-4 mb-1 pl-2 gap-2'
              style={{
                height: `${TOP_BAR_HEIGHT}px`,
              }}
            >
              <Link href={`/app/orgs/rfps/${rfp.id}`}>
                <Button variant='ghost' size='sm'>
                  <ArrowLeft />
                </Button>
              </Link>{' '}
              <h1 className='text-xl flex-1 font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                {rfp.name}
              </h1>
            </div>
            <Separator />
            <RfpDocuments />
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
                <FileUploaderDialog
                  trigger={
                    <Button
                      size='sm'
                      variant='default'
                      className={`gap-1 mr-2 bg-white text-black hover:bg-gray-200`}
                    >
                      <Plus className='w-4 h-4' />
                      <FileIcon className='w-4 h-4' />
                    </Button>
                  }
                  orgId={rfp.orgId}
                  folderId={rfp.id}
                  type={TFolderInfoSummayType.RFP_SUMMARY}
                  onUpload={async (payloads) => {
                    return [];
                  }}
                />
              </div>
              <Separator />
              <div className='flex-1 h-full overflow-y-auto scrollbar-thin p-4'>
                <RfpSummary label='Overview' markdown={__sample_markdown} />
              </div>
            </div>{' '}
          </div>{' '}
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

function RfpDocuments() {
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
        <li className='flex items-center gap-2 hover:text-black'>
          <FileIcon className='w-4 h-4' />
          <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
            Trinity RFP.pdf
          </span>
        </li>
        <li className='flex items-center gap-2 hover:text-black'>
          <FileIcon className='w-4 h-4' />
          <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
            Trinity RFP.pdf
          </span>
        </li>
        <li className='flex items-center gap-2 hover:text-black'>
          <FileIcon className='w-4 h-4' />
          <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
            Trinity RFP.pdf
          </span>
        </li>
      </ul>
    </details>
  );
}
