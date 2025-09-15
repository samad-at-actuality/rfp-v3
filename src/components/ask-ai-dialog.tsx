'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowDown,
  ArrowUp,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  FileAudio2,
  Globe,
  LightbulbIcon,
  Loader2,
  Minimize2,
  SearchIcon,
  SlidersHorizontal,
  XIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import React, { useState, useRef, useEffect } from 'react';

import {
  AskAIPurpose,
  TChatHistory,
  TChatSessionMode,
  TChatSessionResponse,
} from '@/types/TAskAI';
import {
  createChatSession,
  sendChatMessage,
  updateChatSessionApi,
} from '@/lib/apis/askAiApi';
import { useOrgCtx } from '@/ctx/org-ctx';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import { Checkbox } from './ui/checkbox';
import { LoadingButton } from './loading-button';
import { useUserInfoCtx } from '@/ctx/user-context';
import Image from 'next/image';
import { ConfirmDialog } from './confirm-dialog';
import { getRelativeTime } from '@/lib/utils';
import { MarkdownDisplayer } from './markdown-displayer';
import { toast } from 'sonner';

const ASK_AI_CHAT_SESSION_LOCAL_STORAGE_KEY = 'ask_ai_chat_session';
const ASK_AI_CHAT_HISTORY_LOCAL_STORAGE_KEY = 'ask_ai_chat_history';

