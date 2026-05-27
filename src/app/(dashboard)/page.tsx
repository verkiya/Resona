// Dashboard entry: enforces server-side auth, then renders the DashboardView for signed-in users.
import { DashboardView } from "@/features/dashboard/views/dashboard-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
   const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <DashboardView />
    </div>
  );
}
