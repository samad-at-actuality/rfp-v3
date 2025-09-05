'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TOrg } from '@/types/TOrg';
import { convertToReadableDate } from '@/lib/utils';

export function OrgsTable({ orgs }: { orgs: TOrg[] }) {
  return (
    <Table>
      <TableCaption>Organizations</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className='w-[100px]'>Link</TableHead> */}
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          {/* <TableHead>Description</TableHead> */}
          {/* <TableHead>Admin Name</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orgs.map((org) => (
          <TableRow key={org.id}>
            {/* <TableCell className='font-medium'>
              <Link
                className='text-blue-400 flex gap-2'
                href={`/app/orgs/${org.id}`}
                target='_blank'
              >
                Go To <ExternalLinkIcon className='w-4 h-4' />
              </Link>
            </TableCell> */}
            <TableCell>{org.name}</TableCell>
            <TableCell>{convertToReadableDate(org.createdAt)}</TableCell>
            {/* <TableCell>{org.description || 'No description'}</TableCell> */}
            {/* <TableCell>{org.adminName}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
