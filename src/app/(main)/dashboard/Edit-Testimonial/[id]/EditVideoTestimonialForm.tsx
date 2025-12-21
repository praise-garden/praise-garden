"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Play, Plus, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToStorage, deleteImageFromStorage } from "@/lib/storage";
import { updateTestimonialContent } from "@/lib/actions/testimonials";
import { generateVideoThumbnail } from "@/lib/utils/thumbnail-generator";

interface EditVideoTestimonialFormProps {
    testimonial: any;
    onClose: () => void;
}

export function EditVideoTestimonialForm({ testimonial, onClose }: EditVideoTestimonialFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(testimonial.title || "");
    const [rating, setRating] = useState(testimonial.rating || 5);
    const [excerpt, setExcerpt] = useState(testimonial.excerpt || "");

    const initialVideoUrl = testimonial.attachments?.find((a: any) => a.type === 'video')?.url ||
        (testimonial.type === 'video' ? testimonial.video_url : null);

    const initialThumbnailUrls = (testimonial.raw?.data?.thumbnails || []) as string[];

    const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [thumbnails, setThumbnails] = useState<{ url: string; file?: File }[]>(
        (testimonial.raw?.data?.thumbnails || []).map((url: any) => ({ url: String(url) }))
    );
    const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState<number>(
        testimonial.raw?.data?.selected_thumbnail_index || 0
    );

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Reset video to ensure poster (thumbnail) is valid/visible
        if (videoRef.current) {
            videoRef.current.load();
            setIsPlaying(false);
        }
    }, [selectedThumbnailIndex]);

    const handleThumbnailClick = () => {
        thumbnailInputRef.current?.click();
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setThumbnails(prev => {
                if (prev.length < 3) {
                    return [...prev, { url, file }];
                } else {
                    // Replace the 3rd item (index 2)
                    const newItems = [...prev];
                    newItems[2] = { url, file };
                    return newItems;
                }
            });
            e.target.value = "";
        }
    };



    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleReplaceVideo = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setVideoFile(file);
            setIsPlaying(false);

            try {
                // Generate thumbnails client-side
                const t20 = await generateVideoThumbnail(file, 0.2);
                const t50 = await generateVideoThumbnail(file, 0.5);

                const newThumbs = [
                    { url: URL.createObjectURL(t20), file: new File([t20], `thumb_1_${Date.now()}.webp`, { type: "image/webp" }) },
                    { url: URL.createObjectURL(t50), file: new File([t50], `thumb_2_${Date.now()}.webp`, { type: "image/webp" }) }
                ];
                setThumbnails(newThumbs);
                setSelectedThumbnailIndex(0);
            } catch (err) {
                console.error("Thumbnail generation failed", err);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const userId = testimonial.raw?.user_id;
            if (!userId) {
                throw new Error("User ID missing. Cannot save.");
            }

            let finalVideoUrl = videoUrl;

            // 1. Upload new video if selected
            if (videoFile) {
                toast.loading("Uploading video...");

                const { url } = await uploadImageToStorage({
                    file: videoFile,
                    context: {
                        type: 'user',
                        userId: userId,
                        namespace: 'videos'
                    }
                });
                finalVideoUrl = url;

                // 2. Delete old video if replaced and it was a storage URL
                if (initialVideoUrl && initialVideoUrl !== finalVideoUrl) {
                    try {
                        const urlObj = new URL(initialVideoUrl);
                        // Extract path from public URL. Assumes 'assets' bucket.
                        const pathParts = urlObj.pathname.split('/public/assets/');
                        if (pathParts[1]) {
                            await deleteImageFromStorage(pathParts[1]);
                        }
                    } catch (err) {
                        console.error("Failed to cleanup old video", err);
                    }
                }
            }

            // 3. Upload Thumbnails
            const finalThumbnails = await Promise.all(thumbnails.map(async (t) => {
                if (t.file) {
                    toast.loading("Uploading thumbnail...");
                    const res = await uploadImageToStorage({
                        file: t.file,
                        context: {
                            type: 'user',
                            userId: userId,
                            namespace: 'thumbnails'
                        }
                    });
                    return res.url;
                }
                return t.url;
            }));

            // 4. Cleanup orphaned thumbnails
            if (initialThumbnailUrls && initialThumbnailUrls.length > 0) {
                const orphanUrls = initialThumbnailUrls.filter(url => !finalThumbnails.includes(url));
                if (orphanUrls.length > 0) {
                    await Promise.all(orphanUrls.map(async (url) => {
                        try {
                            const urlObj = new URL(url);
                            const pathParts = urlObj.pathname.split('/public/assets/');
                            if (pathParts[1]) {
                                await deleteImageFromStorage(pathParts[1]);
                            }
                        } catch (e) {
                            console.error("Cleanup thumb failed", e);
                        }
                    }));
                }
            }

            // 5. Update DB
            toast.dismiss();
            toast.loading("Saving changes...");

            const updateData = {
                title,
                rating,
                message: excerpt,
                thumbnails: finalThumbnails,
                selected_thumbnail_index: selectedThumbnailIndex,
                media: {
                    ...(testimonial.raw?.data?.media || {}),
                    video_url: finalVideoUrl
                }
            };

            const result = await updateTestimonialContent(testimonial.id, updateData);

            toast.dismiss();
            toast.success("Testimonial updated successfully!");
            router.refresh();
            onClose();

        } catch (error: any) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to save: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#09090b] border border-zinc-800 shadow-2xl rounded-xl overflow-hidden text-zinc-50 flex flex-col h-full min-h-[700px] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-zinc-800/50 bg-[#09090b]">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Edit Testimonial</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800">
                    <X className="size-5" />
                </Button>
            </div>

            {/* Main Content Split View */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

                {/* Left Panel: Media (Thumbnails + Video) */}
                <div className="lg:col-span-5 p-6 space-y-6 lg:border-r border-zinc-800/50 bg-[#0c0c0e] overflow-y-auto scrollbar-hide">
                    {/* Thumbnails */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-400">Thumbnail</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedThumbnailIndex(i)}
                                    className={`relative aspect-video bg-zinc-800 rounded-md border border-zinc-700/50 overflow-hidden cursor-pointer transition-all group ${selectedThumbnailIndex === i ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-500'
                                        }`}
                                >
                                    {thumbnails[i] ? (
                                        <>
                                            <img src={thumbnails[i].url} alt={`Frame ${i + 1}`} className="w-full h-full object-cover rounded-md" />

                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 bg-zinc-900 text-xs">
                                            Frame {i + 1}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div
                                onClick={handleThumbnailClick}
                                className="aspect-video bg-zinc-900/50 border border-zinc-800 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-800/50 hover:text-white text-zinc-500 transition-all"
                            >
                                <Upload className="size-4" />
                            </div>
                            <input
                                type="file"
                                ref={thumbnailInputRef}
                                onChange={handleThumbnailChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-400">Video</label>
                        <div className="w-full aspect-video bg-black rounded-lg border border-zinc-800 relative group overflow-hidden">
                            {videoUrl ? (
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    poster={thumbnails[selectedThumbnailIndex]?.url}
                                    className="w-full h-full object-cover"
                                    controls={isPlaying}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700">No Video</div>
                            )}
                            {!isPlaying && videoUrl && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer"
                                    onClick={handlePlay}
                                >
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full group-hover:scale-110 transition-transform">
                                        <Play className="size-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Replace Button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={handleReplaceVideo}
                        className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-10 gap-2 rounded-lg"
                    >
                        <Upload className="size-4" />
                        Replace Video
                    </Button>
                </div>

                <div className="lg:col-span-7 p-6 overflow-y-auto scrollbar-hide bg-[#09090b]">
                    <div className="space-y-6 w-full">

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Testimonial Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ex. Amazing tool. I can't live without it!"
                                className="bg-zinc-900/50 border-zinc-800 h-10 text-zinc-200 placeholder:text-zinc-600 focus:ring-zinc-700 rounded-lg"
                            />
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Rating</label>
                            <div className="flex items-center gap-1.5 h-10">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-all hover:scale-110 active:scale-95 group"
                                    >
                                        <Star
                                            className={`size-6 transition-colors ${star <= rating
                                                ? "fill-amber-500 text-amber-500 drop-shadow-sm"
                                                : "fill-zinc-800/50 text-zinc-700 group-hover:text-zinc-500"
                                                }`}
                                            strokeWidth={star <= rating ? 0 : 1.5}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Excerpt</label>
                            <Textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Write your excerpt here..."
                                className="bg-zinc-900/50 border-zinc-800 min-h-[100px] text-zinc-200 placeholder:text-zinc-600 focus:ring-zinc-700 resize-none rounded-lg"
                            />
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                                <span className="inline-block size-1 bg-zinc-600 rounded-full" />
                                Enter a short excerpt. Tip: Select text to highlight your favorite parts.
                            </p>
                        </div>



                        {/* Source Row */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-5 space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Testimonial Source</label>
                                <Select defaultValue="linkedin">
                                    <SelectTrigger className="w-full h-10 bg-zinc-900 border-zinc-800 text-zinc-300 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-400">♥</span>
                                            <SelectValue placeholder="Source" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="twitter">Twitter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-7 space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Source URL</label>
                                <Input
                                    placeholder="ex. https://senja.io"
                                    className="w-full bg-zinc-900 border-zinc-800 h-10 text-zinc-200 placeholder:text-zinc-600 focus:ring-zinc-700 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Date</label>
                            <div className="relative">
                                <Input
                                    defaultValue="23/09/2025"
                                    className="bg-zinc-900 border-zinc-800 h-10 text-zinc-200 placeholder:text-zinc-600 focus:ring-zinc-700 pl-4 rounded-lg"
                                />
                                <div className="absolute right-3 top-2.5 text-zinc-500 pointer-events-none">
                                    <Calendar className="size-5" />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-white text-black hover:bg-zinc-200 h-11 font-bold rounded-lg shadow-lg shadow-zinc-950/20 transition-all disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
