'use client';

import { TFolderInfo } from '@/types/TFolderInfo';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import { getRelativeTime } from '@/lib/utils';
import { FolderOpenIcon, MoreHorizontal, PlusIcon } from 'lucide-react';
import { CreateFolderDialog } from '@/components/create-folder-dialog';
import Link from 'next/link';
import { useOrgCtx } from '@/ctx/org-ctx';
import { useState } from 'react';
import { createFolder, deleteFolder } from '@/lib/apis/foldersApi';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { useRouter } from 'next/navigation';

export const SecondaryFolders = ({
  folders: folders_,
  primaryFolderSlug,
  primaryFolderType,
}: {
  folders: TFolderInfo[];
  primaryFolderSlug: string;
  primaryFolderType: TPrimaryFolderEnum;
}) => {
  const {
    currentOrg: { id: orgId, role: currentOrgRole },
  } = useOrgCtx();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState(folders_);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
  const router = useRouter();

  const handleCreateFolder = async ({ name }: { name: string }) => {
    try {
      setIsLoading(true);
      const res = await createFolder({ orgId, type: primaryFolderType, name });

      if (res.data) {
        toast.success('Folder created successfully');
        setFolders((prev) => [...prev, res.data]);
        setIsOpen(false);
        router.push(
          `/app/orgs/${orgId}/data/${primaryFolderSlug}/${res.data.id}`
        );
      } else {
        toast.error('Failed to create folder');
      }
    } catch {
      toast.error('Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameClick = (rfp: any) => {
    setEditingId(rfp.id);
    setNewName(rfp.name); // pre-fill with current name
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setNewName('');
  };

  const handleRenameSave = (id: string) => {
    // Update locally
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      )
    );

    // Reset editing
    setEditingId(null);
    setNewName('');
  };

  const handleDelete = async () => {
    if (!selectedFolder) {
      return;
    }
    setLoading(true);

    try {
      const res = await deleteFolder({
        orgId,
        folderId: selectedFolder.id,
      });
      if (res.data) {
        setFolders((prev) => prev.filter((f) => f.id !== selectedFolder.id));
        toast.success('Folder deleted successfully');
      } else {
        toast.error('Failed to delete folder');
      }
    } catch (err) {
      toast.error('Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='grid grid-cols-4 gap-8'
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {currentOrgRole === 'ADMIN' && (
        <CreateFolderDialog
          trigger={
            <div className='flex items-center justify-center border-[1px] border-dashed border-gray-600 gap-2 rounded-lg h-[100px] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4 '>
              <span>
                <PlusIcon />
              </span>
            </div>
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSave={handleCreateFolder}
          isLoading={isLoading}
        />
      )}
      {folders.map((rfp: any) => (
        <div
          key={rfp.id}
          className='flex rounded-lg h-[100px] shadow-[0px_1px_12px_0px_#1F29370D] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4'
        >
          {/* If this folder is being renamed */}
          {editingId === rfp.id ? (
            <div className='flex-1 flex flex-col justify-center gap-2'>
              <div className='flex items-center gap-2'>
                <FolderOpenIcon className='w-6 h-6 text-gray-500 font-semibold' />
                <input
                  type='text'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='border font-medium text-black px-3 py-1 rounded w-full'
                />
              </div>

              <div className='flex items-center gap-3 mt-2 justify-end'>
                <button
                  onClick={handleRenameCancel}
                  className='text-sm font-semibold text-black hover:underline'
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRenameSave(rfp.id)}
                  className='text-sm px-3 py-1 bg-[#0f172a] text-white rounded hover:bg-[#1e293b]'
                >
                  Rename
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href={`/app/orgs/${orgId}/data/${primaryFolderSlug}/${rfp.id}`}
                className='flex-1 flex flex-col justify-center gap-2'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <FolderOpenIcon className='w-6 h-6 text-gray-500 font-semibold' />
                    <span className='text-[#1F2937] font-semibold text-[16px]'>
                      {rfp.name}
                    </span>
                  </div>
                  <span className='text-gray-500 text-sm'>
                    {rfp.createdAt !== rfp.updatedAt ? 'Edited' : 'Created'}{' '}
                    {getRelativeTime(
                      rfp.createdAt === rfp.updatedAt
                        ? rfp.createdAt
                        : rfp.updatedAt
                    )}
                  </span>
                </div>
              </Link>

              {/* Dropdown with Rename + Delete */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='flex items-start cursor-pointer'>
                    <MoreHorizontal className='w-6 h-6 text-gray-500' />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  style={{
                    position: 'absolute',
                    top: '-45px',
                    left: '-20px',
                  }}
                >
                  <DropdownMenuItem
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={() => handleRenameClick(rfp)}
                  >
                    <FiEdit2 className='w-4 h-4' />
                    Rename
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className='flex items-center gap-2 text-red-600 cursor-pointer'
                    onClick={() => {
                      setSelectedFolder(rfp);
                      setOpen(true);
                    }}
                  >
                    <FiTrash2 className='w-4 h-4 text-red-600' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      ))}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        isLoading={loading}
        handleConfirmClose={handleDelete}
        title={`Deleting ${selectedFolder?.name}! Are you absolutely sure?`}
        description='This action cannot be undone. This will permanently delete your folder and all its content.'
        btnLabel='Delete'
      />
    </div>
  );
};
