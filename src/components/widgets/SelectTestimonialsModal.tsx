"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { X, Search, Check, Star } from "lucide-react"

// ===================== TESTIMONIAL TYPE ===================== //
export interface Testimonial {
    id: string;
    authorName: string;
    authorTitle: string;
    authorAvatarUrl?: string;
    rating: number;
    content: string;
    source: string;
    date: string;
}

// ===================== COMPONENT PROPS ===================== //
export interface SelectTestimonialsModalProps {
    isOpen: boolean
    onClose: () => void
    testimonials: Testimonial[]
    selectedIds: string[]
    onSelectionChange: (ids: string[]) => void
}

// ===================== SELECT TESTIMONIALS MODAL ===================== //
export function SelectTestimonialsModal({
    isOpen,
    onClose,
    testimonials,
    selectedIds,
    onSelectionChange
}: SelectTestimonialsModalProps) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [activeFilter, setActiveFilter] = React.useState<"all" | "5-stars" | "twitter">("all")
    const [localSelectedIds, setLocalSelectedIds] = React.useState<string[]>(selectedIds)

    // Reset local state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setLocalSelectedIds(selectedIds)
            setSearchQuery("")
            setActiveFilter("all")
        }
    }, [isOpen, selectedIds])

    // Filter testimonials based on search and filter
    const filteredTestimonials = React.useMemo(() => {
        return testimonials.filter(t => {
            // Search filter
            const matchesSearch = searchQuery === "" ||
                t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.content.toLowerCase().includes(searchQuery.toLowerCase())

            // Category filter
            let matchesFilter = true
            if (activeFilter === "5-stars") {
                matchesFilter = t.rating === 5
            } else if (activeFilter === "twitter") {
                matchesFilter = t.source.toUpperCase() === "TWITTER"
            }

            return matchesSearch && matchesFilter
        })
    }, [testimonials, searchQuery, activeFilter])

    const toggleSelection = (id: string) => {
        setLocalSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        )
    }

    const handleSave = () => {
        onSelectionChange(localSelectedIds)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1a1a1f] rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[80vh] flex flex-col border border-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold text-white">Select Testimonials</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="p-4 border-b border-zinc-800 space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            type="text"
                            placeholder="Search by name or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={cn(
                                "px-4 py-1.5 text-xs font-medium rounded-full border transition-all",
                                activeFilter === "all"
                                    ? "bg-white text-black border-white"
                                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveFilter("5-stars")}
                            className={cn(
                                "px-4 py-1.5 text-xs font-medium rounded-full border transition-all",
                                activeFilter === "5-stars"
                                    ? "bg-white text-black border-white"
                                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            5 Stars
                        </button>
                        <button
                            onClick={() => setActiveFilter("twitter")}
                            className={cn(
                                "px-4 py-1.5 text-xs font-medium rounded-full border transition-all",
                                activeFilter === "twitter"
                                    ? "bg-white text-black border-white"
                                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Twitter
                        </button>
                    </div>
                </div>

                {/* Testimonials List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredTestimonials.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                            No testimonials found matching your criteria.
                        </div>
                    ) : (
                        filteredTestimonials.map((t) => {
                            const isSelected = localSelectedIds.includes(t.id)
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => toggleSelection(t.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all flex gap-3",
                                        isSelected
                                            ? "bg-indigo-500/10 border-indigo-500/50"
                                            : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                                    )}
                                >
                                    {/* Checkbox */}
                                    <div
                                        className={cn(
                                            "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                                            isSelected
                                                ? "bg-indigo-500 border-indigo-500"
                                                : "border-zinc-600 bg-transparent"
                                        )}
                                    >
                                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Avatar */}
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-indigo-600 text-white shrink-0"
                                            >
                                                {t.authorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white text-sm truncate">{t.authorName}</p>
                                            </div>
                                            {/* Star Rating */}
                                            <div className="flex items-center gap-0.5 text-amber-400">
                                                {Array.from({ length: t.rating }).map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                            {t.content}
                                        </p>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        Save Selection ({localSelectedIds.length})
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SelectTestimonialsModal
