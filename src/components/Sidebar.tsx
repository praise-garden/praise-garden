"use client";

import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { createProject } from "@/lib/actions/projects";
import { SignOutButton } from "./SignOutButton";

const navSections = [
  {
    title: "Testimonials",
    items: [
      { label: "All Testimonials", icon: "star", href: "/dashboard" },
      { label: "Video Testimonials", icon: "video", href: "/dashboard/video-testimonial" },
      { label: "Import", icon: "upload", href: "/dashboard/import" },
    ],
  },
  {
    title: "Collection",
    items: [
      { label: "Form Builder", icon: "form", href: "/dashboard/forms" },
      { label: "Design", icon: "widget", href: "/dashboard/widgets" },
    ],
  },
];

const Icon = ({ name, className }: { name: string; className?: string }) => {
  if (name === "star") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <path d="M12 3l2.9 5.88 6.5.95-4.7 4.57 1.1 6.45L12 18.6 6.2 21.85l1.1-6.45L2.6 9.83l6.5-.95L12 3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "upload") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    );
  }
  if (name === "form") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 13H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    );
  }
  if (name === "widget") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <rect x="3" y="3" width="8" height="8" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="3" width="8" height="8" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3" y="13" width="8" height="8" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="13" width="8" height="8" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "video") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <rect x="3" y="5" width="14" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M17 9l4-2v10l-4-2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "gear") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm9.4 4a7.4 7.4 0 0 0-.2-1.6l2-1.5-2-3.5-2.3 1a7.7 7.7 0 0 0-2.7-1.6l-.3-2.5H10l-.3 2.5a7.7 7.7 0 0 0-2.7 1.6l-2.3-1-2 3.5 2 1.5A7.4 7.4 0 0 0 2.6 12c0 .54.07 1.07.2 1.6l-2 1.5 2 3.5 2.3-1a7.7 7.7 0 0 0 2.7 1.6l.3 2.5h4.8l.3-2.5a7.7 7.7 0 0 0 2.7-1.6l2.3 1 2-3.5-2-1.5c.13-.52.2-1.05.2-1.6z" fill="currentColor" /></svg>
    );
  }
  if (name === "chevron-down") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    );
  }
  if (name === "chevrons-vertical") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <path d="M7 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
};

type ProfileSummary = {
  id: string;
  username: string | null;
  full_name: string | null;
  plan: string | null;
  active_project_id: string | null;
} | null;

type ProjectSummary = {
  id: string;
  name: string | null;
};

type SidebarProps = {
  user: User;
  profile: ProfileSummary;
  projects: ProjectSummary[];
};

const getInitials = (value: string) => {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const formatProjectName = (project: ProjectSummary | undefined) => {
  if (!project) {
    return "No Project";
  }

  return project.name?.trim() || "Untitled Project";
};

const formatPlanLabel = (plan: string | null | undefined) => {
  if (!plan) {
    return "hacker";
  }

  return plan.toLowerCase();
};

const Sidebar = ({ user, profile, projects }: SidebarProps) => {
  const pathname = usePathname();

  const displayName = useMemo(() => {
    if (profile?.full_name?.trim()) {
      return profile.full_name.trim();
    }

    if (user.user_metadata?.full_name) {
      return String(user.user_metadata.full_name).trim();
    }

    if (profile?.username?.trim()) {
      return profile.username.trim();
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "New User";
  }, [profile?.full_name, profile?.username, user.email, user.user_metadata?.full_name]);

  const emailAddress = user.email ?? "";

  const activeProject = useMemo(() => {
    if (!projects.length) {
      return undefined;
    }

    if (profile?.active_project_id) {
      const matched = projects.find((project) => project.id === profile.active_project_id);
      if (matched) {
        return matched;
      }
    }

    return projects[0];
  }, [profile?.active_project_id, projects]);

  const otherProjects = useMemo(() => {
    return projects.filter((project) => project.id !== activeProject?.id);
  }, [activeProject?.id, projects]);

  const projectInitials = getInitials(formatProjectName(activeProject));
  const userInitials = getInitials(displayName);
  const planLabel = formatPlanLabel(profile?.plan);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreateProject = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createProject(formData);
        setIsCreateProjectOpen(false);
      } catch (error: any) {
        console.error(error);
        alert(error.message || "Failed to create project");
      }
    });
  };

  return (
    <>
      <aside
        aria-label="Primary navigation"
        className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/95 border-r border-gray-800/50"
      >
        <div className="flex h-full flex-col">
          {/* 1. Trustimonials Logo Section - Top */}
          <div className="flex-shrink-0 p-6">
            <div className="flex items-center gap-3">
              <div className="size-9 flex items-center justify-center">
                <Logo size={36} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Trustimonials</h1>
              </div>
            </div>
          </div>

          {/* 2. Navigation & Project Section - Middle (scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {/* Project Selector */}
            {/* Project Selector - Read Only */}
            <div className="mb-8">
              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="group w-full flex items-center justify-between p-3 rounded-2xl bg-gray-800/60 hover:bg-gray-800/80 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-md group-hover:shadow-lg transition-shadow">
                    {projectInitials || "PG"}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p
                      className="truncate text-sm font-semibold text-gray-50 group-hover:text-white transition-colors"
                      title={formatProjectName(activeProject)}
                    >
                      {formatProjectName(activeProject)}
                    </p>
                  </div>
                </div>
                <Plus className="size-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-8" role="navigation">
              {navSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {section.title && (
                    <h3 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const href = item.href || "#";
                      const isActive = item.href ? pathname === item.href : false;
                      return (
                        <Link
                          key={item.label}
                          href={href}
                          aria-current={isActive ? "page" : undefined}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${isActive
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
                            }`}
                        >
                          <Icon
                            name={item.icon}
                            className={`size-4 transition-colors ${isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"
                              }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div >

          {/* 3. User Profile Section - Bottom */}
          < div className="flex-shrink-0 p-6 pt-4 border-t border-gray-800/50" >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group w-full flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-gray-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
                  <Avatar className="size-9 ring-2 ring-gray-700/50 group-hover:ring-emerald-500/50 transition-all">
                    <AvatarImage alt={displayName} src={user.user_metadata?.avatar_url ?? ""} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-sm font-semibold text-gray-200">
                      {userInitials || "PG"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-gray-50" title={displayName}>
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-gray-400" title={emailAddress}>
                      {emailAddress || "No email"}
                    </p>
                  </div>
                  <div className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-all ${planLabel === 'hacker'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border border-blue-500/30 bg-blue-500/10 text-blue-400'
                    }`}>
                    {planLabel}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-gray-50">{displayName}</p>
                    <p className="text-xs leading-none text-gray-400">{emailAddress || "No email"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div >
        </div >
      </aside >

      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form action={handleCreateProject} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-400">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. My Awesome Project"
                className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateProjectOpen(false)}
                className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {isPending ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;


