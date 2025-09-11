import { Users } from 'lucide-react';
import { Briefcase } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { FileText } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';

export const PrimaryFolders = [
  {
    name: 'People',
    type: TPrimaryFolderEnum.PEOPLE,
    slug: 'people',
    icon: Users, // 👥 Represents people/team
    id: 'PEOPLE',
  },
  {
    name: 'Projects',
    type: TPrimaryFolderEnum.PROJECTS,
    slug: 'projects',
    icon: Briefcase, // 💼 Represents projects/work
    id: 'PROJECTS',
  },
  {
    name: 'Company Profile',
    type: TPrimaryFolderEnum.COMPANY_INFO,
    slug: 'company-info',
    icon: Building2,
    id: 'COMPANY_INFO', // 🏢 Represents company/organization
  },
  {
    name: 'Past RFPs',
    type: TPrimaryFolderEnum.PAST_RFPS,
    slug: 'past-rfps',
    icon: FileText,
    id: 'PAST_RFPS', // 📄 Represents documents/RFPs
  },
  {
    name: 'Other',
    type: TPrimaryFolderEnum.OTHER,
    slug: 'other',
    icon: FolderOpen, // 📁 Generic folder for miscellaneous
    id: 'OTHER',
  },
];
