import { PlusIcon, XIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { TOtherInfo } from '@/types/TFolderInfo';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { toast } from 'sonner';
export const PersonProjectDialog = ({
  trigger,
  onSave,
}: {
  trigger: React.ReactNode;
  onSave: (project: {
    name: string;
    designations: string[];
    description: string;
    otherInfo: TOtherInfo[];
  }) => void;
}) => {
  const [form, setForm] = useState<{
    name: string;
    designations: string[];
    description: string;
    otherInfo: TOtherInfo[];
  }>({
    name: '',
    designations: [],
    description: '',
    otherInfo: [],
  });
  const [designationTemp, setDesignationTemp] = useState<string>('');

  const handleAddDesignation = () => {
    if (designationTemp.trim()) {
      setForm({
        ...form,
        designations: [...form.designations, designationTemp.trim()],
      });
      setDesignationTemp('');
    }
  };

  const handleRemoveDesignation = (designationToRemove: string) => {
    setForm({
      ...form,
      designations: form.designations.filter((d) => d !== designationToRemove),
    });
  };

  const handleSubmit = () => {
    onSave(form);
    setForm({ name: '', designations: [], description: '', otherInfo: [] });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='w-[625px] pb-0 flex flex-col h-full max-h-[80vh] space-y-6'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <div className='flex-1 overflow-hidden'>
          <div className='h-full overflow-y-auto space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder='Enter project name'
              />
            </div>

            <div className='space-y-2'>
              <Label>Designations</Label>
              <div className='relative'>
                <Input
                  value={designationTemp}
                  onChange={(e) => setDesignationTemp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDesignation();
                    }
                  }}
                  placeholder='Add a designation and press Enter'
                />
                <div className='absolute right-[1px] top-0 scale-[0.8]'>
                  <Button
                    type='button'
                    disabled={!designationTemp.trim()}
                    className='bg-white hover:bg-gray-300 cursor-pointer text-blue-500'
                    onClick={handleAddDesignation}
                  >
                    <PlusIcon className='w-5 h-5' />
                    <span className='ml-1'>Add</span>
                  </Button>
                </div>
              </div>

              <div className='flex flex-wrap gap-2 mt-2'>
                {form.designations.map((designation, index) => (
                  <span
                    key={index}
                    className='bg-white flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm'
                  >
                    {designation}
                    <button
                      type='button'
                      onClick={() => handleRemoveDesignation(designation)}
                      className='text-gray-500 hover:text-red-500 transition-colors'
                    >
                      <XIcon className='w-3.5 h-3.5' />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder='Enter project description'
                rows={4}
              />
            </div>
            <div className='space-y-2'>
              <Label>Other Info</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className='w-[50px] text-center'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(form.otherInfo.length > 0
                    ? form.otherInfo
                    : [{ key: '', value: '' }]
                  ).map((info, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={info.key}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              otherInfo:
                                form.otherInfo.length > 0
                                  ? form.otherInfo.map((i, iIndex) =>
                                      iIndex === index
                                        ? { ...i, key: e.target.value }
                                        : i
                                    )
                                  : [
                                      {
                                        key: e.target.value,
                                        value: info.value,
                                      },
                                    ],
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={info.value}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              otherInfo:
                                form.otherInfo.length > 0
                                  ? form.otherInfo.map((i, iIndex) =>
                                      iIndex === index
                                        ? { ...i, value: e.target.value }
                                        : i
                                    )
                                  : [{ key: info.key, value: e.target.value }],
                            })
                          }
                        />
                      </TableCell>
                      <TableCell className='flex items-center justify-center gap-2'>
                        {form.otherInfo.length > 0 && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() =>
                              setForm({
                                ...form,
                                otherInfo: form.otherInfo.filter(
                                  (_, iIndex) => iIndex !== index
                                ),
                              })
                            }
                          >
                            <XIcon className='w-4 h-4 text-red-500' />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className='flex justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={
                    form.otherInfo.length === 0
                      ? false
                      : !form.otherInfo[form.otherInfo.length - 1].key.trim() ||
                        !form.otherInfo[form.otherInfo.length - 1].value.trim()
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      otherInfo: [...form.otherInfo, { key: '', value: '' }],
                    })
                  }
                >
                  <PlusIcon className='w-4 h-4 mr-1' />
                  Add Row
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleSubmit}
              disabled={
                !form.name.trim() ||
                !form.designations.length ||
                !form.description.trim() ||
                (form.otherInfo.length > 0 &&
                  form.otherInfo.some(
                    (info) => !info.key.trim() || !info.value.trim()
                  ))
              }
            >
              Add Project
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
