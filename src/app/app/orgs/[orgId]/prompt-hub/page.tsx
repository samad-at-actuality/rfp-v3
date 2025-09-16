import { PromptHubPage } from '@/components/prompt-hub';

export default async function PromptHubHomePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const orgId = (await params).orgId;
  return <PromptHubPage orgId={orgId} />;
}
