import { Copy, PencilIcon } from 'lucide-react';
import { MarkdownDisplayer } from '../markdown-displayer';
import { copyToClipBoard } from '@/lib/utils';
import { toast } from 'sonner';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '../ui/button';
import { LoadingButton } from '../loading-button';
const TiptapEditor = dynamic(() => import('../tiptap-editor'), { ssr: false });

export const RfpSummary = ({
  label,
  markdown: markdown_,
  onMarkdownChange,
  isLoading,
  isDisableEdit,
  id,
}: {
  label: string;
  markdown: string;
  onMarkdownChange: (_: string) => Promise<void>;
  isLoading: boolean;
  isDisableEdit: boolean;
  id: string;
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [markdown, setMarkdown] = useState(markdown_);

  return (
    <div
      id={`${id}`}
      className=' flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent w-full  min-w-full z-20 shadow-md bg-white '
    >
      <p className='font-semibold text-lg'>{label}</p>
      <TiptapEditor
        key={openEdit.toString() + !isDisableEdit.toString()}
        content={markdown}
        onUpdate={setMarkdown}
        editable={openEdit && !isDisableEdit}
        attributeClass='p-4 hover:bg-white focus:bg-accent bg-white'
      />

      <div className='w-full flex justify-end items-center gap-4'>
        {openEdit ? (
          <>
            {!isLoading && (
              <Button
                variant='ghost'
                onClick={() => {
                  setMarkdown(markdown_);
                  setOpenEdit((prev) => !prev);
                }}
              >
                Cancel
              </Button>
            )}
            <LoadingButton
              isLoading={isLoading}
              label='Save'
              onClick={async () => {
                await onMarkdownChange(markdown);
                setOpenEdit((prev) => !prev);
              }}
            />
          </>
        ) : (
          <>
            <Copy
              className='size-4 cursor-pointer self-end'
              onClick={() =>
                copyToClipBoard(markdown, () => {
                  toast('Copied to clipboard!');
                })
              }
            />
            {!isDisableEdit && (
              <PencilIcon
                className='size-4 cursor-pointer self-end'
                onClick={() => setOpenEdit((prev) => !prev)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
