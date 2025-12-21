"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    Lock,
    Facebook,
    Twitter,
    Linkedin,
    ChevronLeft,
    Download
} from "lucide-react";
import { TranscriptEditor } from "./TranscriptEditor";
import { EditVideoTestimonialForm } from "./EditVideoTestimonialForm";
import { TestimonialToolbar } from "@/components/dashboard/TestimonialToolbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TestimonialContentWrapperProps {
    testimonial: any;
}

export function TestimonialContentWrapper({ testimonial }: TestimonialContentWrapperProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'testimonials' | 'invites' | 'feedback' | 'user-details'>('testimonials');

    const isVideo = testimonial.type === 'video' || testimonial.attachments?.some((a: any) => a.type === 'video');
    const videoUrl = testimonial.attachments?.find((a: any) => a.type === 'video')?.url;
    const companyLogo = testimonial.attachments?.find((a: any) => a.type === 'image')?.url;

    if (isEditing) {
        return (
            <div className="h-screen flex flex-col bg-[#09090b] text-zinc-50 font-sans">
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-[1400px] mx-auto h-full">
                        <EditVideoTestimonialForm
                            testimonial={testimonial}
                            onClose={() => setIsEditing(false)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#09090b] text-zinc-50 font-sans overflow-hidden">
            {/* Top Bar / Header */}
            <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4 flex flex-col gap-6 bg-[#09090b]">
                {/* User Info Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                            <ChevronLeft className="size-6" />
                        </Link>
                        <Avatar className="size-12 bg-zinc-800 ring-2 ring-zinc-800/50">
                            <AvatarImage src={testimonial.avatar} />
                            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-lg">
                                {testimonial.avatar ? null : testimonial.reviewer.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-white">{testimonial.reviewer}</h1>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-500">
                                <span>Role: {testimonial.profession || "Customer"}</span>
                                <div className="flex items-center gap-2">
                                    <Facebook className="size-3 fill-current opacity-60 hover:opacity-100 cursor-pointer" />
                                    <Twitter className="size-3 fill-current opacity-60 hover:opacity-100 cursor-pointer" />
                                    <Linkedin className="size-3 fill-current opacity-60 hover:opacity-100 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white h-9 gap-2 transition-all">
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                            Invite to Form
                        </Button>
                        <Button variant="outline" className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white h-9 gap-2 transition-all">
                            <Download className="size-4" />
                            Import
                        </Button>
                    </div>
                </div>

                {/* Tabs Row */}
                <div className="flex items-center gap-6 text-sm font-medium pt-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'testimonials', label: 'Testimonials', count: 1 },
                        { id: 'invites', label: 'Invites' },
                        { id: 'feedback', label: 'Feedback' },
                        { id: 'user-details', label: 'User Details' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "pb-3 border-b-2 transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "text-white border-white"
                                    : "text-zinc-500 hover:text-zinc-300 border-transparent hover:border-zinc-700"
                            )}
                        >
                            {tab.label} {tab.count ? `(${tab.count})` : ''}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {activeTab === 'testimonials' && (
                    <div className="max-w-[1400px] mx-auto bg-[#18181b] border border-zinc-800/50 shadow-xl rounded-xl overflow-hidden text-zinc-50">
                        {/* Card Header */}
                        <div className="p-6 pb-4 flex items-start justify-between border-b border-zinc-800/30">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`size-5 ${i < testimonial.rating ? "fill-current" : "text-zinc-700 fill-zinc-700"}`} />
                                    ))}
                                </div>
                                {isVideo && (
                                    <Badge className="bg-[#2E2335] text-[#D8B4FE] hover:bg-[#3E2F46] border border-purple-500/10 font-medium px-2.5 py-0.5 rounded-full flex gap-1 items-center transition-colors">
                                        Video Testimonial
                                    </Badge>
                                )}
                            </div>
                            <span className="text-zinc-500 text-sm">Collected {testimonial.date}</span>
                        </div>

                        {/* Card Content */}
                        <div className="px-6 py-6 flex flex-col md:flex-row gap-8">
                            {/* Video Player */}
                            {isVideo && videoUrl ? (
                                <div className="w-full md:w-[50%] rounded-lg overflow-hidden bg-black aspect-video relative group shadow-lg ring-1 ring-zinc-800">
                                    <video src={videoUrl} poster={testimonial.videoThumbnail} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" controls playsInline />
                                </div>
                            ) : (
                                <div className="w-full md:w-[50%] aspect-video bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                                    No Video Content
                                </div>
                            )}

                            {/* Transcript */}
                            <div className="flex-1 space-y-3">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">TRANSCRIPT</h4>
                                <TranscriptEditor
                                    initialText={testimonial.text}
                                    testimonialId={testimonial.id}
                                />
                            </div>
                        </div>

                        {/* Warning Banner */}
                        <div className="mx-6 mb-6 bg-[#382306]/80 border border-amber-900/30 text-amber-500 rounded-lg px-4 py-3 flex items-center gap-3">
                            <Lock className="size-4 shrink-0" />
                            <span className="font-medium text-sm">User did not consent to public sharing</span>
                        </div>

                        {/* Toolbar */}
                        <TestimonialToolbar
                            testimonialId={testimonial.id}
                            isVideo={isVideo}
                            onEdit={() => setIsEditing(true)}
                        />
                    </div>
                )}

                {activeTab === 'user-details' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 space-y-6">
                            <h3 className="text-lg font-medium text-white">User Information</h3>

                            <div className="flex items-center gap-6 pb-2">
                                <Avatar className="size-20 bg-zinc-800 ring-2 ring-zinc-700">
                                    <AvatarImage src={testimonial.avatar} />
                                    <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-2xl">
                                        {testimonial.avatar ? null : testimonial.reviewer.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-sm font-medium text-zinc-500 mb-1">Profile Picture</div>
                                    <div className="text-xs text-zinc-600">This image will be displayed with the testimonial.</div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 border-t border-zinc-800/50 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Full Name</label>
                                    <div className="text-zinc-200 font-medium">{testimonial.reviewer}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Email</label>
                                    <div className="text-zinc-200">{testimonial.email || "N/A"}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Headline / Job Title</label>
                                    <div className="text-zinc-200">{testimonial.profession || "N/A"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 space-y-6">
                            <h3 className="text-lg font-medium text-white">Company Information</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Company Name</label>
                                    <div className="flex items-center gap-2">
                                        {companyLogo && (
                                            <div className="size-6 rounded bg-zinc-800 overflow-hidden flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="text-zinc-200">{testimonial.raw.data.company?.name || "N/A"}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Website</label>
                                    <a href={testimonial.raw.data.company?.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline block truncate transition-colors">
                                        {testimonial.raw.data.company?.website || "N/A"}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
