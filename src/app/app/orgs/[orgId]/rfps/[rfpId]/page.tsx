'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

// import { useParams } from 'next/navigation';

export default function RfpPage() {
  // const { rfpId } = useParams();
  // console.log(rfpId);
  return (
    <div className='w-full h-full overflow-hidden log-1'>
      <ResizablePanelGroup direction='horizontal' autoSaveId='rfp-layout'>
        <ResizablePanel defaultSize={20} minSize={5} maxSize={20}>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            <div className='h-[400vh]' />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            <div className='h-[400vh]' />
          </div>{' '}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={0} minSize={0} maxSize={20}>
          <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
            <div className='h-[400vh]' />
          </div>{' '}
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>
    </div>
  );
}
