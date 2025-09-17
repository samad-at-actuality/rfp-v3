'use client';
import { Copy, PencilIcon } from 'lucide-react';
import { copyToClipBoard } from '@/lib/utils';
import { toast } from 'sonner';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '../ui/button';
import { LoadingButton } from '../loading-button';
import { TRFP } from '@/types/TRfp';
const TiptapEditor = dynamic(() => import('../tiptap-editor'), { ssr: false });

const RfpSummary = ({
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

export const RfpSummaries = ({
  summary,
  showEdit,
  isChangingSummary,
  handleSummayChange,
}: {
  summary: TRFP['latestVersion']['summary'];
  showEdit: boolean;
  isChangingSummary: boolean;
  handleSummayChange: (
    key: string,
    value: string | object | string[]
  ) => Promise<void>;
}) => {
  return (
    <div className='flex flex-col gap-2'>
      {summary?.overview && (
        <RfpSummary
          id='Overview'
          isDisableEdit={!showEdit}
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
          isDisableEdit={!showEdit}
          label='Key Dates'
          key={JSON.stringify(summary.keyDates)}
          markdown={
            summary.keyDates.otherDates?.find((x) => x.date === 'MANUAL')
              ?.description ||
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
            id='Submissionrequirements'
            isDisableEdit={!showEdit}
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
              await handleSummayChange('submissionRequirements', [markdown]);
            }}
            isLoading={isChangingSummary}
          />
        )}
      {summary?.evaluationCriteria && (
        <RfpSummary
          id='Evaluationcriteria'
          isDisableEdit={!showEdit}
          label='Evaluation Criteria'
          key={summary.evaluationCriteria}
          onMarkdownChange={async (markdown) => {
            await handleSummayChange('evaluationCriteria', markdown);
          }}
          isLoading={isChangingSummary}
          markdown={summary.evaluationCriteria}
        />
      )}
      {summary?.scopeOfWork && (
        <RfpSummary
          id='Scopeofwork'
          isDisableEdit={!showEdit}
          label='Scope of Work'
          key={summary.scopeOfWork}
          onMarkdownChange={async (markdown) => {
            await handleSummayChange('scopeOfWork', markdown);
          }}
          isLoading={isChangingSummary}
          markdown={summary.scopeOfWork}
        />
      )}
      {summary?.discrepancies && summary?.discrepancies?.length > 0 && (
        <RfpSummary
          id='Discrepencies'
          isDisableEdit={!showEdit}
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
              ...(summary.discrepancies?.filter((d) => d.type !== 'MANUAL') ||
                []),
              { description: markdown, type: 'MANUAL' },
            ]);
          }}
          isLoading={isChangingSummary}
        />
      )}
      {summary?.questions && summary?.questions.length > 0 && (
        <RfpSummary
          id='Questions'
          isDisableEdit={!showEdit}
          label='Questions'
          key={JSON.stringify(summary.questions)}
          markdown={
            summary.questions.length > 1
              ? summary.questions.map((it) => `- ${it}`).join('\n\n')
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
          id='Otherinfo'
          isDisableEdit={!showEdit}
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
            summary.otherInfo.find((o) => o.key === 'MANUAL')?.value ||
            summary.otherInfo
              .map((p) => `**${p.key}**: ${p.value}`)
              .join('\n\n')
          }
        />
      )}
    </div>
  );
};
