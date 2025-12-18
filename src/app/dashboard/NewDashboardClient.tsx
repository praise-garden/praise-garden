"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Search, Filter, Calendar as CalendarIcon, Upload, ArrowUpRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { CustomDateRangeDropdown } from "@/components/customdatepicker";
import { TestimonialTable } from "@/components/dashboard/TestimonialTable";
import { cn } from "@/lib/utils";

export interface Testimonial {
    id: number | string;
    reviewer: string;
    email: string;
    profession: string;
    rating: number;
    text: string;
    source: string;
    status: string;
    date: string;
    avatar: string;
}

import { updateTestimonialStatus, deleteTestimonial, updateTestimonialContent } from "@/lib/actions/testimonials";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Static fallback data from previous file to ensure continuity
const staticTestimonials = [
    {
        id: 1,
        reviewer: "jamies",
        email: "jamies@marketing.com",
        profession: "Chief Marketing Officer",
        rating: 5,
        text: "This tool is fantastic. It has completely streamlined our workflow. Highly recommended!",
        source: "Email",
        status: "Pending",
        date: "12/17/2025",
        avatar: "J"
    },
    {
        id: 2,
        reviewer: "sarah",
        email: "shivakrishnaajay@gmail.com",
        profession: "Product Manager",
        rating: 5,
        text: "A game-changer for our team. Support is excellent and features are powerful. Great value.",
        source: "Manual",
        status: "Pending",
        date: "1/17/2025",
        avatar: "S"
    }
];

interface NewDashboardClientProps {
    serverTestimonials: Testimonial[];
}

