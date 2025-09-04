import { notFound } from 'next/navigation';
import { getSuperAdminOrgs } from '@/lib/apis/organisationsApi';
import AdminPage from './AdminPage';

export default async function AdminHomePage() {
  const orgs_ = await getSuperAdminOrgs();

  if (!orgs_.data) {
    return notFound();
  }

  return <AdminPage orgs={orgs_.data} />;
}
