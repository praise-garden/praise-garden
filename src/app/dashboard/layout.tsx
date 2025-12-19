import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import { getUserProfileWithProjects } from "@/lib/auth/server-auth";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const result = await getUserProfileWithProjects();

  if (!result?.user) {
    redirect("/login");
  }

  return (
    <div className="h-screen bg-gray-950 text-gray-50 font-sans overflow-hidden">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[18rem_1fr]">
        <Sidebar profile={result.profile} projects={result.projects} user={result.user} />
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
