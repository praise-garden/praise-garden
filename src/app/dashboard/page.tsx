"use client";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateRange } from "react-day-picker";
import { CustomDateRangeDropdown } from "@/components/customdatepicker";
import { PraiseWidget } from "@/components/praise/PraiseWidget";
import { PraiseTestimonial } from "@/components/praise/PraiseTestimonialCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const testimonials = [
  {
    id: 1,
    name: "Bert",
    email: "h@gmail.com",
    title: "Co-Founder of Startups",
    rating: 5,
    text: "This is a fantastic product! It has completely changed my workflow.",
    source: "Web Form",
    status: "Public",
    date: "Sep 23, 2025",
    avatar: "B"
  },
  {
    id: 2,
    name: "Alice",
    email: "alice@example.com",
    title: "Lead Designer",
    rating: 4,
    text: "Great design and easy to use. I would recommend it to my colleagues.",
    source: "Import",
    status: "Public",
    date: "Sep 22, 2025",
    avatar: "A"
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@startup.io",
    title: "CEO",
    rating: 5,
    text: "A game-changer for our company. We've seen a huge increase in engagement.",
    source: "Web Form",
    status: "Hidden",
    date: "Sep 21, 2025",
    avatar: "C"
  },
  {
    id: 4,
    name: "Diana",
    email: "diana@service.com",
    title: "Marketing Manager",
    rating: 5,
    text: "Incredible tool that has helped us gather valuable feedback.",
    source: "Email",
    status: "Public",
    date: "Sep 20, 2025",
    avatar: "D"
  },
  {
    id: 5,
    name: "Ethan",
    email: "ethan@e-corp.com",
    title: "Software Engineer",
    rating: 3,
    text: "It's a good tool, but there are a few features I'd like to see added.",
    source: "Import",
    status: "Hidden",
    date: "Sep 19, 2025",
    avatar: "E"
  }
];

interface Testimonial {
  id: number;
  name: string;
  email: string;
  title: string;
  rating: number;
  text: string;
  source: string;
  status: string;
  date: string;
  avatar: string;
}

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const iconProps = {
    className: `size-4 ${className}`,
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  const icons: { [key: string]: React.ReactNode } = {
    star: <svg {...iconProps} fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    search: <svg {...iconProps}><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" /></svg>,
    "chevron-down": <svg {...iconProps}><path d="m6 9 6 6 6-6" /></svg>,
    "chevron-left": <svg {...iconProps}><path d="m15 18-6-6 6-6" /></svg>,
    "chevron-right": <svg {...iconProps}><path d="m9 18 6-6-6-6" /></svg>,
    edit: <svg {...iconProps}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    delete: <svg {...iconProps}><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-5v6" /></svg>,
    import: <svg {...iconProps}><path d="M12 13V3m0 0-3 3m3-3 3 3m-3 14v-3h6v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3h6z" /></svg>,
    copy: <svg {...iconProps}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    "eye-open": <svg {...iconProps}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    "eye-closed": <svg {...iconProps}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    sparkles: <svg {...iconProps} strokeWidth="1.5"><path d="M9.42 6.2L8 3.5 6.58 6.2 4 7l2.58 2.8L6 12.5l2-1.62 2 1.62-.58-2.7L12 7l-2.58-.8zM20 9.5l-2.58.8L15 7.5l-1.42 2.8L11 11l2.58.8L15 14.5l1.42-2.8L19 11z" /></svg>,
    "check-circle": <svg {...iconProps} strokeWidth="2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>,
    tag: <svg {...iconProps}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" /></svg>,
    calendar: <svg {...iconProps}><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V6h14v14z" /></svg>,
  };

  return icons[name] || null;
};

