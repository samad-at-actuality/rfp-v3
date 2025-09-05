import Link from 'next/link';
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  FolderOpen,
} from 'lucide-react';

// Update your existingFolders array with these icons:
const existingFolders = [
  {
    name: 'People',
    type: 'PEOPLE',
    slug: 'people',
    icon: Users, // 👥 Represents people/team
  },
  {
    name: 'Projects',
    type: 'PROJECTS',
    slug: 'projects',
    icon: Briefcase, // 💼 Represents projects/work
  },
  {
    name: 'Company Profile',
    type: 'COMPANY_INFO',
    slug: 'company-info',
    icon: Building2, // 🏢 Represents company/organization
  },
  {
    name: 'Past RFPs',
    type: 'PAST_RFPS',
    slug: 'past-rfps',
    icon: FileText, // 📄 Represents documents/RFPs
  },
  {
    name: 'Other',
    type: 'OTHER',
    slug: 'other',
    icon: FolderOpen, // 📁 Generic folder for miscellaneous
  },
];

export default async function DataPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const orgId = (await params).orgId;

  return (
    <div className='p-6 space-y-6 h-[400vh]'>
      <h2 className='text-2xl font-bold'>Knowledge Hub</h2>

      <div className='grid grid-cols-6 gap-8'>
        {existingFolders.map((folder) => (
          <Link
            key={folder.slug}
            href={`/app/orgs/${orgId}/data/${folder.slug}`}
            className='flex rounded-lg h-[80px] shadow-[0px_1px_12px_0px_#1F29370D] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4'
          >
            <div className='flex-1 flex flex-col justify-center gap-2 bg-white'>
              <div className='flex items-center gap-2'>
                <folder.icon className='w-6 h-6 text-gray-500 font-semibold' />
                <span className='text-[#1F2937] font-semibold text-[16px]'>
                  {folder.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
