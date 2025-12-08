"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { toast, Toaster } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Form } from '@/types/form-config';

// Re-defining icons here to keep this component self-contained
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
);

const getGradientClass = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
      'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
      'bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500',
      'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
      'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500',
      'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    ];
    return gradients[index % gradients.length];
};
  
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
  
const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
};

interface FormsPageClientProps {
    initialForms: Form[];
}

export default function FormsPageClient({ initialForms }: FormsPageClientProps) {
    const router = useRouter();
    const [forms, setForms] = useState<Form[]>(initialForms);
    const [isCreating, setIsCreating] = useState(false);

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

    return (
        <main className="flex-1 p-6 lg:p-8 space-y-8">
            <Toaster position="top-center" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8 lg:p-12">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium">
                            <SparklesIcon className="size-3" />
                            <span>Forms Management</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Create Beautiful Forms</h2>
                        <p className="text-lg text-white/80 leading-relaxed">Design stunning testimonial collection forms in minutes. Customize every detail to match your brand.</p>
                    </div>
                    <Button 
                        onClick={handleCreateForm}
                        disabled={isCreating}
                        className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-900 px-6 py-6 rounded-2xl shadow-2xl shadow-purple-900/50 hover:shadow-purple-900/70 transition-all duration-300 font-semibold text-base hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-2">
                            {isCreating ? (
                                <><div className="size-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div><span>Creating...</span></>
                            ) : (
                                <><PlusIcon className="size-5" /><span>Create New Form</span></>
                            )}
                        </div>
                    </Button>
                </div>
            </div>

            {forms.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Your Forms</h3>
                            <p className="text-sm text-gray-500">Manage and edit your testimonial collection forms</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {forms.map((form, index) => (
                            <Card 
                                key={form.id}
                                className="group relative border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`h-32 ${getGradientClass(index)} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute top-4 right-4"><Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm shadow-lg text-xs font-medium px-3 py-1 rounded-full">Active</Badge></div>
                                    <div className="absolute bottom-4 left-4"><div className="size-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"><FileTextIcon className="size-5 text-white" /></div></div>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">{form.name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">Collect testimonials from your customers</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center"><UsersIcon className="size-3.5 text-gray-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Responses</p>
                                                <p className="text-sm font-semibold text-gray-900">0</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center"><ClockIcon className="size-3.5 text-gray-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Created</p>
                                                <p className="text-sm font-semibold text-gray-900">{getTimeAgo(form.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400"><CalendarIcon className="size-3.5" /><span>Created {formatDate(form.created_at)}</span></div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Link href={`/form-builder?id=${form.id}`} className="flex-1">
                                            <Button variant="default" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"><EditIcon className="mr-2" />Edit Form</Button>
                                        </Link>
                                        <Button variant="outline" className="px-3 rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"><MoreVerticalIcon /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="size-20 rounded-3xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center mb-6"><FileTextIcon className="size-10 text-purple-600" /></div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No forms yet</h3>
                    <p className="text-gray-500 text-center max-w-md mb-8">Get started by creating your first testimonial collection form. It only takes a few minutes!</p>
                    <Button 
                        onClick={handleCreateForm}
                        disabled={isCreating}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                        {isCreating ? (
                            <><div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Creating...</>
                        ) : (
                            <><PlusIcon className="mr-2" />Create Your First Form</>
                        )}
                    </Button>
                </div>
            )}
        </main>
    );
}
