"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "Testimonials",
    items: [
      { label: "Testimonials", icon: "star", href: "/dashboard" },
      { label: "Video Testimonial", icon: "video", href: "/dashboard/video-testimonial" },
      { label: "Import Testimonials", icon: "upload" },
    ]
  },
  {
    title: "Collect",
    items: [
      { label: "Create Forms", icon: "form" },
      { label: "Widgets", icon: "widget" },
    ]
  }
];

const Icon = ({ name, className }: { name: string; className?: string }) => {
  if (name === "star") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <path d="M12 3l2.9 5.88 6.5.95-4.7 4.57 1.1 6.45L12 18.6 6.2 21.85l1.1-6.45L2.6 9.83l6.5-.95L12 3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name === "upload") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "form") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 13H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm9.4 4a7.4 7.4 0 0 0-.2-1.6l2-1.5-2-3.5-2.3 1a7.7 7.7 0 0 0-2.7-1.6l-.3-2.5H10l-.3 2.5a7.7 7.7 0 0 0-2.7 1.6l-2.3-1-2 3.5 2 1.5A7.4 7.4 0 0 0 2.6 12c0 .54.07 1.07.2 1.6l-2 1.5 2 3.5 2.3-1a7.7 7.7 0 0 0 2.7 1.6l.3 2.5h4.8l.3-2.5a7.7 7.7 0 0 0 2.7-1.6l2.3 1 2-3.5-2-1.5c.13-.52.2-1.05.2-1.6z" fill="currentColor"/></svg>
    );
  }
  if (name === "chevron-down") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    );
  }
  if (name === "chevrons-vertical") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className}>
        <path d="M7 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 15l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return null;
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside aria-label="Primary" className="bg-white border-r border-gray-100 lg:block hidden lg:sticky lg:top-0 h-screen">
      <div className="flex h-full flex-col">
        {/* Top: Project Selector */}
        <div className="p-6">
          <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-semibold">AC</span>
              </div>
              <div className="text-left min-w-0 max-w-[10rem]">
                <p className="font-medium text-gray-900 text-sm md:text-[0.95rem] leading-tight truncate" title="Acme Corporation">Acme Corporation</p>
              </div>
            </div>
            <Icon name="chevrons-vertical" className="size-4 text-gray-400" />
          </button>
          <div className="mt-4 h-px w-full bg-gray-100" />
        </div>

        {/* Middle: Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <nav className="space-y-6" role="navigation">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
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
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <Icon name={item.icon} className="size-4" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom: Account Section */}
        <div className="p-6 border-t border-gray-100 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm">
            <Avatar className="size-8">
              <AvatarImage alt="" src="" />
              <AvatarFallback className="bg-gray-200 text-gray-700 font-medium text-sm">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" title="John Doe">John Doe</p>
              <p className="text-xs text-gray-500 truncate" title="john@example.com">john@example.com</p>
            </div>
            <button
              aria-label="Account settings"
              className="inline-flex items-center justify-center size-8 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
            >
              <Icon name="gear" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}


