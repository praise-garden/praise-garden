"use client";

import { Button } from "@/components/ui/button";
import { Copy, Pencil, Scissors, Share2, Trash2 } from "lucide-react";
import { deleteTestimonial } from "@/lib/actions/testimonials";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface TestimonialToolbarProps {
    testimonialId: string | number;
    isVideo: boolean;
}

export function TestimonialToolbar({ testimonialId, isVideo }: TestimonialToolbarProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteTestimonial(testimonialId);
                router.push("/dashboard");
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete testimonial");
            }
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        // Could replace with a toast
        alert("Link copied to clipboard!");
    };

    const handleFeatureNotReady = (feature: string) => {
        alert(`${feature} feature coming soon!`);
    };

    return (
        <>
            <div className="border-t border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#18181b]">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => handleFeatureNotReady("Edit Metadata")}
                        className="h-10 px-4 gap-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/50 rounded-xl transition-all duration-200"
                    >
                        <Pencil className="size-4" />
                        <span className="font-medium">Edit</span>
                    </Button>

                    {isVideo && (
                        <Button
                            variant="ghost"
                            onClick={() => handleFeatureNotReady("Video Trim")}
                            className="h-10 px-4 gap-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/50 rounded-xl transition-all duration-200"
                        >
                            <Scissors className="size-4" />
                            <span className="font-medium">Trim</span>
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        onClick={() => handleFeatureNotReady("Duplicate")}
                        className="h-10 px-4 gap-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/50 rounded-xl transition-all duration-200"
                    >
                        <Copy className="size-4" />
                        <span className="font-medium">Duplicate</span>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="h-10 px-4 gap-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all duration-200"
                    >
                        <Trash2 className="size-4" />
                        <span className="font-medium">Delete</span>
                    </Button>
                </div>

                <Button
                    onClick={handleShare}
                    className="bg-zinc-50 hover:bg-white text-zinc-950 h-10 px-6 gap-2.5 rounded-xl font-semibold shadow-lg shadow-zinc-950/20 hover:shadow-zinc-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent"
                >
                    <Share2 className="size-4" />
                    Share
                </Button>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-[425px] p-6 gap-6 shadow-2xl shadow-black/50">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl font-semibold">Delete Testimonial?</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-base leading-relaxed">
                            Are you sure you want to permanently delete this testimonial?
                            This action cannot be undone and will remove it from all walls.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-3 sm:gap-0 mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="h-11 px-6 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="h-11 px-6 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-xl font-medium transition-all shadow-none"
                        >
                            {isPending ? "Deleting..." : "Delete Permanently"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