export const AskAIDialog = ({
  open,
  setOpen,
  knowledgeHubStructure,
  chatMessagesExist,
  setChatMessagesExist,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  knowledgeHubStructure: {
    type: TPrimaryFolderEnum;
    label: string;
    index: number;
    values: {
      folderId: string;
      name: string;
    }[];
  }[];
  chatMessagesExist: boolean;
  setChatMessagesExist: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    currentOrg: { id: orgId },
  } = useOrgCtx();

  const [session, setSession] = useState<TChatSessionResponse | null>(null);

  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const [chatMessage, setChatMessage] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatMessage(e.target.value);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<TChatHistory>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const saved = localStorage.getItem(ASK_AI_CHAT_HISTORY_LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (chatHistory.length && !chatMessagesExist) {
      setChatMessagesExist(true);
    }

    localStorage.setItem(
      ASK_AI_CHAT_HISTORY_LOCAL_STORAGE_KEY,
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  const getOrSetChatSession = async () => {
    try {
      setIsLoadingSession(true);
      const chatSession = localStorage.getItem(
        ASK_AI_CHAT_SESSION_LOCAL_STORAGE_KEY
      );
      if (chatSession) {
        const session: TChatSessionResponse = JSON.parse(chatSession);
        setSession(session);
      } else {
        const res = await createChatSession(orgId, {
          fileIds: [],
          folderIds: [],
          khTypes: [],
          purpose: AskAIPurpose.ASK_AI,
          mode: TChatSessionMode.QUICK_RESPONSE,
          enableWeb: false,
        });
        if (res.data) {
          setSession(res.data);
          localStorage.setItem(
            ASK_AI_CHAT_SESSION_LOCAL_STORAGE_KEY,
            JSON.stringify(res.data)
          );
        }
      }
    } catch {
      toast.error('Failed to create chat session');
      setOpen(false);
    } finally {
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    getOrSetChatSession();
  }, []);

  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleCompleteClose = () => {
    localStorage.removeItem(ASK_AI_CHAT_SESSION_LOCAL_STORAGE_KEY);
    localStorage.removeItem(ASK_AI_CHAT_HISTORY_LOCAL_STORAGE_KEY);
    setSession(null);
    setChatHistory([]);
    setChatMessagesExist(false);
    setChatMessage('');
    setOpen(false);
    getOrSetChatSession();
  };

  const [isUpdatingSession, setIsUpdatingSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [chatMessageClone, setChatMessageClone] = useState<string>();

  const updateChatSession = async (
    selectedFolderIds: string[],
    selectedKhTypes: TPrimaryFolderEnum[],
    mode: TChatSessionMode,
    enableWeb: boolean
  ) => {
    if (!session) {
      return;
    }
    setIsUpdatingSession(true);
    try {
      const res = await updateChatSessionApi(orgId, session.id, {
        fileIds: [],
        folderIds: selectedFolderIds,
        khTypes: selectedKhTypes,
        purpose: AskAIPurpose.ASK_AI,
        mode,
        enableWeb,
      });

      if (res.data) {
        const chatSession = localStorage.getItem(
          ASK_AI_CHAT_SESSION_LOCAL_STORAGE_KEY
        );
        if (chatSession) {
          const session: TChatSessionResponse = JSON.parse(chatSession);
          setSession({
            ...res.data,
            mode,
            enableWeb,
            folderIds: [...selectedFolderIds, ...session.folderIds],
            khTypes: [...selectedKhTypes, ...session.khTypes],
          });
          localStorage.setItem(
            ASK_AI_CHAT_SESSION_LOCAL_STORAGE_KEY,
            JSON.stringify(res.data)
          );
        }
        toast.success('Chat session updated successfully');
      }
    } catch {
      toast.error('Failed to update chat session');
    } finally {
      setIsUpdatingSession(false);
    }
  };

  // Auto-scroll to bottom on first load and when new content is submitted
  // Auto-scroll to bottom on first load and when new content is submitted
  useEffect(() => {
    if (!open) {
      return;
    }

    const scrollToBottom = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        contentRef.current.scrollTo({
          top: scrollHeight - clientHeight,
          behavior: 'smooth',
        });
      }
    };

    // Wait for rendering
    const timeout = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeout);
  }, [open, chatHistory.length, chatMessageClone]);

  const handleSubmit = async () => {
    if (!chatMessage.trim() || !session?.id) {
      return;
    }

    setIsSubmitting(true);
    const contentTemp = chatMessage;
    setChatMessage('');
    setChatMessageClone(chatMessage);
    try {
      const res = await sendChatMessage(orgId, session.id, {
        ...{
          content: contentTemp,
          enableWeb: session.enableWeb,
          mode: session.mode,
        },
      });

      if (res.data) {
        setChatHistory((p) => [
          ...p,
          {
            question: {
              ...{
                content: contentTemp,
                enableWeb: session.enableWeb,
                mode: session.mode,
              },
              createdAt: new Date().toISOString(),
            },
            answer: res.data,
          },
        ]);
        setChatMessage('');
      } else {
        setChatMessage(contentTemp);
      }
    } catch {
      toast.error('Failed to send chat message');
      setChatMessage(contentTemp);
    } finally {
      setChatMessageClone('');
      setIsSubmitting(false);
      textareaRef.current?.focus();
    }
  };

  // Check scroll position and update button visibility
  const checkScrollPosition = (isProgrammaticScroll = false) => {
    if (!contentRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5; // 5px threshold
    const isAtTop = scrollTop < 5; // 5px threshold

    // Only update down button if not in the middle of a programmatic scroll
    if (!isProgrammaticScroll) {
      setShowScrollDown(!isAtBottom);
    }
    setShowScrollUp(!isAtTop);
  };

  // Handle smooth scroll completion
  const handleScrollEnd = (isProgrammaticScroll = false) => {
    checkScrollPosition(isProgrammaticScroll);
  };

  // Debounced scroll end handler
  const debouncedScrollEnd = useRef<NodeJS.Timeout>(null);

  // Check if content overflows and handle scroll events
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        const hasOverflow = scrollHeight > clientHeight;

        if (hasOverflow) {
          checkScrollPosition();
        } else {
          setShowScrollUp(false);
          setShowScrollDown(false);
        }
      }
    };

    // Initial check
    checkOverflow();

    // Add event listeners
    const contentEl = contentRef.current;
    if (contentEl) {
      const handleScroll = () => {
        // Clear any pending scroll end handler
        if (debouncedScrollEnd.current) {
          clearTimeout(debouncedScrollEnd.current);
        }

        // Set a new timeout for scroll end
        debouncedScrollEnd.current = setTimeout(
          () => handleScrollEnd(false),
          150
        );

        // Update scroll position
        checkScrollPosition();
      };

      contentEl.addEventListener('scroll', handleScroll);

      // Add resize observer to check when content changes
      const resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(contentEl);

      return () => {
        contentEl.removeEventListener('scroll', handleScroll);
        if (debouncedScrollEnd.current) {
          clearTimeout(debouncedScrollEnd.current);
        }
        resizeObserver.disconnect();
      };
    }
  }, [chatHistory]);

  const {
    userInfo: { name: userName },
  } = useUserInfoCtx();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        handleConfirmClose={handleCompleteClose}
      />
      <DialogContent
        showCloseButton={false}
        className='rounded-[16px] overflow-hidden p-6 flex flex-col max-h-[80vh] h-full min-w-[35vw] max-w-[35vw]'
        onInteractOutside={(e) => e.preventDefault()}
      >
        {isLoadingSession ? (
          <div className='size-full grid place-items-center'>
            <div className='flex flex-col items-center gap-2'>
              <Loader2 className='w-[30%] h-[30%] animate-spin' />
              <p>Loading session...</p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className='flex flex-row items-center'>
              <DialogTitle className='flex items-center gap-4 flex-1'>
                <SearchIcon className='w-6 h-6 text-gray-400' />{' '}
                <span className='text-[18px] text-[#1F2937]'>Search</span>
              </DialogTitle>
              <div className='flex items-center gap-0'>
                <KnowledgeHubDropDownMenu
                  key={session?.folderIds.join(',')}
                  isSaving={isUpdatingSession}
                  onSave={async (...args) => {
                    await updateChatSession(
                      ...args,
                      session?.mode || TChatSessionMode.QUICK_RESPONSE,
                      session?.enableWeb || false
                    );
                  }}
                  selectedFolderIds={session?.folderIds || []}
                  knowledgeHubStructure={knowledgeHubStructure}
                  khTypes={session?.khTypes || []}
                />

                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setOpen((p) => !p);
                  }}
                >
                  <Minimize2 className='w-4 h-6 text-gray-400' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setShowConfirmClose(true);
                  }}
                >
                  <XIcon className='w-4 h-6 text-gray-400' />
                </Button>
              </div>
            </DialogHeader>
            <div className='flex-1 overflow-hidden relative'>
              <div
                className='h-full overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 '
                ref={contentRef}
                style={{ scrollBehavior: 'smooth' }}
              >
                {chatHistory.map((chat, index) => (
                  <React.Fragment key={index}>
                    <QuestionTab
                      userName={userName}
                      question={chat.question.content}
                      createdAt={chat.question.createdAt}
                    />
                    <div className='flex flex-col gap-2 mb-4'>
                      <div className='flex items-center gap-2'>
                        <AvatarIcons
                          fullName='Rajesh'
                          color='blue'
                          isBot={true}
                        />
                        <div className='flex items-center gap-2'>
                          <span className='text-[#030712] text-[14px] font- font-med'>
                            Actuality
                          </span>
                          <AITag />
                        </div>
                      </div>
                      <div className='w-full overflow-hidden'>
                        <div className='overflow-x-auto'>
                          <MarkdownDisplayer markdown={chat.answer.response} />
                        </div>
                      </div>

                      {/* <MarkdownDisplayer content={item[1].content } /> */}
                    </div>
                  </React.Fragment>
                ))}
                {isSubmitting &&
                  chatMessageClone &&
                  chatMessageClone.trim().length > 0 && (
                    <QuestionTab
                      showGeneratingResponse={true}
                      userName={userName}
                      question={chatMessageClone}
                      createdAt={new Date().toISOString()}
                    />
                  )}
              </div>
              {(showScrollUp || showScrollDown) && (
                <div className='absolute bottom-4 right-8 flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-lg'>
                  {showScrollUp && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='rounded-full hover:bg-gray-100 transition-all duration-200'
                      onClick={() => {
                        setShowScrollDown(false);
                        contentRef.current?.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        });
                        setTimeout(checkScrollPosition, 300);
                      }}
                    >
                      <ArrowUp className='w-4 h-4 text-gray-600' />
                    </Button>
                  )}
                  {showScrollDown && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='rounded-full hover:bg-gray-100 transition-all duration-200'
                      onClick={() => {
                        if (contentRef.current) {
                          const { scrollHeight } = contentRef.current;
                          contentRef.current.scrollTo({
                            top: scrollHeight,
                            behavior: 'smooth',
                          });
                        }
                      }}
                    >
                      <ArrowDown className='w-4 h-4 text-gray-600' />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className='block space-y-4'>
              <div className='relative bg-gray-200 rounded-md'>
                <textarea
                  ref={textareaRef}
                  value={chatMessage}
                  onChange={handleInputChange}
                  className='border-none outline-none p-2 flex-1 resize-none min-h-[100px] max-h-[100px] w-full overflow-y-auto'
                  placeholder='Ask a question'
                  rows={1}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      !isSubmitting &&
                      !isUpdatingSession
                    ) {
                      e.preventDefault(); // prevent new line
                      handleSubmit();
                    }
                  }}
                />{' '}
                <Button
                  variant='ghost'
                  size='icon'
                  disabled={isSubmitting || isUpdatingSession}
                  onClick={() => {
                    handleSubmit();
                  }}
                  className='rounded-full absolute bottom-1 right-1 '
                >
                  {isSubmitting ? (
                    <div className='p-2'>
                      {' '}
                      <Loader2 className='h-4 w-4 text-gray-700 animate-spin' />
                    </div>
                  ) : (
                    <ArrowUp onClick={handleSubmit} />
                  )}
                </Button>
              </div>
              {session && (
                <div className='flex items-center justify-normal'>
                  <div className='flex-1'>
                    <div
                      className='rounded-full bg-gray-200 w-fit shadow-md p-1'
                      key={session?.mode || open}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            onClick={async () => {
                              if (
                                session?.mode ===
                                TChatSessionMode.CREATIVE_THINKING
                              ) {
                                return;
                              }

                              await updateChatSession(
                                session?.folderIds || [],
                                session?.khTypes || [],
                                TChatSessionMode.CREATIVE_THINKING,
                                session?.enableWeb
                              );
                            }}
                            className={`rounded-full cursor-pointer ${session?.mode === TChatSessionMode.CREATIVE_THINKING ? 'bg-white' : ''}`}
                            size='icon'
                            variant='ghost'
                          >
                            <FileAudio2 className='w-4 h-6 text-gray-500' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {TChatSessionMode.CREATIVE_THINKING}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            onClick={async () => {
                              if (
                                session?.mode === TChatSessionMode.STATISTICS
                              ) {
                                return;
                              }

                              await updateChatSession(
                                session?.folderIds || [],
                                session?.khTypes || [],
                                TChatSessionMode.STATISTICS,
                                session?.enableWeb
                              );
                            }}
                            className={`rounded-full cursor-pointer ${session?.mode === TChatSessionMode.STATISTICS ? 'bg-white' : ''}`}
                            size='icon'
                            variant='ghost'
                          >
                            <ChartNoAxesColumnIncreasing className='w-4 h-6 text-gray-500' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {TChatSessionMode.STATISTICS}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          {' '}
                          <Button
                            onClick={async () => {
                              if (
                                session?.mode === TChatSessionMode.BRAINSTORMING
                              ) {
                                return;
                              }

                              await updateChatSession(
                                session?.folderIds || [],
                                session?.khTypes || [],
                                TChatSessionMode.BRAINSTORMING,
                                session?.enableWeb
                              );
                            }}
                            className={`rounded-full cursor-pointer ${session?.mode === TChatSessionMode.BRAINSTORMING ? 'bg-white' : ''}`}
                            size='icon'
                            variant='ghost'
                          >
                            <LightbulbIcon className='w-4 h-6 text-gray-500' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {TChatSessionMode.BRAINSTORMING}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <Button
                    key={session?.enableWeb.toString() || open.toString()}
                    className={`text-blue-400 hover:text-blue-400 cursor-pointer ${session?.enableWeb ? '  text-blue-900 hover:text-blue-900' : ''}`}
                    variant='ghost'
                    size='sm'
                    onClick={async () => {
                      const prevEnableWeb = session?.enableWeb;

                      await updateChatSession(
                        session?.folderIds || [],
                        session?.khTypes || [],
                        session?.mode,
                        !prevEnableWeb
                      );
                    }}
                  >
                    <Globe /> Enable web search
                  </Button>
                </div>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

type KnowledgeHubStructure = {
  type: TPrimaryFolderEnum;
  label: string;
  index: number;
  values: { folderId: string; name: string }[];
}[];

export function KnowledgeHubDropDownMenu({
  knowledgeHubStructure,
  selectedFolderIds: selectedFolderIds_,
  khTypes,
  onSave,
  isSaving,
}: {
  knowledgeHubStructure: KnowledgeHubStructure;
  selectedFolderIds: string[];
  khTypes: TPrimaryFolderEnum[];
  onSave: (_: string[], __: TPrimaryFolderEnum[]) => Promise<void>;
  isSaving: boolean;
}) {
  console.log('selectedFolderIds_: ', selectedFolderIds_);
  const [open, setOpen] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const [selectedKhTypes, setSelectedKhTypes] = useState<TPrimaryFolderEnum[]>(
    []
  );

  const toggleSelection = (folderId: string) => {
    if (selectedFolderIds.includes(folderId)) {
      setSelectedFolderIds(selectedFolderIds.filter((i) => i !== folderId));
    } else {
      setSelectedFolderIds([...selectedFolderIds, folderId]);
    }
  };

  const clearAll = () => {
    setSelectedFolderIds([]);
    setSelectedKhTypes([]);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <SlidersHorizontal className='w-5 h-5 text-gray-500' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-[350px] h-[400px] overflow-y-auto p-0 flex flex-col'
      >
        <div className='p-3 border-b font-semibold text-md'>Knowledge Hub</div>
        <div className='flex-1 overflow-hidden'>
          <div className='p-3 space-y-3 h-full overflow-y-auto'>
            {knowledgeHubStructure.map((folder, index) => {
              const count = selectedFolderIds.filter(
                (i) =>
                  i === folder.values.find((v) => v.folderId === i)?.folderId
              ).length;
              const crtFolderIds = folder.values.map((v) => v.folderId);
              const hasAllBeenSelected = crtFolderIds.every((i) =>
                selectedFolderIds_.includes(i)
              );
              return (
                <div
                  key={folder.label}
                  className={` ${index === knowledgeHubStructure.length - 1 ? '' : 'border-b pb-2'} pb-2`}
                >
                  <details className='group' open>
                    <summary className='flex items-center justify-between cursor-pointer text-sm font-medium'>
                      <div className='flex items-center gap-2'>
                        <ChevronDown className='w-4 h-4 transition group-open:rotate-180' />
                        <span className='text-md'>{folder.label}</span>
                        {count > 0 && (
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
                            {count} selection{count > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {folder.values.length > 0 && (
                        <Checkbox
                          className='border-2 border-gray-400'
                          checked={
                            count === folder.values.length || hasAllBeenSelected
                          }
                          disabled={hasAllBeenSelected}
                          onCheckedChange={(checked) => {
                            setSelectedFolderIds((p) =>
                              checked
                                ? [
                                    ...p,
                                    ...folder.values.map((v) => v.folderId),
                                  ]
                                : p.filter((i) => !crtFolderIds.includes(i))
                            );
                            if (checked) {
                              setSelectedKhTypes((p) =>
                                !checked
                                  ? p.filter((t) => t !== folder.type)
                                  : p.includes(folder.type)
                                    ? p
                                    : [...p, folder.type]
                              );
                            }
                          }}
                        />
                      )}
                    </summary>

                    <div className='mt-2 space-y-[8px] pl-6 '>
                      {folder.values.length === 0 ? (
                        <p className='text-sm text-gray-500'>No items exist</p>
                      ) : (
                        folder.values.map((item) => (
                          <label
                            key={item.folderId}
                            className='flex items-center gap-2 text-sm cursor-pointer'
                          >
                            <span className='flex-1'>{item.name}</span>
                            <Checkbox
                              className='border-2 border-gray-400'
                              checked={
                                selectedFolderIds_.includes(item.folderId) ||
                                selectedFolderIds.includes(item.folderId)
                              }
                              disabled={selectedFolderIds_.includes(
                                item.folderId
                              )}
                              onCheckedChange={(checked) => {
                                toggleSelection(item.folderId);
                                if (checked) {
                                  setSelectedKhTypes((p) =>
                                    p.includes(folder.type)
                                      ? p
                                      : [...p, folder.type]
                                  );
                                } else if (count === 1) {
                                  setSelectedKhTypes((p) =>
                                    p.filter((t) => t !== folder.type)
                                  );
                                }
                              }}
                            />
                          </label>
                        ))
                      )}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex justify-between items-center border-t p-3 bg-[#E5E7EB] gap-4'>
          <Button
            className='flex-1'
            variant='outline'
            size='sm'
            onClick={clearAll}
            disabled={isSaving || selectedFolderIds.length === 0}
          >
            Clear all
          </Button>
          <LoadingButton
            className='flex-1 bg-[#374151]'
            size='sm'
            label='Apply filters'
            isLoading={isSaving}
            onClick={async () => {
              try {
                await onSave(
                  selectedFolderIds,
                  selectedKhTypes.filter((t) => !khTypes.includes(t))
                );
              } catch {
              } finally {
                setOpen(false);
              }
            }}
          />
          {/* <Button size='sm'>Apply filters</Button> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AvatarProps {
  fullName?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'gray';
  isBot?: boolean;
}

export const AvatarIcons: React.FC<AvatarProps> = ({
  fullName,
  color,
  isBot = false,
}) => {
  // Truncate the full name to the first letter
  const letter = fullName ? fullName.charAt(0).toUpperCase() : '';

  // Define the Tailwind classes for the avatar based on the color prop
  const colorClasses: Record<string, string> = {
    blue: 'bg-gradient-to-t from-blue-100 to-blue-50 border-blue-200 text-blue-500',
    purple:
      'bg-gradient-to-t from-purple-100 to-purple-50 border-purple-200 text-purple-500',
    green:
      'bg-gradient-to-t from-green-100 to-green-50 border-green-200 text-green-500',
    yellow:
      'bg-gradient-to-t from-yellow-100 to-yellow-50 border-yellow-200 text-yellow-500',
    red: 'bg-gradient-to-t from-red-100 to-red-50 border-red-200 text-red-500',
    gray: 'bg-gradient-to-t from-gray-100 to-gray-50 border-gray-200 text-gray-500', // Gray for the bot avatar
  };

  // Use the color prop to determine the color classes, or use gray if isBot is true
  const avatarColorClass = isBot
    ? colorClasses.gray
    : colorClasses[color || 'gray'];

  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full border ${avatarColorClass}`}
      style={{ borderWidth: '1px' }}
    >
      {isBot ? (
        <Image
          src={'/assets/actuality_logo.svg'}
          alt='Bot Icon'
          width={14}
          height={12}
        />
      ) : (
        <span className='font-semibold text-sm font-[family-name:var(--font-inter)]'>
          {letter}
        </span>
      )}
    </div>
  );
};
const AITag: React.FC = () => {
  return (
    <div className='flex items-center bg-purple-500 text-white rounded-full py-1 px-2 space-x-1'>
      <svg
        width='10'
        height='10'
        viewBox='0 0 10 10'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-2.5 h-2.5'
      >
        <path
          d='M6.39648 1.66406C6.30859 1.69727 6.25 1.78125 6.25 1.875C6.25 1.96875 6.30859 2.05273 6.39648 2.08594L7.5 2.5L7.91406 3.60352C7.94727 3.69141 8.03125 3.75 8.125 3.75C8.21875 3.75 8.30273 3.69141 8.33594 3.60352L8.75 2.5L9.85352 2.08594C9.94141 2.05273 10 1.96875 10 1.875C10 1.78125 9.94141 1.69727 9.85352 1.66406L8.75 1.25L8.33594 0.146484C8.30273 0.0585938 8.21875 0 8.125 0C8.03125 0 7.94727 0.0585938 7.91406 0.146484L7.5 1.25L6.39648 1.66406ZM4.00586 1.43164C3.95508 1.32031 3.84375 1.25 3.72266 1.25C3.60156 1.25 3.49023 1.32031 3.43945 1.43164L2.4082 3.6582L0.181641 4.6875C0.0703125 4.73828 0 4.84961 0 4.97266C0 5.0957 0.0703125 5.20508 0.181641 5.25586L2.41016 6.28516L3.4375 8.51172C3.48828 8.62305 3.59961 8.69336 3.7207 8.69336C3.8418 8.69336 3.95312 8.62305 4.00391 8.51172L5.0332 6.2832L7.26172 5.25391C7.37305 5.20312 7.44336 5.0918 7.44336 4.9707C7.44336 4.84961 7.37305 4.73828 7.26172 4.6875L5.03516 3.66016L4.00586 1.43164ZM7.5 7.5L6.39648 7.91406C6.30859 7.94727 6.25 8.03125 6.25 8.125C6.25 8.21875 6.30859 8.30273 6.39648 8.33594L7.5 8.75L7.91406 9.85352C7.94727 9.94141 8.03125 10 8.125 10C8.21875 10 8.30273 9.94141 8.33594 9.85352L8.75 8.75L9.85352 8.33594C9.94141 8.30273 10 8.21875 10 8.125C10 8.03125 9.94141 7.94727 9.85352 7.91406L8.75 7.5L8.33594 6.39648C8.30273 6.30859 8.21875 6.25 8.125 6.25C8.03125 6.25 7.94727 6.30859 7.91406 6.39648L7.5 7.5Z'
          fill='white'
        />
      </svg>
      <span className='text-xs font-semibold'>AI</span>
    </div>
  );
};
const QuestionTab = ({
  userName,
  question,
  createdAt,
  showGeneratingResponse,
}: {
  userName: string;
  question: string;
  createdAt: string;
  showGeneratingResponse?: boolean;
}) => {
  return (
    <>
      <div className='flex flex-col gap-2 bg-accent p-2 rounded-md'>
        <div className='flex items-center gap-4'>
          <AvatarIcons fullName={userName || ''} color='blue' isBot={!true} />
          <div className='flex flex-col gap-0'>
            <span className='text-[#030712] text-[14px] font-medium'>
              {userName}
            </span>
            <span className='text-[#030712] text-[12px] font-light'>
              {getRelativeTime(createdAt)}
            </span>
          </div>
        </div>
        <p className='text-[#030712] text-[18px] font-normal'>{question}</p>
      </div>
      {showGeneratingResponse && <p>Generating response...</p>}
    </>
  );
};
