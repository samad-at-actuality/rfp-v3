import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { LoadingButton } from './loading-button';
import { Input } from './ui/input';
import { useState } from 'react';
export function CreateFolderDialog({
  trigger,
  isOpen,
  setIsOpen,
  onSave,
  isLoading,
}: {
  trigger: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSave: ({ name }: { name: string }) => Promise<void>;
  isLoading: boolean;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='w-[500px] flex flex-col gap-10'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        <div className='space-y-2'>
          <Input
            placeholder='Folder Name'
            value={name}
            name='name'
            id='name'
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className='text-red-500'>{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <LoadingButton
            label='Save'
            isLoading={isLoading}
            onClick={async () => {
              if (name.trim() === '') {
                setError('Folder name is required');
                return;
              }
              await onSave({ name });
              setName('');
              setError('');
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
