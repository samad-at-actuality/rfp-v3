import {
  TChatMessage,
  TChatMessageResponse,
  TChatSession,
  TChatSessionResponse,
} from '@/types/TAskAI';
import { apiFetch } from '../fetchClient';

export const createChatSession = (orgId: string, payload: TChatSession) => {
  return apiFetch<TChatSessionResponse>(
    `/api/${orgId}/ai/chat/sessions`,
    { method: 'POST' },
    payload
  );
};

export const sendChatMessage = (
  orgId: string,
  sessionId: string,
  payload: TChatMessage
) => {
  return apiFetch<TChatMessageResponse>(
    `/api/${orgId}/ai/chat/sessions/${sessionId}`,
    { method: 'POST' },
    payload
  );
};

export const updateChatSessionApi = async (
  orgId: string,
  sessionId: string,
  payload: TChatSession
) => {
  return apiFetch<TChatSessionResponse>(
    `/api/${orgId}/ai/chat/sessions/${sessionId}`,
    { method: 'PUT' },
    payload
  );
};
