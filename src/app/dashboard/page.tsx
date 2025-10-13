"use client";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const icons: { [key: string]: React.ReactNode } = {
    star: <svg {...iconProps} fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    search: <svg {...iconProps}><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/></svg>,
    "chevron-down": <svg {...iconProps}><path d="m6 9 6 6 6-6"/></svg>,
    "chevron-left": <svg {...iconProps}><path d="m15 18-6-6 6-6"/></svg>,
    "chevron-right": <svg {...iconProps}><path d="m9 18 6-6-6-6"/></svg>,
    edit: <svg {...iconProps}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    delete: <svg {...iconProps}><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-5v6"/></svg>,
    import: <svg {...iconProps}><path d="M12 13V3m0 0-3 3m3-3 3 3m-3 14v-3h6v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3h6z"/></svg>,
    copy: <svg {...iconProps}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    "eye-open": <svg {...iconProps}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    "eye-closed": <svg {...iconProps}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
                <p className="text-gray-400">Organize the testimonials you have received or imported.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                    <Icon name="import" className="size-4 mr-2" />
                    Import
                </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-lg">
              {["Show All", "Pending", "Public", "Hidden"].map(filter => 
                <Button key={filter} variant="ghost" className={`text-gray-300 px-3 py-1 h-auto text-sm transition-colors ${filter === "Show All" ? "bg-gray-700 hover:bg-gray-700" : "hover:bg-gray-800"}`}>{filter}</Button>
              )}
               <Button variant="ghost" className="text-gray-300 px-3 py-1 h-auto text-sm hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2Zm-4 6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-1.1-.9-2-2-2Zm8 0c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-1.1-.9-2-2-2Z" />
                </svg>
                Filters
                </Button>
            </div>
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input placeholder="Search a testimonial..." className="pl-9 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-blue-500/50 transition-shadow" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_,i) => <Icon key={i} name="star" className="text-yellow-400 size-5" />)}
            <span className="text-gray-400 text-sm font-medium">Rated 5 out of 5</span>
            <span className="text-gray-500 text-sm">| 1 reviews</span>
          </div>
          
          {/* Testimonials Table */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_100px] items-center p-4 border-b border-gray-800 text-sm font-medium text-gray-400 bg-gray-900">
              <input type="checkbox" className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500/50" />
              <span>Reviewer</span>
              <span>Testimonial</span>
              <span>Source</span>
              <span>Status</span>
              <span>Date</span>
              <span></span>
              </div>
            {testimonialData.map(testimonial => (
                <div key={testimonial.id} className="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_100px] items-start p-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors group">
                    <input type="checkbox" className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500/50 mt-3" />
                    <div className="flex items-start gap-3">
                        <Avatar className="size-10 flex-shrink-0">
                            <AvatarFallback className="bg-red-500/80 text-white font-semibold">{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-gray-400">{testimonial.email}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{testimonial.title}</p>
                            <div className="flex items-center gap-0.5 mt-1.5">
                                {[...Array(testimonial.rating)].map((_,i) => <Icon key={i} name="star" className="text-yellow-400 size-3.5" />)}
                            </div>
                        </div>
                      </div>
                    <p className="text-gray-300 text-sm pr-4">{testimonial.text}</p>
                    <p className="text-gray-300 text-sm">{testimonial.source}</p>
                    <div>
                      <Button 
                        onClick={() => handleStatusChange(testimonial.id)} 
                        variant="outline" 
                        className={`h-auto py-1 px-3 text-xs transition-all flex items-center gap-2 ${
                          testimonial.status === 'Public' 
                            ? 'bg-green-500/10 text-green-300 border-green-500/20 hover:bg-green-500/20 hover:text-green-200' 
                            : 'bg-gray-700/50 text-gray-400 border-gray-600/80 hover:bg-gray-700 hover:text-gray-300'
                        }`}
                      >
                        <Icon 
                          name={testimonial.status === 'Public' ? 'eye-open' : 'eye-closed'} 
                          className={`size-4 transition-all ${testimonial.status === 'Hidden' ? 'opacity-70' : ''}`} 
                        />
                        <span>{testimonial.status}</span>
                      </Button>
                        </div>
                    <p className="text-gray-300 text-sm">{testimonial.date}</p>
                    <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Icon name="copy" className="size-4" /></Button>
                        <Button onClick={() => openEditDialog(testimonial)} variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Icon name="edit" className="size-4" /></Button>
                        <Button onClick={() => handleDelete(testimonial.id)} variant="ghost" size="icon" className="text-red-500/80 hover:text-red-500"><Icon name="delete" className="size-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p className="font-medium">Showing 1 to {testimonialData.length} of {testimonialData.length} results</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">Date Added (Newest First) <Icon name="chevron-down" className="size-4 ml-2" /></Button>
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">25 per page <Icon name="chevron-down" className="size-4 ml-2" /></Button>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-r-none"><Icon name="chevron-left" className="size-5" /></Button>
                    <span className="px-3 border-x border-gray-700">1</span>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-l-none"><Icon name="chevron-right" className="size-5" /></Button>
                </div>
            </div>
          </div>
          </main>
      </div>

      {editingTestimonial && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-50">
            <DialogHeader>
              <DialogTitle>Edit Testimonial</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingTestimonial.name} onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})} className="col-span-3 bg-gray-800 border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" value={editingTestimonial.email} onChange={(e) => setEditingTestimonial({...editingTestimonial, email: e.target.value})} className="col-span-3 bg-gray-800 border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">Testimonial</Label>
                <Textarea id="text" value={editingTestimonial.text} onChange={(e) => setEditingTestimonial({...editingTestimonial, text: e.target.value})} className="col-span-3 bg-gray-800 border-gray-700" />
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
    </div>
  );
}
