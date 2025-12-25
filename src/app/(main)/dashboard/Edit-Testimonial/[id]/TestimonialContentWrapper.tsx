"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    Lock,
    Facebook,
    Twitter,
    Linkedin,
    ChevronLeft,
    Download,
    Pencil,
    Check,
    X
} from "lucide-react";

import { useRouter } from "next/navigation";
import { EditVideoTestimonialForm } from "./EditVideoTestimonialForm";
import { EditTextTestimonialForm } from "./EditTextTestimonialForm";
import { updateTestimonialContent } from "@/lib/actions/testimonials";
import { TestimonialToolbar } from "@/components/dashboard/TestimonialToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { VideoTestimonialComponent, TextTestimonialComponent } from "../../TestimonialComponents";

interface TestimonialContentWrapperProps {
    testimonial: any;
    relatedTestimonials?: any[];
}

export function TestimonialContentWrapper({ testimonial, relatedTestimonials: initialRelatedTestimonials = [] }: TestimonialContentWrapperProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isTrimOpen, setIsTrimOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'testimonials' | 'invites' | 'feedback' | 'user-details'>('testimonials');

    // Track which related testimonial is being edited (by ID)
    const [editingRelatedId, setEditingRelatedId] = useState<string | number | null>(null);

    // Local state for related testimonials (to avoid refetching on duplicate)
    const [relatedTestimonials, setRelatedTestimonials] = useState<any[]>(initialRelatedTestimonials);

    // Callback to add a new duplicate to local state
    const handleAddDuplicate = (newTestimonial: any) => {
        setRelatedTestimonials(prev => [...prev, newTestimonial]);
    };

    // Callback to remove a testimonial from local state
    const handleRemoveTestimonial = (id: string | number) => {
        setRelatedTestimonials(prev => prev.filter(t => t.id !== id));
    };

    // User Details Edit State
    const [isEditingUserDetails, setIsEditingUserDetails] = useState(false);
    const [editName, setEditName] = useState(testimonial.reviewer || "");
    const [editEmail, setEditEmail] = useState(testimonial.email || "");
    const [editHeadline, setEditHeadline] = useState(testimonial.profession || "");
    const [editCompanyName, setEditCompanyName] = useState(testimonial.raw?.data?.company?.name || "");
    const [editCompanyWebsite, setEditCompanyWebsite] = useState(testimonial.raw?.data?.company?.website || "");
    const [isSavingUserDetails, setIsSavingUserDetails] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    const isVideo = testimonial.type === 'video' || testimonial.attachments?.some((a: any) => a.type === 'video');
    const videoUrl = testimonial.attachments?.find((a: any) => a.type === 'video')?.url;
    const companyLogo = testimonial.attachments?.find((a: any) => a.type === 'image')?.url;

    // Handle Save User Details
    const handleSaveUserDetails = async () => {
        setIsSavingUserDetails(true);
        setEmailError(null); // Clear previous error

        try {
            const result = await updateTestimonialContent(testimonial.id, {
                customer_name: editName,
                customer_email: editEmail,
                customer_headline: editHeadline,
                company: {
                    ...testimonial.raw?.data?.company,
                    name: editCompanyName,
                    website: editCompanyWebsite
                }
            });

            if (result && !result.success && result.error) {
                // Check if it's an email error
                if (result.error.toLowerCase().includes('email')) {
                    setEmailError(result.error);
                    emailInputRef.current?.focus();
                } else {
                    toast.error(result.error);
                }
                return;
            }

            toast.success("User details updated!");
            setIsEditingUserDetails(false);
            router.refresh();
        } catch (err: any) {
            toast.error("Failed to save: " + (err.message || "Unknown error"));
        } finally {
            setIsSavingUserDetails(false);
        }
    };

    const handleCancelUserDetailsEdit = () => {
        // Reset to original values
        setEditName(testimonial.reviewer || "");
        setEditEmail(testimonial.email || "");
        setEditHeadline(testimonial.profession || "");
        setEditCompanyName(testimonial.raw?.data?.company?.name || "");
        setEditCompanyWebsite(testimonial.raw?.data?.company?.website || "");
        setEmailError(null);
        setIsEditingUserDetails(false);
    };

    const handleSaveTrim = async (start: number, end: number) => {
        setIsTrimOpen(false); // Close first for visual feedback
        toast.loading("Saving trim...");
        try {
            await updateTestimonialContent(testimonial.id, {
                trim_start: start,
                trim_end: end
            });
            toast.dismiss();
            toast.success("Trim saved successfully!");
            router.refresh();
        } catch (err: any) {
            toast.dismiss();
            toast.error("Failed to save trim: " + err.message);
        }
    };

    return (
        <div className="relative h-screen flex flex-col bg-[#09090b] text-zinc-50 font-sans overflow-hidden">
            {/* Top Bar / Header */}
            <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4 flex flex-col gap-6 bg-[#09090b]">
                {/* User Info Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
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
                        { id: 'testimonials', label: 'Testimonials', count: 1 + relatedTestimonials.length },
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
            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                {activeTab === 'testimonials' && (
                    <>
                        {/* Main Testimonial Card */}
                        <div className="max-w-[1400px] mx-auto bg-[#18181b] border border-zinc-800/50 shadow-xl rounded-xl overflow-hidden text-zinc-50">
                            {/* Card Header - Always visible */}
                            <div className="p-6 pb-4 flex items-start justify-between border-b border-zinc-800/30">
                                <div className="flex items-center gap-3">
                                    {!isEditing && (
                                        <div className="flex gap-1 text-amber-500">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`size-5 ${i < testimonial.rating ? "fill-current" : "text-zinc-700 fill-zinc-700"}`} />
                                            ))}
                                        </div>
                                    )}
                                    {isVideo ? (
                                        <Badge className="bg-[#2E2335] text-[#D8B4FE] hover:bg-[#3E2F46] border border-purple-500/10 font-medium px-2.5 py-0.5 rounded-full">
                                            Video
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-[#1E293B] text-[#93C5FD] hover:bg-[#1E3A5F] border border-blue-500/10 font-medium px-2.5 py-0.5 rounded-full">
                                            Text
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-zinc-500 text-sm">Collected {testimonial.date}</span>
                            </div>

                            {/* Card Content: Display or Edit Form */}
                            <div className="px-6 py-6">
                                {isEditing ? (
                                    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
                                        {isVideo ? (
                                            <EditVideoTestimonialForm
                                                testimonial={testimonial}
                                                onClose={() => setIsEditing(false)}
                                                isEmbedded={true}
                                            />
                                        ) : (
                                            <EditTextTestimonialForm
                                                testimonial={testimonial}
                                                onClose={() => setIsEditing(false)}
                                                isEmbedded={true}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    isVideo ? (
                                        <VideoTestimonialComponent
                                            testimonial={testimonial}
                                            videoUrl={videoUrl}
                                            isTrimOpen={isTrimOpen}
                                            setIsTrimOpen={setIsTrimOpen}
                                            handleSaveTrim={handleSaveTrim}
                                            attachments={testimonial.attachments}
                                        />
                                    ) : (
                                        <TextTestimonialComponent
                                            testimonial={testimonial}
                                            attachments={testimonial.attachments}
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        {/* Toolbar - Only visible when NOT editing */}
                        {!isEditing && (
                            <div className="max-w-[1400px] mx-auto mt-0 bg-[#18181b] border border-t-0 border-zinc-800/50 rounded-b-xl overflow-hidden mb-8">
                                <TestimonialToolbar
                                    testimonialId={testimonial.id}
                                    isVideo={isVideo}
                                    onEdit={() => setIsEditing(true)}
                                    onTrim={() => setIsTrimOpen(true)}
                                    onDuplicate={handleAddDuplicate}
                                />
                            </div>
                        )}

                        {/* Related Testimonials from Same User */}
                        {relatedTestimonials.length > 0 && (
                            <div className="max-w-[1400px] mx-auto mt-8">
                                <div className="space-y-8">
                                    {relatedTestimonials.map((related) => {
                                        const relatedIsVideo = related.type === 'video' || related.attachments?.some((a: any) => a.type === 'video');
                                        const relatedVideoUrl = related.attachments?.find((a: any) => a.type === 'video')?.url;
                                        const isRelatedEditing = related.id === editingRelatedId;

                                        return (
                                            <div key={related.id} className="bg-[#18181b] border border-zinc-800/50 rounded-xl overflow-hidden">
                                                {/* Related Card Header */}
                                                <div className="p-4 pb-3 flex items-start justify-between border-b border-zinc-800/30">
                                                    <Link href={`/dashboard/Edit-Testimonial/${related.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                        {!isRelatedEditing && (
                                                            <div className="flex gap-1 text-amber-500">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star key={i} className={`size-4 ${i < related.rating ? "fill-current" : "text-zinc-700 fill-zinc-700"}`} />
                                                                ))}
                                                            </div>
                                                        )}
                                                        {relatedIsVideo ? (
                                                            <Badge className="bg-[#2E2335] text-[#D8B4FE] border border-purple-500/10 font-medium px-2 py-0.5 rounded-full text-xs">
                                                                Video
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-[#1E293B] text-[#93C5FD] border border-blue-500/10 font-medium px-2 py-0.5 rounded-full text-xs">
                                                                Text
                                                            </Badge>
                                                        )}
                                                    </Link>
                                                    <span className="text-zinc-500 text-xs">Collected {related.date}</span>
                                                </div>

                                                {/* Related Content: Display or Edit Form */}
                                                <div className="px-4 py-4">
                                                    {isRelatedEditing ? (
                                                        <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
                                                            {relatedIsVideo ? (
                                                                <EditVideoTestimonialForm
                                                                    testimonial={related}
                                                                    onClose={() => setEditingRelatedId(null)}
                                                                    isEmbedded={true}
                                                                />
                                                            ) : (
                                                                <EditTextTestimonialForm
                                                                    testimonial={related}
                                                                    onClose={() => setEditingRelatedId(null)}
                                                                    isEmbedded={true}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        relatedIsVideo ? (
                                                            <VideoTestimonialComponent
                                                                testimonial={related}
                                                                videoUrl={relatedVideoUrl}
                                                                isTrimOpen={false}
                                                                setIsTrimOpen={() => { }}
                                                                handleSaveTrim={async () => { }}
                                                                attachments={related.attachments}
                                                            />
                                                        ) : (
                                                            <TextTestimonialComponent
                                                                testimonial={related}
                                                                attachments={related.attachments}
                                                            />
                                                        )
                                                    )}
                                                </div>

                                                {/* Related Toolbar - Only if NOT editing */}
                                                {!isRelatedEditing && (
                                                    <TestimonialToolbar
                                                        testimonialId={related.id}
                                                        isVideo={relatedIsVideo}
                                                        onEdit={() => setEditingRelatedId(related.id)}
                                                        onDuplicate={handleAddDuplicate}
                                                        onDelete={handleRemoveTestimonial}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'user-details' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">User Information</h3>
                                {!isEditingUserDetails ? (
                                    <button
                                        onClick={() => setIsEditingUserDetails(true)}
                                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                        title="Edit user details"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCancelUserDetailsEdit}
                                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                            title="Cancel"
                                        >
                                            <X className="size-4" />
                                        </button>
                                        <button
                                            onClick={handleSaveUserDetails}
                                            disabled={isSavingUserDetails}
                                            className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors disabled:opacity-50"
                                            title="Save changes"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

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
                                    {isEditingUserDetails ? (
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="bg-zinc-900 border-zinc-700 text-zinc-200"
                                            placeholder="Enter full name"
                                        />
                                    ) : (
                                        <div className="text-zinc-200 font-medium">{testimonial.reviewer}</div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Email</label>
                                    {isEditingUserDetails ? (
                                        <div className="space-y-1">
                                            <Input
                                                ref={emailInputRef}
                                                value={editEmail}
                                                onChange={(e) => {
                                                    setEditEmail(e.target.value);
                                                    if (emailError) setEmailError(null); // Clear error on change
                                                }}
                                                className={cn(
                                                    "bg-zinc-900 border-zinc-700 text-zinc-200",
                                                    emailError && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                )}
                                                placeholder="Enter email"
                                                type="email"
                                            />
                                            {emailError && (
                                                <p className="text-xs text-red-400 flex items-center gap-1">
                                                    <span className="inline-block size-1 rounded-full bg-red-400"></span>
                                                    {emailError}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-zinc-200">{testimonial.email || "N/A"}</div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Headline / Job Title</label>
                                    {isEditingUserDetails ? (
                                        <Input
                                            value={editHeadline}
                                            onChange={(e) => setEditHeadline(e.target.value)}
                                            className="bg-zinc-900 border-zinc-700 text-zinc-200"
                                            placeholder="Enter headline or job title"
                                        />
                                    ) : (
                                        <div className="text-zinc-200">{testimonial.profession || "N/A"}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Company Information</h3>
                                {!isEditingUserDetails && (
                                    <button
                                        onClick={() => setIsEditingUserDetails(true)}
                                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                        title="Edit company details"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                )}
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Company Name</label>
                                    {isEditingUserDetails ? (
                                        <Input
                                            value={editCompanyName}
                                            onChange={(e) => setEditCompanyName(e.target.value)}
                                            className="bg-zinc-900 border-zinc-700 text-zinc-200"
                                            placeholder="Enter company name"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {companyLogo && (
                                                <div className="size-6 rounded bg-zinc-800 overflow-hidden flex items-center justify-center">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="text-zinc-200">{testimonial.raw?.data?.company?.name || "N/A"}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-500">Website</label>
                                    {isEditingUserDetails ? (
                                        <Input
                                            value={editCompanyWebsite}
                                            onChange={(e) => setEditCompanyWebsite(e.target.value)}
                                            className="bg-zinc-900 border-zinc-700 text-zinc-200"
                                            placeholder="https://example.com"
                                            type="url"
                                        />
                                    ) : (
                                        <a href={testimonial.raw?.data?.company?.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline block truncate transition-colors">
                                            {testimonial.raw?.data?.company?.website || "N/A"}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
}
