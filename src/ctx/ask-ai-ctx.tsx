'use client';

import { AskAIDialog } from '@/components/ask-ai-dialog';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import React from 'react';

const AskAIContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessagesExist: boolean;
  setChatMessagesExist: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

const AskAIProvider = AskAIContext.Provider;

export const useAskAI = () => {
  const context = React.useContext(AskAIContext);
  if (!context) {
    throw new Error('useAskAI must be used within a AskAIProvider');
  }
  return context;
};

export const AskAIWrapper = ({
  children,
  knowledgeHubStructure,
}: {
  children: React.ReactNode;
  knowledgeHubStructure: {
    type: TPrimaryFolderEnum;
    label: string;
    index: number;
    values: { folderId: string; name: string }[];
  }[];
}) => {
  const [open, setOpen] = React.useState(false);
  const [chatMessagesExist, setChatMessagesExist] = React.useState(false);
  return (
    <AskAIProvider
      value={{ open, setOpen, chatMessagesExist, setChatMessagesExist }}
    >
      <AskAIDialog
        open={open}
        chatMessagesExist={chatMessagesExist}
        setChatMessagesExist={setChatMessagesExist}
        setOpen={setOpen}
        knowledgeHubStructure={knowledgeHubStructure}
      />
      {children}
    </AskAIProvider>
  );
};
