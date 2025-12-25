"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { toast, Toaster } from 'sonner';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
    PlusIcon,
    MoreHorizontal,
    FileText,
    Calendar,
    Users,
    Clock,
    ArrowRight,
    Trash2,
    PenLine,
    LayoutTemplate,
    Share2,
    Check,
    Copy,
    AlertCircle
} from "lucide-react";
import type { Form } from '@/types/form-config';
import { formatDistanceToNow } from 'date-fns';

// ---------------------------------------------------------------- //
//                               Utils                              //
// ---------------------------------------------------------------- //

const getGradientClass = (id: string) => {
    // Generate a simple hash from the ID to ensure the color stays consistent
    // regardless of the form's position in the list
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const gradients = [
        'from-violet-600 via-purple-600 to-indigo-600',
        'from-blue-600 via-cyan-600 to-teal-600',
        'from-rose-600 via-pink-600 to-fuchsia-600',
        'from-emerald-600 via-green-600 to-lime-600',
        'from-orange-500 via-amber-500 to-yellow-500',
        'from-pink-600 via-red-500 to-orange-500',
    ];

    // Use absolute value to handle potential negative hash
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// ---------------------------------------------------------------- //
//                           Components                             //
// ---------------------------------------------------------------- //

function EmptyState({ onCreate, isCreating }: { onCreate: () => void, isCreating: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-inner border border-zinc-700/50 flex items-center justify-center mb-6 group">
                <FileText className="size-8 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No forms created yet</h3>
            <p className="text-zinc-400 max-w-sm mb-8 leading-relaxed">
                Start collecting testimonials by creating your first form. It's quick and easy.
            </p>
            <Button
                onClick={onCreate}
                disabled={isCreating}
                className="bg-white text-black hover:bg-zinc-200 px-6 py-6 rounded-xl font-medium shadow-xl shadow-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
                {isCreating ? (
                    <><div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>Creating...</>
                ) : (
                    <><PlusIcon className="mr-2 size-5" />Create First Form</>
                )}
            </Button>
        </div>
    );
}

function FormCard({ form, index, onRequestDelete }: { form: Form, index: number, onRequestDelete: (form: Form) => void }) {
    const gradient = getGradientClass(form.id);
    const [hasCopied, setHasCopied] = useState(false);
    const router = useRouter();

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/t/${form.id}`;
        navigator.clipboard.writeText(url);
        toast.success("Public link copied to clipboard");
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    const handleCardClick = () => {
        router.push(`/form-builder?id=${form.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex flex-col bg-zinc-950 border border-zinc-800/60 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Card Preview / Header */}
            <div className={`h-40 relative bg-gradient-to-br ${gradient} p-6 flex flex-col justify-between overflow-hidden group-hover:brightness-110 transition-all duration-500`}>
                {/* Abstract pattern overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none group-hover:bg-white/20 transition-colors duration-500"></div>

                <div className="flex justify-between items-start z-10">
                    <Badge variant="secondary" className="bg-black/30 hover:bg-black/40 backdrop-blur-md border-white/20 text-white font-medium shadow-sm">
                        Active
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm border border-white/20 focus:ring-0 focus:ring-offset-0 transition-all hover:scale-105 active:scale-95 z-20"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300 p-1.5 shadow-xl shadow-black/80 rounded-xl" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 mb-0.5" asChild>
                                <Link href={`/form-builder?id=${form.id}`} className="flex items-center w-full">
                                    <PenLine className="mr-2.5 size-4" /> Edit Form
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 mb-0.5" onClick={handleCopyLink}>
                                <Copy className="mr-2.5 size-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                            <DropdownMenuItem
                                className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer rounded-lg py-2.5 px-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRequestDelete(form);
                                }}
                            >
                                <Trash2 className="mr-2.5 size-4" /> Delete Form
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="z-10 relative">
                    <div className="size-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                        <LayoutTemplate className="size-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col gap-4 bg-zinc-950">
                <div>
                    <h3 className="font-bold text-zinc-100 text-lg mb-1 truncate group-hover:text-white transition-colors tracking-tight">
                        {form.name}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                        Collect testimonials, ratings, and feedback from your customers.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-4 border-t border-dotted border-zinc-800">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Responses</span>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Users className="size-3.5 text-zinc-500" />
                            <span className="font-semibold text-sm">0</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Created</span>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Calendar className="size-3.5 text-zinc-500" />
                            <span className="font-semibold text-sm">{formatDate(form.created_at)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-2 flex items-center gap-2">
                    <Button className="flex-1 w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl group/btn border border-zinc-200 shadow-sm transition-all h-10 hover:shadow-md pointer-events-none">
                        Open Builder
                        <ArrowRight className="ml-2 size-4 opacity-50 group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100 transition-all" />
                    </Button>

                    <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="px-0 w-12 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-zinc-400 rounded-xl h-10 transition-all hover:border-zinc-700 z-20 relative hover:scale-105 active:scale-95"
                        title="Copy Public Link"
                    >
                        {hasCopied ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------- //
//                        Main Component                            //
// ---------------------------------------------------------------- //

interface FormsPageClientProps {
    initialForms: Form[];
}

export default function FormsPageClient({ initialForms }: FormsPageClientProps) {
    const router = useRouter();
    const [forms, setForms] = useState<Form[]>(initialForms);
    const [isCreating, setIsCreating] = useState(false);

    // Deletion State
    const [formToDelete, setFormToDelete] = useState<Form | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreateForm = async () => {
        setIsCreating(true);
        try {
            const response = await fetch('/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Untitled Form' }),
            });

            if (!response.ok) throw new Error('Failed to create form');

            const newForm = await response.json();
            toast.success('Form created successfully!');
            router.push(`/form-builder?id=${newForm.id}`);
        } catch (error) {
            console.error('Error creating form:', error);
            toast.error('Failed to create form');
            setIsCreating(false);
        }
    };

    const confirmDelete = async () => {
        if (!formToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/forms/${formToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete form');

            setForms(forms.filter(f => f.id !== formToDelete.id));
            toast.success('Form deleted successfully');
        } catch (error) {
            console.error('Error deleting form:', error);
            toast.error('Failed to delete form');
        } finally {
            setIsDeleting(false);
            setFormToDelete(null);
        }
    };

    return (
        <main className="flex-1 w-full min-h-screen bg-black text-zinc-100 selection:bg-purple-500/30">
            <Toaster position="top-center" theme="dark" />

            <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-0.5 text-xs font-medium text-zinc-400 backdrop-blur-sm">
                                Forms & Collection
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white font-heading">
                            Your Forms
                        </h1>
                        <p className="text-zinc-400 text-base max-w-xl leading-relaxed mt-2">
                            Manage your testimonial forms, customize their look, and share them with your customers to start collecting feedback.
                        </p>
                    </div>

                    {forms.length > 0 && (
                        <Button
                            onClick={handleCreateForm}
                            disabled={isCreating}
                            size="lg"
                            className="bg-white text-black hover:bg-zinc-200 rounded-xl font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-12 px-6"
                        >
                            {isCreating ? (
                                <><div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>Creating...</>
                            ) : (
                                <><PlusIcon className="mr-2 size-5" />New Form</>
                            )}
                        </Button>
                    )}
                </div>

                {/* Content Section */}
                {forms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {forms.map((form, index) => (
                            <FormCard
                                key={form.id}
                                form={form}
                                index={index}
                                onRequestDelete={setFormToDelete}
                            />
                        ))}

                        {/* Quick Add Card */}
                        <button
                            onClick={handleCreateForm}
                            disabled={isCreating}
                            className="group flex flex-col items-center justify-center p-8 bg-zinc-900/20 border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 rounded-2xl transition-all duration-300 h-full min-h-[340px]"
                        >
                            <div className="size-16 rounded-full bg-zinc-900 group-hover:bg-zinc-800 group-hover:scale-110 flex items-center justify-center mb-5 transition-all duration-300 border border-zinc-800 group-hover:border-zinc-600 shadow-xl">
                                <PlusIcon className="size-7 text-zinc-500 group-hover:text-zinc-200" />
                            </div>
                            <span className="font-semibold text-lg text-zinc-300 group-hover:text-white transition-colors">Create New Form</span>
                            <span className="text-sm text-zinc-500 mt-1 max-w-[200px] text-center">Start fresh with a new testimonial collection form</span>
                        </button>
                    </div>
                ) : (
                    <EmptyState onCreate={handleCreateForm} isCreating={isCreating} />
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!formToDelete} onOpenChange={(open) => !open && setFormToDelete(null)}>
                <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden gap-0">
                    <DialogHeader className="p-6 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                                <AlertCircle className="size-6 text-red-500" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-lg font-semibold">Delete "{formToDelete?.name}"?</DialogTitle>
                                <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                                    Are you sure you want to delete this form? This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 py-4 bg-zinc-900/50 border-y border-zinc-800">
                        <div className="flex items-start gap-3">
                            <Check className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-zinc-300">
                                <span className="font-medium text-zinc-100">Safe to delete:</span> Responses collected from this form will <span className="underline decoration-emerald-500/50 underline-offset-2">NOT</span> be deleted. They are stored separately.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-zinc-950 flex flex-row gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setFormToDelete(null)}
                            className="rounded-xl border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                        >
                            {isDeleting ? "Deleting..." : "Delete Form"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