export default function DashboardPage() {
  // Not using server-side auth for now as we need client-side interactions
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   redirect("/login");
  // }

  const [testimonialData, setTestimonialData] = useState<Testimonial[]>(testimonials);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();

  // Widget preview state
  const [widgetLayout, setWidgetLayout] = useState<"grid" | "list" | "carousel">("grid");
  const [widgetColumns, setWidgetColumns] = useState<1 | 2 | 3 | 4>(3);
  const [showRating, setShowRating] = useState(true);
  const [showSource, setShowSource] = useState(true);
  const [compact, setCompact] = useState(false);

  const filteredTestimonials = testimonialData.filter(testimonial => {
    // Status filter
    const statusMatch = statusFilter === "All" || testimonial.status === statusFilter;

    // Search query filter
    const searchMatch = searchQuery === "" ||
      testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filter
    if (!date?.from) {
      return statusMatch && searchMatch;
    }

    const testimonialDate = new Date(testimonial.date);
    const fromDate = new Date(date.from);
    fromDate.setHours(0, 0, 0, 0);

    if (date.to) {
      const toDate = new Date(date.to);
      toDate.setHours(23, 59, 59, 999);
      return statusMatch && searchMatch && testimonialDate >= fromDate && testimonialDate <= toDate;
    }

    return statusMatch && searchMatch && testimonialDate >= fromDate;
  });

  const handleStatusChange = (id: number) => {
    setTestimonialData(testimonialData.map(t =>
      t.id === id ? { ...t, status: t.status === 'Public' ? 'Hidden' : 'Public' } : t
    ));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonialData(testimonialData.filter(t => t.id !== id));
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial({ ...testimonial });
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (editingTestimonial) {
      setTestimonialData(testimonialData.map(t => t.id === editingTestimonial.id ? editingTestimonial : t));
      setIsEditDialogOpen(false);
      setEditingTestimonial(null);
    }
  };

  // Convert testimonials to widget format
  const convertToWidgetTestimonials = (testimonials: Testimonial[]): PraiseTestimonial[] => {
    return testimonials
      .filter(t => t.status === 'Public') // Only show public testimonials in widgets
      .map(t => ({
        id: t.id.toString(),
        authorName: t.name,
        authorTitle: t.title,
        authorAvatarUrl: undefined,
        rating: t.rating,
        content: t.text,
        source: t.source,
        date: t.date,
      }));
  };

  const widgetTestimonials = convertToWidgetTestimonials(filteredTestimonials);

  const copyEmbedSnippet = () => {
    const payload = {
      layout: widgetLayout,
      columns: widgetColumns,
      showRating,
      showSource,
      compact,
    };
    const snippet = `<div id="trustimonials-widget" data-layout="${widgetLayout}" data-columns="${widgetColumns}" data-show-rating="${showRating}" data-show-source="${showSource}" data-compact="${compact}"></div>
<script>
(function(){
  var el = document.getElementById('trustimonials-widget');
  if(!el) return;
  var layout = el.getAttribute('data-layout') || 'grid';
  var columns = parseInt(el.getAttribute('data-columns') || '3', 10);
  var showRating = el.getAttribute('data-show-rating') !== 'false';
  var showSource = el.getAttribute('data-show-source') !== 'false';
  var compact = el.getAttribute('data-compact') === 'true';
  
  var placeholder = document.createElement('div');
  placeholder.style.border = '1px dashed #ccc';
  placeholder.style.padding = '12px';
  placeholder.style.borderRadius = '10px';
  placeholder.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif';
  placeholder.innerText = 'Trustimonials widget placeholder (no backend yet).\\n' +
    'layout=' + layout + ', columns=' + columns + ', showRating=' + showRating + ', showSource=' + showSource + ', compact=' + compact;
  el.appendChild(placeholder);
})();
</script>`;

    navigator.clipboard.writeText(snippet);
    // You could add a toast notification here
  };

  return (
    <>
      <div className="space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Testimonials</h1>
            <p className="text-zinc-400 mt-1">Organize the testimonials you have received or imported.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 transition-colors">
              <Icon name="import" className="size-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-full">
              <Icon name="sparkles" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
              <Input
                placeholder="Search for your testimonials"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-zinc-900/80 border-zinc-700/60 focus:border-zinc-600 focus:ring-2 focus:ring-violet-500/50 transition-all duration-200 h-12 text-md placeholder:text-zinc-500 rounded-xl w-full"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-zinc-900/80 border-zinc-700/60 hover:bg-zinc-800/80 hover:border-zinc-600 transition-all duration-200 h-12 px-5 shadow-sm min-w-max"
                >
                  <Icon name="check-circle" className="size-5 mr-2.5" />
                  <span className="text-md font-medium">{statusFilter}</span>
                  <Icon name="chevron-down" className="size-5 ml-2.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800/60 text-zinc-50 shadow-xl">
                <DropdownMenuItem
                  className="hover:bg-zinc-800/80 cursor-pointer text-md"
                  onSelect={() => setStatusFilter("All")}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800/80 cursor-pointer text-md"
                  onSelect={() => setStatusFilter("Public")}
                >
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800/80 cursor-pointer text-md"
                  onSelect={() => setStatusFilter("Hidden")}
                >
                  Hidden
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-zinc-800/80 cursor-pointer text-md"
                  onSelect={() => setStatusFilter("Pending")}
                >
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CustomDateRangeDropdown
              dateRange={date}
              onChange={(r) => setDate(r)}
            />
          </div>
        </div>

        {/* Testimonials Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_100px] items-center p-4 border-b border-zinc-800 text-sm font-medium text-zinc-400 bg-zinc-900">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-600 text-violet-500 focus:ring-violet-500/50" />
            <span>Reviewer</span>
            <span>Testimonial</span>
            <span>Source</span>
            <span>Status</span>
            <span>Date</span>
            <span></span>
          </div>
          {filteredTestimonials.map(testimonial => (
            <div key={testimonial.id} className="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_100px] items-start p-4 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50 transition-colors group">
              <input type="checkbox" className="rounded bg-zinc-800 border-zinc-600 text-violet-500 focus:ring-violet-500/50 mt-3" />
              <div className="flex items-start gap-3">
                <Avatar className="size-10 flex-shrink-0">
                  <AvatarFallback className="bg-violet-500/80 text-white font-semibold">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-zinc-400">{testimonial.email}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{testimonial.title}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon
                        key={index}
                        name="star"
                        className={`size-3.5 ${index < testimonial.rating ? "text-amber-400" : "text-zinc-700"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-zinc-300 text-sm pr-4">{testimonial.text}</p>
              <p className="text-zinc-300 text-sm">{testimonial.source}</p>
              <div>
                <Button
                  onClick={() => handleStatusChange(testimonial.id)}
                  variant="outline"
                  className={`h-auto py-1 px-3 text-xs transition-all flex items-center gap-2 ${testimonial.status === 'Public'
                    ? 'bg-green-500/10 text-green-300 border-green-500/20 hover:bg-green-500/20 hover:text-green-200'
                    : 'bg-zinc-700/50 text-zinc-400 border-zinc-600/80 hover:bg-zinc-700 hover:text-zinc-300'
                    }`}
                >
                  <Icon
                    name={testimonial.status === 'Public' ? 'eye-open' : 'eye-closed'}
                    className={`size-4 transition-all ${testimonial.status === 'Hidden' ? 'opacity-70' : ''}`}
                  />
                  <span>{testimonial.status}</span>
                </Button>
              </div>
              <p className="text-zinc-300 text-sm">{testimonial.date}</p>
              <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><Icon name="copy" className="size-4" /></Button>
                <Button onClick={() => openEditDialog(testimonial)} variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><Icon name="edit" className="size-4" /></Button>
                <Button onClick={() => handleDelete(testimonial.id)} variant="ghost" size="icon" className="text-red-500/80 hover:text-red-500"><Icon name="delete" className="size-4" /></Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <p className="font-medium">Showing 1 to {filteredTestimonials.length} of {filteredTestimonials.length} results</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">Date Added (Newest First) <Icon name="chevron-down" className="size-4 ml-2" /></Button>
            <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">25 per page <Icon name="chevron-down" className="size-4 ml-2" /></Button>
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-r-none"><Icon name="chevron-left" className="size-5" /></Button>
              <span className="px-3 border-x border-zinc-700">1</span>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-l-none"><Icon name="chevron-right" className="size-5" /></Button>
            </div>
          </div>
        </div>

      </div>

      {editingTestimonial && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
            <DialogHeader>
              <DialogTitle>Edit Testimonial</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingTestimonial.name} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="col-span-3 bg-zinc-800 border-zinc-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" value={editingTestimonial.email} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, email: e.target.value })} className="col-span-3 bg-zinc-800 border-zinc-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">Testimonial</Label>
                <Textarea id="text" value={editingTestimonial.text} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })} className="col-span-3 bg-zinc-800 border-zinc-700" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </>
  );
}