import { Suspense } from "react";
import NewDashboardClient from "./NewDashboardClient";
import { getUserProfileWithProjects } from "@/lib/auth/server-auth";
import { getTestimonialsForProject } from "@/lib/data/testimonials";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const result = await getUserProfileWithProjects();

  if (!result?.user) {
    redirect("/login");
  }

  const { profile, projects } = result;

  // Determine active project
  let activeProjectId = profile?.active_project_id;

  if (!activeProjectId && projects.length > 0) {
    activeProjectId = projects[0].id;
  }

  let testimonials: any[] = [];
  if (activeProjectId) {
    testimonials = await getTestimonialsForProject(activeProjectId);
  }

  return (
    <Suspense fallback={<div className="p-8 text-zinc-400">Loading testimonials...</div>}>
      <NewDashboardClient serverTestimonials={testimonials} />
    </Suspense>
  );
}