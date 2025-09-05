'use client';
import { useState } from 'react';
import { OrgsTable } from '@/components/OrgsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TOrg } from '@/types/TOrg';
import { createOrg } from '@/lib/apis/organisationsApi';

export default function AdminPage({ orgs: orgs_ }: { orgs: TOrg[] }) {
  const [orgs, setOrgs] = useState(orgs_);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
  });

  const [formError, setFormError] = useState({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await createOrg(form);

      if (data.data) {
        setOrgs((p) => [...p, data.data]);
        setForm({
          name: '',
          description: '',
          adminName: '',
          adminEmail: '',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    console.log(e.currentTarget);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value.trim() });
    setFormError({ ...formError, [name]: '' });
  };

  return (
    <div className='w-[80%] border-[1px] border-gray-200 bg-white mx-auto my-20 rounded-lg shadow p-6  space-y-8'>
      <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
        Create Organization
      </h3>
      <form className='space-y-4' onSubmit={onSubmit}>
        <div className='flex gap-4 '>
          <div className='flex flex-col gap-2 flex-1 '>
            <label className='text-lg' htmlFor='name'>
              Name
            </label>
            <Input
              required
              type='text'
              name='name'
              value={form.name}
              onChange={onChange}
            />
            {formError.name && (
              <p className='text-red-500'>{formError.name}</p>
            )}{' '}
          </div>
          <div className='flex flex-col gap-2 flex-1'>
            <label className='text-lg' htmlFor='description'>
              Description
            </label>
            <Input
              required
              type='text'
              name='description'
              value={form.description}
              onChange={onChange}
            />
            {formError.description && (
              <p className='text-red-500'>{formError.description}</p>
            )}
          </div>
        </div>
        <div className='flex gap-4 items-end'>
          <div className='flex flex-col gap-2 flex-1 '>
            <label className='text-lg' htmlFor='adminName'>
              Admin Name
            </label>
            <Input
              required
              type='text'
              name='adminName'
              value={form.adminName}
              onChange={onChange}
            />
            {formError.adminName && (
              <p className='text-red-500'>{formError.adminName}</p>
            )}
          </div>
          <div className='flex flex-col gap-2 flex-1'>
            <label className='text-lg' htmlFor='adminEmail'>
              Admin Email
            </label>
            <div className='flex gap-2'>
              <Input
                required
                type='email'
                name='adminEmail'
                value={form.adminEmail}
                onChange={onChange}
              />
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>

            {formError.adminEmail && (
              <p className='text-red-500'>{formError.adminEmail}</p>
            )}
          </div>
        </div>
      </form>

      <OrgsTable orgs={orgs} />
    </div>
  );
}
