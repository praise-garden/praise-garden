"use client";

import { Search } from "lucide-react";
import { TestimonialRowCard } from "./TestimonialRowCard";

interface Testimonial {
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

interface TestimonialTableProps {
    testimonials: Testimonial[];
    onStatusChange: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    onEdit: (id: string | number) => void;
    onCopy: (text: string) => void;
}

export function TestimonialTable({
    testimonials,
    onStatusChange,
    onDelete,
    onEdit,
    onCopy
}: TestimonialTableProps) {
    return (
        <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-2xl overflow-x-auto shadow-xl shadow-black/20">
            <table className="w-full min-w-max border-collapse">
                {/* Table Header */}
                <thead className="bg-zinc-900/40 border-b border-zinc-800/60">
                    <tr className="flex items-center text-left">
                        {/* Reviewer Column Header */}
                        <th className="p-0 font-normal">
                            <div className="w-[14vw] min-w-[220px] max-w-[20vw] px-6 py-4">
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Reviewer
                                </span>
                            </div>
                        </th>

                        {/* Vertical Divider */}
                        <th className="p-0 font-normal">
                            <div className="w-px h-5 bg-zinc-800/50 block" />
                        </th>

                        {/* Testimonial Column Header */}
                        <th className="block p-0 font-normal">
                            <div className="px-6 py-4 w-[40vw] min-w-[300px]">
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Testimonial
                                </span>
                            </div>
                        </th>

                        {/* Vertical Divider */}
                        <th className="p-0 font-normal">
                            <div className="w-px h-5 bg-zinc-800/50 block" />
                        </th>

                        {/* Meta Columns Header */}
                        <th className="p-0 font-normal">
                            <div className="flex items-center gap-4 flex-shrink-0 px-6 py-4">
                                {/* Source */}
                                <div className="w-[7vw] max-w-[100px] flex justify-center block">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Source
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="w-[7vw] min-w-[80px] max-w-[100px] flex justify-center">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Status
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="w-[9vw] min-w-[90px] max-w-[120px] flex justify-center block">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                        Date
                                        <svg className="size-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="w-[9vw] min-w-[100px] max-w-[120px] flex justify-center">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Actions
                                    </span>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-zinc-800/40 block">
                    {testimonials.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-zinc-500 block">
                                <div className="size-14 rounded-full bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                                    <Search className="size-6 text-zinc-600" />
                                </div>
                                <h3 className="text-zinc-300 font-semibold text-base mb-1">
                                    No testimonials found
                                </h3>
                                <p className="text-zinc-500 text-sm">
                                    Try adjusting your filters or search query.
                                </p>
                            </td>
                        </tr>
                    ) : (
                        testimonials.map((t) => (
                            <TestimonialRowCard
                                key={t.id}
                                testimonial={t}
                                onStatusChange={onStatusChange}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                onCopy={onCopy}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
