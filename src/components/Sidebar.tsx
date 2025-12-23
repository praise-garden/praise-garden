"use client";

import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import ProjectSwitcherModal from "./ProjectSwitcherModal";

const navSections = [
  {
    title: "Testimonials",
    items: [
      { label: "All Testimonials", icon: "star", href: "/dashboard" },
      { label: "Video Testimonials", icon: "video", href: "/video-testimonial" },
      { label: "Import", icon: "upload", href: "/import" },
    ],
  },
  {
    title: "Collection",
    items: [
      { label: "Form Builder", icon: "form", href: "/forms" },
      { label: "Design", icon: "widget", href: "/design" },
      { label: "Brand", icon: "sparkles", href: "/brand" },
    ],
  },
];

const Icon = ({ name, className }: { name: string; className?: string }) => {
  if (name === "palette") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <path d="M12 21a6 6 0 0 1-3.8-10.4 2 2 0 0 0 .8-2.6A2 2 0 0 1 11 4a2 2 0 0 1 2-2 10 10 0 0 1 10 10c0 5-2 9-9 9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="12" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="16.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="12" cy="15" r=".5" fill="currentColor" />
      </svg>
    )
  }
  if (name === "sparkles") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" fill="none" stroke="none" />
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
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
  username?: string | null;
  full_name: string | null;
  plan: string | null;
  active_project_id: string | null;
  avatar_url?: string | null;
} | null;

type ProjectSummary = {
  id: string;
  name: string | null;
  brand_settings?: any;
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

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <span className="font-bold text-white text-lg">Trustimonials</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        aria-label="Mobile navigation"
        className={`lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/95 border-r border-gray-800/50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col pt-16">
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Project Selector */}
            <button
              onClick={() => {
                setIsProjectModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-xl p-3 mb-6 bg-zinc-900/60 border border-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                {activeProject?.brand_settings?.logoUrl ? (
                  <div className="size-8 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={activeProject.brand_settings.logoUrl}
                      alt={formatProjectName(activeProject)}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {projectInitials}
                  </div>
                )}
                <span className="text-white font-medium truncate max-w-[140px]">{formatProjectName(activeProject)}</span>
              </div>
              <ChevronsUpDown className="size-4 text-gray-500" />
            </button>

            {/* Nav Sections */}
            {navSections.map((section) => (
              <div key={section.title} className="mb-6">
                <span className="block px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  {section.title}
                </span>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                          ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white border-l-2 border-violet-500"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                          }`}
                      >
                        <Icon name={item.icon} className="size-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0 p-4 border-t border-gray-800/50">
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <Avatar className="size-9 border-2 border-gray-700">
                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="bg-gray-800 text-white text-sm font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
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
            {/* Project Selector - Switcher */}
            <div className="mb-8">
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full flex items-center justify-between rounded-xl p-3 mb-6 bg-zinc-900/60 border border-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {activeProject?.brand_settings?.logoUrl ? (
                    <div className="size-8 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={activeProject.brand_settings.logoUrl}
                        alt={formatProjectName(activeProject)}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/20 shrink-0">
                      {projectInitials}
                    </div>
                  )}
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold text-white truncate w-full text-left">
                      {formatProjectName(activeProject)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {planLabel} Plan
                    </span>
                  </div>
                </div>
                <ChevronsUpDown className="size-4 text-gray-500 group-hover:text-gray-300 transition-colors shrink-0" />
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
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-800/50">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="group w-full flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-gray-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <Avatar className="size-9 ring-2 ring-gray-700/50 group-hover:ring-emerald-500/50 transition-all">
                <AvatarImage alt={displayName} src={profile?.avatar_url || user.user_metadata?.avatar_url || ""} />
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
          </div>
        </div>
      </aside>

      <ProjectSwitcherModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={projects}
        activeProjectId={activeProject?.id ?? null}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        profile={profile}
      />
    </>
  );
};

export default Sidebar;


