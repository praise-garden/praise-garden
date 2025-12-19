"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, Mail, Trash2, Video, MessageSquare, Twitter, Linkedin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialRowCardProps {
    testimonial: {
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
    };
    onStatusChange: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    onEdit: (id: string | number) => void;
    onCopy: (text: string) => void;
}

const getSourceName = (source: string): string => {
    const s = source.toLowerCase();
    if (s.includes("twitter") || s.includes("x")) return "Twitter";
    if (s.includes("linkedin")) return "LinkedIn";
    if (s.includes("video")) return "Video";
    if (s.includes("email")) return "Email";
    if (s.includes("manual")) return "Manual";
    if (s.includes("facebook")) return "Facebook";
    if (s.includes("google")) return "Google";
    if (s.includes("airbnb")) return "Airbnb";
    if (s.includes("amazon")) return "Amazon";
    if (s.includes("app-store") || s.includes("appstore")) return "App Store";
    if (s.includes("chrome")) return "Chrome Web Store";
    if (s.includes("google-play") || s.includes("playstore")) return "Google Play";
    // Return capitalized version if no match
    return source.charAt(0).toUpperCase() + source.slice(1);
};

const SourceIcon = ({ source }: { source: string }) => {
    const s = source.toLowerCase();
    if (s.includes("twitter") || s.includes("x")) return <Twitter className="size-4" />;
    if (s.includes("linkedin")) return <Linkedin className="size-4" />;
    if (s.includes("video")) return <Video className="size-4" />;
    if (s.includes("email")) return <Mail className="size-4" />;
    return <MessageSquare className="size-4" />;
};

const getSourceStyles = (source: string): string => {
    const s = source.toLowerCase();
    if (s.includes("twitter") || s.includes("x")) return "bg-sky-500/10 border-sky-500/20 text-sky-500 hover:bg-sky-500/20 hover:border-sky-500/30";
    if (s.includes("linkedin")) return "bg-blue-600/10 border-blue-600/20 text-blue-500 hover:bg-blue-600/20 hover:border-blue-600/30";
    if (s.includes("video")) return "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30";
    if (s.includes("email")) return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/30";
    return "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700";
};

const StatusBadge = ({ status }: { status: string }) => {
    const s = status.toLowerCase();

    if (s === 'pending') {
        return (
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium shadow-[0_0_10px_-3px_rgba(249,115,22,0.3)]">
                Pending
            </span>
        );
    }
    if (s === 'public' || s === 'approved') {
        return (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium shadow-[0_0_10px_-3px_rgba(74,222,128,0.3)]">
                Public
            </span>
        );
    }
    if (s === 'hidden' || s === 'rejected') {
        return (
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium">
                Hidden
            </span>
        );
    }
    return (
        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium">
            {status}
        </span>
    );
};

export function TestimonialRowCard({ testimonial, onStatusChange, onDelete, onEdit, onCopy }: TestimonialRowCardProps) {
    return (
        <tr className="group flex items-center bg-zinc-950/30 hover:bg-zinc-900/40 border-b border-zinc-800/50 last:border-0 transition-all duration-200">
            {/* Reviewer Info */}
            <td className="p-0">
                <div className="flex items-start gap-5 w-[14vw] min-w-[220px] max-w-[20vw] px-6 py-4">
                    <Avatar className="size-14 rounded-full ring-2 ring-zinc-800/50 group-hover:ring-zinc-700/70 transition-all">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-lg">
                            {testimonial.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <h3 className="font-bold text-zinc-100 text-sm leading-tight truncate">{testimonial.reviewer}</h3>
                        <p className="text-xs text-zinc-500 leading-tight truncate">{testimonial.email}</p>
                        <p className="text-xs text-zinc-400 font-medium leading-tight truncate">{testimonial.profession}</p>

                        <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "size-3.5 flex-shrink-0",
                                        i < testimonial.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-800 text-zinc-800"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </td>

            {/* Vertical Divider */}
            <td className="p-0">
                <div className="w-px h-14 bg-zinc-800/50 block" />
            </td>

            {/* Content Section */}
            <td className="block p-0">
                <div className="px-6 py-4 w-[40vw] min-w-[300px]">
                    <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 w-full break-words">
                        {testimonial.text}
                    </p>
                </div>
            </td>

            {/* Vertical Divider */}
            <td className="p-0">
                <div className="w-px h-14 bg-zinc-800/50 block" />
            </td>

            {/* Meta Section */}
            <td className="p-0">
                <div className="flex items-center gap-4 flex-shrink-0 px-6 py-4">
                    {/* Source */}
                    <div className="flex items-center justify-center w-[7vw] max-w-[100px] block">
                        <div className="relative group/tooltip">
                            <div className={cn(
                                "size-8 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-default",
                                getSourceStyles(testimonial.source)
                            )}>
                                <SourceIcon source={testimonial.source} />
                            </div>
                            <div className="absolute bottom-full right-[-50%] translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-zinc-900 border border-zinc-800 rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {getSourceName(testimonial.source)}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="w-[7vw] min-w-[80px] max-w-[100px] flex justify-center cursor-pointer" onClick={() => onStatusChange(testimonial.id)}>
                        <StatusBadge status={testimonial.status} />
                    </div>

                    {/* Date */}
                    <span className="text-xs text-zinc-500 font-mono w-[9vw] min-w-[90px] max-w-[120px] flex justify-center block">
                        {testimonial.date}
                    </span>

                    {/* Actions */}
                    <div className="w-[9vw] min-w-[100px] max-w-[120px] flex items-center justify-center gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onCopy(testimonial.text)}
                            className="size-9 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                        >
                            <Copy className="size-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(testimonial.id)}
                            className="size-9 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                            <Edit2 className="size-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(testimonial.id)}
                            className="size-9 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