export default function NewDashboardClient({ serverTestimonials }: NewDashboardClientProps) {
    // Use server data if available, or static if empty (for demo purposes if requested, but logic usually prefers real data)
    // To match the image exactly initially, I might want to prepend the image examples if the list is empty?
    // User asked for logic to handle "existing project has testimonials -> show them".
    const initialData = serverTestimonials.length > 0 ? serverTestimonials : staticTestimonials;

    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [date, setDate] = useState<DateRange | undefined>();

    // Edit States
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<string | number | null>(null);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (serverTestimonials.length > 0) {
            setTestimonials(serverTestimonials);
        }
    }, [serverTestimonials]);

    const filtered = testimonials.filter(t => {
        // Tab Filter
        if (activeTab !== "All" && activeTab !== "Filters") {
            // rough mapping
            if (activeTab === "Pending" && t.status.toLowerCase() !== "pending") return false;
            if (activeTab === "Public" && t.status.toLowerCase() !== "public" && t.status.toLowerCase() !== "approved") return false;
            if (activeTab === "Hidden" && t.status.toLowerCase() !== "hidden" && t.status.toLowerCase() !== "rejected") return false;
        }

        // Search
        const q = searchQuery.toLowerCase();
        const searchMatch = !q || t.reviewer.toLowerCase().includes(q) || t.text.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
        if (!searchMatch) return false;

        // Date
        if (date?.from) {
            const tDate = new Date(t.date);
            const from = new Date(date.from);
            from.setHours(0, 0, 0, 0);
            if (tDate < from) return false;
            if (date.to) {
                const to = new Date(date.to);
                to.setHours(23, 59, 59, 999);
                if (tDate > to) return false;
            }
        }

        return true;
    });

    const handleStatusChange = (id: string | number) => {
        const t = testimonials.find(x => x.id === id);
        if (!t) return;

        // Values in DB are lowercase usually: pending, approved, rejected, hidden.
        // We map 'Public' -> 'approved' and 'Hidden' -> 'hidden' for the backend logic? 
        // Or if the DB stores string literals as visible in UI.
        // Let's assume the UI 'Public' maps to 'approved' and 'Hidden' maps to 'hidden'.
        // If current is 'Public' (approved), toggle to 'Hidden' (hidden).
        // If current is 'Pending', toggle to 'Public' (approved).

        let newStatus = 'approved';
        if (t.status === 'Public' || t.status === 'approved') newStatus = 'hidden';
        else if (t.status === 'Hidden' || t.status === 'hidden') newStatus = 'approved';

        // Optimistic update
        setTestimonials(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus === 'approved' ? 'Public' : 'Hidden' } : item
        ));

        startTransition(async () => {
            try {
                await updateTestimonialStatus(id, newStatus);
            } catch (e) {
                console.error(e);
                // Revert if failed? For MVP we just alert or log
            }
        });
    };

    const handleDelete = (id: string | number) => {
        setTestimonialToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!testimonialToDelete) return;

        // Optimistic
        setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete));

        startTransition(async () => {
            try {
                await deleteTestimonial(testimonialToDelete);
            } catch (e) {
                alert("Failed to delete");
            }
        });

        setDeleteDialogOpen(false);
        setTestimonialToDelete(null);
    };

    const handleEdit = (id: string | number) => {
        const t = testimonials.find(x => x.id === id);
        if (t) {
            setEditingTestimonial({ ...t });
            setIsEditDialogOpen(true);
        }
    };

    const handleSaveEdit = () => {
        if (editingTestimonial) {
            // Optimistic
            setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? editingTestimonial : t));
            setIsEditDialogOpen(false);

            startTransition(async () => {
                // Map UI fields back to DB JSON structure expected by updateTestimonialContent
                const updateData = {
                    customer_name: editingTestimonial.reviewer,
                    customer_email: editingTestimonial.email,
                    message: editingTestimonial.text
                };
                try {
                    await updateTestimonialContent(editingTestimonial.id, updateData);
                } catch (e) {
                    console.error(e);
                    alert("Failed to save changes");
                }
                setEditingTestimonial(null);
            });
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Testimonials</h1>
                    <p className="text-zinc-400 text-sm mt-1">Organize the testimonials you have received or imported.</p>
                </div>
                <Link href="/dashboard/import">
                    <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-lg px-6 h-10 font-medium transition-all">
                        <Upload className="size-4 mr-2" />
                        Import Testimonials
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                <div className="flex items-center gap-4 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
                    <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                        {["All", "Pending", "Public", "Hidden"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                                    activeTab === tab
                                        ? "bg-zinc-800 text-white shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 h-9">
                        <Filter className="size-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Search & Date */}
            {/* Search & Date */}
            {/* Search & Date */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <Input
                        placeholder="Search a testimonial..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#0A0A0B] border-zinc-800 pl-10 h-11 focus:ring-indigo-500/20 focus:border-indigo-500/50 rounded-lg text-sm w-full"
                    />
                </div>
                <div className="sm:w-auto">
                    <CustomDateRangeDropdown dateRange={date} onChange={setDate} />
                </div>
            </div>

            {/* Testimonial Table Component - Encapsulated in a box */}
            <TestimonialTable
                testimonials={filtered}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onCopy={handleCopy}
            />

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900/50">
                <p className="text-zinc-500 text-xs">Showing {filtered.length} results</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white h-8 text-xs font-normal">
                        Date Added (Newest First)
                    </Button>
                    {/* Pagination buttons could go here if implemented */}
                </div>
            </div>

            {/* Edit Dialog */}
            {editingTestimonial && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                        <DialogHeader>
                            <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right text-zinc-400">Name</Label>
                                <Input id="name" value={editingTestimonial.reviewer} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, reviewer: e.target.value })} className="col-span-3 bg-zinc-900 border-zinc-800" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right text-zinc-400">Email</Label>
                                <Input id="email" value={editingTestimonial.email} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, email: e.target.value })} className="col-span-3 bg-zinc-900 border-zinc-800" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="text" className="text-right text-zinc-400">Message</Label>
                                <Textarea id="text" value={editingTestimonial.text} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })} className="col-span-3 bg-zinc-900 border-zinc-800 min-h-[100px]" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleSaveEdit} className="bg-indigo-600 hover:bg-indigo-500 text-white">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Would you like to proceed with delete? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
