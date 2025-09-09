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
  purpose: AskAIPurpose;
  mode: TChatSessionMode;
  enableWeb: boolean;
  message?: {
    content: string;
  };
};
export enum AskAIPurpose {
  RFP_SUMMARY_1 = 'RFP_SUMMARY_1',
  RFP_SUMMARY_2 = 'RFP_SUMMARY_2',
  RFP_SUMMARY_3 = 'RFP_SUMMARY_3',
  RFP_RESPONSE = 'RFP_RESPONSE',
  FOLDER_SUMMARY = 'FOLDER_SUMMARY',
  ASK_AI = 'ASK_AI',
}

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
