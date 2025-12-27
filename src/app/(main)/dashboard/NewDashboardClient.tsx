"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, Upload, ListFilter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { CustomDateRangeDropdown } from "@/components/customdatepicker";
import { TestimonialTable } from "@/components/dashboard/TestimonialTable";
import { cn } from "@/lib/utils";
import { BulkActionsFloatingBar } from "@/components/dashboard/BulkActionsFloatingBar";

export interface Testimonial {
    id: number | string;
    type: string;
    reviewer: string;
    email: string;
    profession: string;
    rating: number;
    text: string;
    source: string;
    status: string;
    date: string;
    avatar: string;
    attachments?: { type: 'image' | 'video', url: string }[];
    videoThumbnail?: string;
    trimStart?: number;
    trimEnd?: number;
    raw?: any;
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Static fallback data from previous file to ensure continuity
const staticTestimonials = [
    {
        id: 1,
        type: 'text',
        reviewer: "jamies",
        email: "jamies@marketing.com",
        profession: "Chief Marketing Officer",
        rating: 5,
        text: "This tool is fantastic. It has completely streamlined our workflow. Highly recommended!",
        source: "Email",
        status: "Hidden",
        date: "12/17/2025",
        avatar: "J"
    },
    {
        id: 2,
        type: 'text',
        reviewer: "sarah",
        email: "shivakrishnaajay@gmail.com",
        profession: "Product Manager",
        rating: 5,
        text: "A game-changer for our team. Support is excellent and features are powerful. Great value.",
        source: "Manual",
        status: "Hidden",
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
    const router = useRouter();

    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [date, setDate] = useState<DateRange | undefined>();
    const [sortBy, setSortBy] = useState("newest");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Edit States
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    // Removed unused full edit states
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<string | number | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

    const [, startTransition] = useTransition();

    useEffect(() => {
        if (serverTestimonials.length > 0) {
            setTestimonials(serverTestimonials);
        }
    }, [serverTestimonials]);

    const filtered = testimonials.filter(t => {
        // Tab Filter
        if (activeTab !== "All" && activeTab !== "Filters") {
            // Updated mapping
            if (activeTab === "Public" && t.status.toLowerCase() !== "public") return false;
            if (activeTab === "Hidden" && t.status.toLowerCase() !== "hidden") return false;
            if (activeTab === "Pending" && t.status.toLowerCase() !== "pending") return false;
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

    const sortedAndFiltered = [...filtered].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'oldest') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'rating-high') {
            return b.rating - a.rating;
        }
        if (sortBy === 'rating-low') {
            return a.rating - b.rating;
        }
        return 0;
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedAndFiltered.length);
    const paginatedTestimonials = sortedAndFiltered.slice(startIndex, startIndex + itemsPerPage);

    // Pagination Page Numbers Logic
    const pageNumbers = (() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);
        if (currentPage <= 3) { start = 1; end = Math.min(5, totalPages); }
        if (currentPage >= totalPages - 2) { start = Math.max(1, totalPages - 4); end = totalPages; }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    })();

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, date, sortBy]);

    const handleSelect = (id: string | number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(sortedAndFiltered.map(t => t.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleStatusChange = (id: string | number) => {
        const t = testimonials.find(x => x.id === id);
        if (!t) return;

        // Values in DB are: public, hidden, pending
        // UI uses: Public, Hidden, Pending

        let newStatus = 'public';
        if (t.status === 'Public') newStatus = 'hidden';
        else if (t.status === 'Hidden') newStatus = 'public';
        else if (t.status === 'Pending') newStatus = 'public'; // Approve pending to public

        // Optimistic update
        setTestimonials(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus === 'public' ? 'Public' : 'Hidden' } : item
        ));

        if (serverTestimonials.length > 0) {
            startTransition(async () => {
                try {
                    await updateTestimonialStatus(id, newStatus);
                } catch (e) {
                    console.error(e);
                    // Revert if failed? For MVP we just alert or log
                }
            });
        }
    };

    const handleDelete = (id: string | number) => {
        setTestimonialToDelete(id);
        setDeleteDialogOpen(true);
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

            if (serverTestimonials.length > 0) {
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
            } else {
                setEditingTestimonial(null);
            }
        }
    };



    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const handleBulkStatusChange = (status: 'Public' | 'Hidden') => {
        // Optimistic
        setTestimonials(prev => prev.map(t => selectedIds.has(t.id) ? { ...t, status } : t));
        setSelectedIds(new Set()); // Clear selection after action

        if (serverTestimonials.length > 0) {
            startTransition(async () => {
                try {
                    // We need to iterate or have a bulk update API. Assuming iterative for now or a bulk wrapper.
                    // Ideally, we'd add updateTestimonialStatusBulk(ids, status) to actions.
                    // For MVP stability:
                    const ids = Array.from(selectedIds);
                    await Promise.all(ids.map(id => updateTestimonialStatus(id, status.toLowerCase())));
                } catch (e) {
                    console.error(e);
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        setTestimonialToDelete('bulk'); // Use a special flag or handle differently
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (testimonialToDelete === 'bulk') {
            // Bulk Delete
            // Optimistic
            setTestimonials(prev => prev.filter(t => !selectedIds.has(t.id)));

            if (serverTestimonials.length > 0) {
                startTransition(async () => {
                    const ids = Array.from(selectedIds);
                    try {
                        await Promise.all(ids.map(id => deleteTestimonial(id)));
                    } catch (e) {
                        alert("Failed to delete some items");
                    }
                });
            }
            setSelectedIds(new Set());
        } else if (testimonialToDelete) {
            // Single Delete
            // Optimistic
            setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete));

            if (serverTestimonials.length > 0) {
                startTransition(async () => {
                    try {
                        await deleteTestimonial(testimonialToDelete);
                    } catch (e) {
                        alert("Failed to delete");
                    }
                });
            }
        }

        setDeleteDialogOpen(false);
        setTestimonialToDelete(null);
    };

    return (
        <div className="min-h-full pb-10 relative max-w-[1600px] mx-auto">
            {/* Header Section with gradient accent */}
            <div className="relative mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Testimonials</h1>
                        <p className="text-zinc-400 text-sm">Organize the testimonials you have received or imported.</p>
                    </div>
                    <Link href="/import">
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-6 h-11 font-medium transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.02]">
                            <Upload className="size-4 mr-2" />
                            Import Testimonials
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="space-y-6">
                {/* Filters Bar */}
                <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
                        <div className="flex p-1 bg-zinc-900/70 border border-zinc-800/80 rounded-lg backdrop-blur-sm">
                            {["All", "Public", "Hidden", "Pending"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-300",
                                        activeTab === tab
                                            ? "bg-gradient-to-r from-zinc-700/90 to-zinc-800/90 text-white shadow-sm shadow-black/20"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <Button variant="outline" className="bg-zinc-900/70 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800 h-8 text-xs rounded-lg transition-all duration-200">
                            <Filter className="size-3.5 mr-1.5" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Search & Sorting Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                        <Input
                            placeholder="Search testimonials by name, email, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-900/50 border-zinc-800/80 pl-11 h-12 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-xl text-sm w-full placeholder:text-zinc-600 transition-all duration-200"
                        />
                    </div>
                    <div className="sm:w-auto flex flex-wrap items-center gap-3">
                        <CustomDateRangeDropdown dateRange={date} onChange={setDate} />
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-12 px-4 shadow-sm w-[180px] justify-start text-left font-normal bg-zinc-900/70 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300 focus:ring-0 focus:ring-offset-0 rounded-xl transition-all duration-200">
                                <ListFilter className="mr-2 h-4 w-4 opacity-70" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300 rounded-xl">
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="rating-high">Highest Rating</SelectItem>
                                <SelectItem value="rating-low">Lowest Rating</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Unified Table and Pagination Section */}
                <div className="flex flex-col">
                    <div className="z-10">
                        <TestimonialTable
                            testimonials={paginatedTestimonials}
                            selectedIds={selectedIds}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onCopy={handleCopy}
                        />
                    </div>

                    {/* Pagination Footer */}
                    <div className="bg-zinc-950/50 border border-t-0 border-zinc-800/60 rounded-b-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm -mt-[1px] relative z-0">
                        {/* Left: Showing results */}
                        <p className="text-sm text-zinc-400 pl-2">
                            Showing <span className="font-bold text-zinc-200">{paginatedTestimonials.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-zinc-200">{Math.min(endIndex, sortedAndFiltered.length)}</span> of <span className="font-bold text-zinc-200">{sortedAndFiltered.length}</span> results
                        </p>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-4">
                            {/* Rows per page */}
                            <div className="flex items-center">
                                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                                    <SelectTrigger className="h-9 w-[130px] bg-zinc-900 border-zinc-800 text-xs text-zinc-300 focus:ring-1 focus:ring-indigo-500 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span>{itemsPerPage} per page</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                        <SelectItem value="5">5 per page</SelectItem>
                                        <SelectItem value="10">10 per page</SelectItem>
                                        <SelectItem value="25">25 per page</SelectItem>
                                        <SelectItem value="50">50 per page</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Pagination Buttons */}
                            <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-800/50">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1 px-1">
                                    {pageNumbers.map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant="ghost"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={cn("h-7 min-w-[1.75rem] px-1 rounded-md text-xs font-bold transition-all",
                                                currentPage === pageNum
                                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white shadow-md shadow-indigo-900/20"
                                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                            )}
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
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
                            <Button onClick={() => router.push(`/dashboard/Edit-Testimonial/${editingTestimonial.id}`)} variant="outline" className="sm:mr-auto border-indigo-500/30 bg-indigo-500/5 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200 hover:border-indigo-500/50 transition-all">Full Edit</Button>
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



            <BulkActionsFloatingBar
                selectedCount={selectedIds.size}
                onClearSelection={() => setSelectedIds(new Set())}
                onMakePublic={() => handleBulkStatusChange('Public')}
                onMakeHidden={() => handleBulkStatusChange('Hidden')}
                onDelete={handleBulkDelete}
            />

        </div >
    );
}
