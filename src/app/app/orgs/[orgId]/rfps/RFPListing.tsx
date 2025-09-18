'use client';

import { CreateFolderDialog } from '@/components/create-folder-dialog';
import { useOrgCtx } from '@/ctx/org-ctx';

import { createRfp, deleteRfp } from '@/lib/apis/rfpApi';
import { getRelativeTime } from '@/lib/utils';
import { TRFP } from '@/types/TRfp';
import { FolderOpenIcon, MoreHorizontal, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { apiFetch } from '@/lib/fetchClient';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useRouter } from 'next/navigation';
import { TOrgRole } from '@/types/TUserRole';
import { useUserInfoCtx } from '@/ctx/user-context';

export const RFPListing = ({
  rfps: rfps_,
  orgId,
}: {
  rfps: TRFP[];
  orgId: string;
}) => {
  const [rfps, setRfps] = useState(
    rfps_.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const {
    currentOrg: { role: currentOrgRole },
  } = useOrgCtx();
  const { userInfo } = useUserInfoCtx();
  const isAdmin = currentOrgRole === TOrgRole.ADMIN || userInfo.isSuperAdmin;
  const isViewer = currentOrgRole === TOrgRole.VIEWER;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editingRfpId, setEditingRfpId] = useState<string | null>(null);
  const [newRfpName, setNewRfpName] = useState('');
  const [selectedRfp, setSelectedRfp] = useState<any | null>(null);
  const [rfpLoading, setRfpLoading] = useState(false);
  const [rfpOpen, setRfpOpen] = useState(false);

  const [renameLoading, setRenameLoading] = useState<string | null>(null);
  const router = useRouter();
  const handleCreateFolder = async ({ name }: { name: string }) => {
    try {
      setIsLoading(true);
      const res = await createRfp({ orgId, name });

      if (res.data) {
        toast.success('RFP created successfully');
        setRfps((prev) => [res.data, ...prev]);
        setIsOpen(false);
        router.push(`/app/orgs/${orgId}/rfps/${res.data.id}`);
      } else {
        toast.error('Failed to create RFP');
      }
    } catch {
      toast.error('Failed to create RFP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRfpRenameClick = (rfp: any) => {
    setEditingRfpId(rfp.id);
    setNewRfpName(rfp.name);
  };

  const handleRfpRenameCancel = () => {
    setEditingRfpId(null);
    setNewRfpName('');
  };

  const handleRfpDelete = async () => {
    if (!selectedRfp) {
      return;
    }
    setRfpLoading(true);
    try {
      const response = await deleteRfp({ orgId, rfpId: selectedRfp.id });

      setRfps((prev) => prev.filter((r) => r.id !== selectedRfp.id));
      toast.success('RFP deleted successfully');
      setRfpOpen(false);
    } catch (err) {
      console.error('Error deleting RFP', err);
      toast.error('Failed to delete RFP');
    } finally {
      setRfpLoading(false);
    }
  };

  const handleRfpRenameSave = async (id: string) => {
    setRenameLoading(id);
    try {
      if (!newRfpName.trim()) {
        alert('RFP name cannot be empty');
        return;
      }

      const response = await apiFetch<TRFP>(
        `/api/${orgId}/rfps/${id}/rename?newName=${encodeURIComponent(newRfpName)}`,
        {
          method: 'PUT',
        }
      );

      if (response) {
        // ✅ Update local state
        setRfps((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, name: newRfpName } : item
          )
        );

        setRenameLoading(null);

        // Reset rename UI
        setEditingRfpId(null);
        setNewRfpName('');
        toast.success('RFP renamed successfully');
      } else {
        toast.error('Failed to rename RFP');
      }
    } catch (error) {
      console.error('Error renaming RFP:', error);
      toast.error('Something went wrong while renaming');
    }
  };

  return (
    <div className='grid grid-cols-4 gap-8'>
      {!isViewer && (
        <CreateFolderDialog
          formLabel='Create RFP'
          inputPlaceholder='RFP Name'
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
      {rfps.length === 0 && !isViewer && (
        <p className='text-gray-500 text-sm text-center'>No RFPs found</p>
      )}
      {rfps.map((rfp) => (
        <div
          key={rfp.id}
          className='flex rounded-lg h-[100px] shadow-[0px_1px_12px_0px_#1F29370D] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4'
        >
          {editingRfpId === rfp.id ? (
            <div className='flex-1 flex flex-col justify-center gap-2'>
              <div className='flex items-center gap-2'>
                {/* <FileSignature className='w-6 h-6 text-gray-500 font-semibold' /> */}
                <FolderOpenIcon className='w-6 h-6 text-gray-500 font-semibold' />
                <input
                  type='text'
                  value={newRfpName}
                  onChange={(e) => setNewRfpName(e.target.value)}
                  className='border font-medium text-black px-3 py-1 rounded w-full'
                />
              </div>
              <div className='flex items-center gap-3 mt-2 justify-end'>
                <button
                  onClick={handleRfpRenameCancel}
                  className='text-sm font-semibold text-black hover:underline'
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRfpRenameSave(rfp.id)}
                  disabled={renameLoading === rfp.id} // disable while loading
                  className='text-sm px-3 py-1 bg-[#0f172a] text-white rounded hover:bg-[#1e293b] flex items-center justify-center'
                >
                  {renameLoading === rfp.id ? (
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block'></span>
                  ) : (
                    'Rename'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href={`/app/orgs/${orgId}/rfps/${rfp.id}`}
                className='flex-1 flex flex-col justify-center gap-2'
              >
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
              </Link>

              {/* Dropdown */}
              {!isViewer && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className='flex items-start cursor-pointer'>
                      <MoreHorizontal className='w-6 h-6 text-gray-500' />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side='right'
                    align='start'
                    sideOffset={5}
                    className='min-w-[150px]'
                  >
                    <DropdownMenuItem
                      className='flex items-center gap-2 cursor-pointer'
                      onClick={() => handleRfpRenameClick(rfp)}
                    >
                      <FiEdit2 className='w-4 h-4' />
                      Rename
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem
                        className='flex items-center gap-2 text-red-600 cursor-pointer'
                        onClick={() => {
                          setSelectedRfp(rfp);
                          setRfpOpen(true);
                        }}
                      >
                        <FiTrash2 className='w-4 h-4' />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      ))}
      <ConfirmDialog
        open={rfpOpen}
        onOpenChange={setRfpOpen}
        title={`Deleting Folder?`}
        description={`Are you sure you want to permanently delete “${selectedRfp?.name}” and all of its contents? This action cannot be undone.`}
        handleConfirmClose={handleRfpDelete}
        btnLabel='Delete'
        isLoading={rfpLoading}
      />
    </div>
  );
};
