import { TPrimaryFolderEnum } from './TPrimaryFolderEnum';

export enum TChatSessionMode {
  QUICK_RESPONSE = 'QUICK_RESPONSE',
  CREATIVE_THINKING = 'CREATIVE_THINKING',
  STATISTICS = 'STATISTICS',
  BRAINSTORMING = 'BRAINSTORMING',
}

export type TChatSession = {
  fileIds: string[];
  folderIds: string[];
  khTypes: TPrimaryFolderEnum[];
  purpose: string;
  mode: TChatSessionMode;
  enableWeb: boolean;
  message?: {
    content: string;
  };
};

export type TChatSessionResponse = {
  id: string;
  model: string;
} & TChatSession;

export type TChatMessage = {
  content: string;
  enableWeb: boolean;
  mode: TChatSessionMode;
};

export type TChatMessageResponse = {
  response: string;
  references: [
    {
      id: string;
      fileId: string;
      orgId: string;
      score: string;
    },
  ];
};

export type TChatHistory = {
  question: TChatMessage & { createdAt: string };
  answer: TChatMessageResponse;
}[];
