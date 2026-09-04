import { getTeamMembers } from "@/lib/admin/queries";
import TeamManager from "@/components/admin/cms/TeamManager";

export const metadata = { title: "Team — EDOS Control Centre" };

export default async function TeamPage() {
  const members = await getTeamMembers();
  return <TeamManager members={members} />;
}
