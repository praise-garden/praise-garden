import { getTestimonialById } from "@/lib/data/testimonials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    Video as VideoIcon,
    Facebook,
    Twitter,
    Linkedin,
    ChevronLeft,
    Lock,
    Download
} from "lucide-react";
import { TestimonialToolbar } from "@/components/dashboard/TestimonialToolbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TranscriptEditor } from "./TranscriptEditor";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonialById(params.id);

    if (!testimonial) {
        notFound();
    }

    const isVideo = testimonial.type === 'video' || testimonial.attachments.some(a => a.type === 'video');
    const videoUrl = testimonial.attachments.find(a => a.type === 'video')?.url;

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
                            <AvatarImage src="" /> {/* Placeholder for user avatar if available */}
                            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-lg">
                                {testimonial.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-white">{testimonial.reviewer}</h1>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-500">
                                <span>Role: Customers</span>
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
                    <button className="text-zinc-500 hover:text-zinc-300 pb-3 border-b-2 border-transparent hover:border-zinc-700 transition-all whitespace-nowrap">All</button>
                    <button className="text-white pb-3 border-b-2 border-white transition-all whitespace-nowrap">Testimonials ({1})</button>
                    <button className="text-zinc-500 hover:text-zinc-300 pb-3 border-b-2 border-transparent hover:border-zinc-700 transition-all whitespace-nowrap">Invites</button>
                    <button className="text-zinc-500 hover:text-zinc-300 pb-3 border-b-2 border-transparent hover:border-zinc-700 transition-all whitespace-nowrap">Feedback</button>
                    <button className="text-zinc-500 hover:text-zinc-300 pb-3 border-b-2 border-transparent hover:border-zinc-700 transition-all whitespace-nowrap">User Details</button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
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

                    {/* Card Content (Video + Transcript) */}
                    <div className="px-6 py-6 flex flex-col md:flex-row gap-8">
                        {/* Video Player */}
                        {isVideo && videoUrl ? (
                            <div className="w-full md:w-[50%] rounded-lg overflow-hidden bg-black aspect-video relative group shadow-lg ring-1 ring-zinc-800">
                                <video src={videoUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" controls playsInline />
                            </div>
                        ) : (
                            <div className="w-full md:w-[50%] aspect-video bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                                No Video Content
                            </div>
                        )}

                        {/* Text / Transcript */}
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

                    {/* Card Footer Toolbar - Interactive */}
                    <TestimonialToolbar testimonialId={testimonial.id} isVideo={isVideo} />

                </div>
            </div>
        </div>
    );
}
