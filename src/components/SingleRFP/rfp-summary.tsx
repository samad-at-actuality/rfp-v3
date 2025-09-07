import { Copy } from 'lucide-react';
import { MarkdownDisplayer } from '../markdown-displayer';
import { copyToClipBoard } from '@/lib/utils';
import { toast } from 'sonner';

export const RfpSummary = ({
  label,
  markdown,
}: {
  label: string;
  markdown: string;
}) => {
  return (
    <div className=' flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent w-full z-20 shadow-md bg-white '>
      <p className='font-semibold text-lg'>{label}</p>
      <MarkdownDisplayer markdown={markdown} />
      <div className='w-full flex justify-end items-center'>
        <Copy
          className='w-4 h-4 cursor-pointer self-end'
          onClick={() =>
            copyToClipBoard(markdown, () => {
              toast('Copied to clipboard!');
            })
          }
        />
      </div>
    </div>
  );
};
