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
  },
  {
    name: 'Projects',
    type: TPrimaryFolderEnum.PROJECTS,
    slug: 'projects',
    icon: Briefcase, // 💼 Represents projects/work
  },
  {
    name: 'Company Profile',
    type: TPrimaryFolderEnum.COMPANY_INFO,
    slug: 'company-info',
    icon: Building2, // 🏢 Represents company/organization
  },
  {
    name: 'Past RFPs',
    type: TPrimaryFolderEnum.PAST_RFPS,
    slug: 'past-rfps',
    icon: FileText, // 📄 Represents documents/RFPs
  },
  {
    name: 'Other',
    type: TPrimaryFolderEnum.OTHER,
    slug: 'other',
    icon: FolderOpen, // 📁 Generic folder for miscellaneous
  },
];
