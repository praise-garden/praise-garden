import { Search } from "lucide-react";
import { TestimonialRowCard } from "./TestimonialRowCard";
import { Checkbox } from "@/components/ui/checkbox";

interface Testimonial {
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
}

interface TestimonialTableProps {
    testimonials: Testimonial[];
    onStatusChange: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    onEdit: (id: string | number) => void;
    onCopy: (text: string) => void;
    selectedIds: Set<string | number>;
    onSelect: (id: string | number) => void;
    onSelectAll: (checked: boolean) => void;
}

export function TestimonialTable({
    testimonials,
    onStatusChange,
    onDelete,
    onEdit,
    onCopy,
    selectedIds,
    onSelect,
    onSelectAll
}: TestimonialTableProps) {
    const allSelected = testimonials.length > 0 && testimonials.every(t => selectedIds.has(t.id));
    const someSelected = testimonials.some(t => selectedIds.has(t.id));
    const isIndeterminate = someSelected && !allSelected;
    return (
        <div className="bg-gradient-to-b from-zinc-950/80 to-zinc-950/50 border border-zinc-800/60 rounded-t-2xl rounded-b-none overflow-x-auto shadow-xl shadow-black/30 backdrop-blur-sm">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead className="bg-zinc-900/40 border-b border-zinc-800/60">
                    <tr className="flex items-center text-left">
                        {/* Checkbox Column Header */}
                        <th className="p-0 font-normal w-[60px]">
                            <div className="h-full flex items-center justify-center px-4 py-4">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={(checked) => onSelectAll(checked === true)}
                                />
                            </div>
                        </th>

                        {/* Reviewer Column Header */}
                        <th className="p-0 font-normal">
                            <div className="w-[220px] px-4 py-4">
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
                        <th className="block p-0 font-normal flex-1 min-w-0">
                            <div className="px-4 py-4 w-full min-w-[300px]">
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
                            <div className="flex items-center gap-2 flex-shrink-0 px-4 py-4">
                                {/* Source */}
                                <div className="w-[60px] flex justify-center block">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Source
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="w-[80px] flex justify-center">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Status
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="w-[100px] flex justify-center block">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                        Date
                                        <svg className="size-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="w-[100px] flex justify-center items-center">
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Actions
                                    </span>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-zinc-800/40">
                    {testimonials.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-zinc-500 block">
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
                                selected={selectedIds.has(t.id)}
                                onSelect={() => onSelect(t.id)}
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
