"use client";

import { useState, useTransition, useRef } from "react";
import { Video, Upload, ChevronDown, ImageIcon, Star, Tag, Calendar, Check, Loader2 } from "lucide-react";
import { uploadImageToStorage } from "@/lib/storage";
import { generateVideoThumbnail } from "@/lib/supabase/thumbnail-generator";
import { createClient } from "@/lib/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createTestimonial, updateTestimonialContent } from "@/lib/actions/testimonials";

interface VideoTestimonialFormProps {
    rating: number;
    setRating: (rating: number) => void;
    initialData?: any;
    testimonialId?: string | number;
    isEditing?: boolean;
    onSuccess?: () => void;
}

export function VideoTestimonialForm({ rating, setRating, initialData, testimonialId, isEditing, onSuccess }: VideoTestimonialFormProps) {
    const [isPending, startTransition] = useTransition();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState(initialData?.customer_name || "");
    const [tagline, setTagline] = useState(initialData?.customer_headline || initialData?.profession || "");
    const [email, setEmail] = useState(initialData?.customer_email || "");
    const [company, setCompany] = useState(initialData?.company?.name || initialData?.company_name || "");
    const [team, setTeam] = useState(""); // Not checking initialData for team as no clear mapping
    const [message, setMessage] = useState(initialData?.message || initialData?.testimonial_message || "");
    const [date, setDate] = useState(initialData?.testimonial_date || initialData?.date || new Date().toISOString().split('T')[0]);

    // File Upload States
    const [videoUrl, setVideoUrl] = useState(initialData?.video_url || initialData?.media?.video_url || "");
    const [avatarUrl, setAvatarUrl] = useState(initialData?.customer_avatar_url || initialData?.avatar_url || initialData?.media?.avatar_url || "");
    const [companyLogoUrl, setCompanyLogoUrl] = useState(initialData?.company_logo_url || initialData?.company?.logo_url || "");
    const [thumbnailBlobs, setThumbnailBlobs] = useState<Blob[]>([]);
    const [localVideoPreview, setLocalVideoPreview] = useState<string | null>(null);

    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    const videoInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'avatar' | 'logo') => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (type === 'video') setIsUploadingVideo(true);
        else if (type === 'avatar') setIsUploadingAvatar(true);
        else setIsUploadingLogo(true);

        try {
            if (type === 'video') {
                const { uploadVideo } = await import("@/lib/video-upload");
                const result = await uploadVideo(file);

                if (result.type === 'cloudflare') {
                    // Store UID for form submission
                    setVideoUrl(result.uid!);

                    // Set local preview to avoid waiting for Cloudflare processing
                    // This stores the blob: URL so the user sees their video instantly
                    const objectUrl = URL.createObjectURL(file);
                    setLocalVideoPreview(objectUrl);
                } else {
                    setVideoUrl(result.url!);
                    setLocalVideoPreview(null);
                }

                // Only generate thumbnails manually if we are NOT using Cloudflare (i.e. using Supabase Storage)
                if (process.env.NEXT_PUBLIC_VIDEO_PROVIDER !== 'cloudflare-stream') {
                    try {
                        const t20 = await generateVideoThumbnail(file, 0.2);
                        const t50 = await generateVideoThumbnail(file, 0.5);
                        setThumbnailBlobs([t20, t50]);
                    } catch (e) {
                        console.error("Thumbnail generation failed", e);
                    }
                }

            } else {
                // Images still go to Supabase
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const result = await uploadImageToStorage({
                        file,
                        context: { type: 'user', userId: user.id },
                        bucket: 'assets'
                    });
                    if (type === 'avatar') setAvatarUrl(result.url);
                    else setCompanyLogoUrl(result.url);
                }
            }

        } catch (error) {
            console.error(error);
            alert("Upload failed. Showing preview instead.");
            const objectUrl = URL.createObjectURL(file);
            if (type === 'video') {
                // In case of failure, we might want to let them preview locally but blocking submission might be better?
                // Users wanted a robust flow.
                setVideoUrl(objectUrl);
            }
            else if (type === 'avatar') setAvatarUrl(objectUrl);
            else setCompanyLogoUrl(objectUrl);
        } finally {
            if (type === 'video') setIsUploadingVideo(false);
            else if (type === 'avatar') setIsUploadingAvatar(false);
            else setIsUploadingLogo(false);
        }
    };

    const handleSubmit = () => {
        if (!videoUrl) {
            alert("Please upload a video. Video is required for video testimonials.");
            return;
        }

        if (!name) {
            alert("Please enter a customer name.");
            return;
        }

        const formData = {
            type: 'video',
            rating,
            customer_name: name,
            customer_headline: tagline,
            customer_email: email,
            company_name: company,
            company_title: "", // Not explicitly in video form UI, could map Tagline to title but they are separate concept usually.
            testimonial_message: message,
            testimonial_date: date,
            source: 'manual',
            tags: [], // No tag input in this form except 'Add a tag' button which was dummy
            // media: { ... } // Video upload not yet implemented
        };

        startTransition(async () => {
            try {
                if (isEditing && testimonialId) {
                    const updateData = {
                        rating,
                        customer_name: name,
                        customer_headline: tagline,
                        customer_email: email,
                        customer_avatar_url: avatarUrl,
                        company: {
                            name: company,
                            logo_url: companyLogoUrl
                        },
                        message,
                        testimonial_date: date,
                        source: 'manual',
                        video_url: videoUrl
                    };
                    await updateTestimonialContent(testimonialId, updateData);
                    if (onSuccess) onSuccess();
                } else {
                    // Upload Thumbnails
                    const thumbUrls: string[] = [];
                    if (thumbnailBlobs.length > 0) {
                        try {
                            const supabase = createClient();
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                                for (let i = 0; i < thumbnailBlobs.length; i++) {
                                    const blob = thumbnailBlobs[i];
                                    const thumbFile = new File([blob], `thumb_${Date.now()}_${i}.webp`, { type: "image/webp" });
                                    const res = await uploadImageToStorage({
                                        file: thumbFile,
                                        context: { type: 'user', userId: user.id },
                                        bucket: 'assets'
                                    });
                                    thumbUrls.push(res.url);
                                }
                            }
                        } catch (e) { console.error("Thumbnail upload failed", e); }
                    }

                    const formData = {
                        thumbnails: thumbUrls,
                        type: 'video',
                        rating,
                        customer_name: name,
                        customer_headline: tagline,
                        customer_email: email,
                        customer_avatar_url: avatarUrl,
                        company_name: company,
                        company_title: "",
                        company_logo_url: companyLogoUrl,
                        testimonial_message: message,
                        testimonial_date: date,
                        source: 'manual',
                        tags: [],
                        video_url: videoUrl
                    };

                    await createTestimonial(formData);
                    setShowSuccessDialog(true);
                    // Reset form
                    setName("");
                    setTagline("");
                    setEmail("");
                    setCompany("");
                    setMessage("");
                }
            } catch (error: any) {
                console.error(error);
                alert("Failed to " + (isEditing ? "update" : "import") + ": " + (error.message || "Unknown error"));
            }
        });
    };

    return (
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar space-y-6">
            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-sm">
                    <DialogHeader className="flex flex-col items-center justify-center text-center gap-4 py-4">
                        <div className="size-12 rounded-full bg-green-900/20 border border-green-900/50 flex items-center justify-center">
                            <Check className="size-6 text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-xl">Import Successful</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                The video testimonial has been added to your collection.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            onClick={() => setShowSuccessDialog(false)}
                            className="bg-[#F5426C] hover:bg-[#F5426C]/90 text-white min-w-[120px]"
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Video Upload Zone */}
            <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Video <span className="text-[#F5426C]">*</span></Label>
                <input
                    type="file"
                    ref={videoInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                />
                <div
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 flex flex-col items-center justify-center group hover:border-[#F5426C]/50 transition-colors cursor-pointer relative overflow-hidden"
                >
                    {isUploadingVideo ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-[#F5426C] animate-spin" />
                            <span className="text-zinc-400 text-sm">Uploading video...</span>
                        </div>
                    ) : (localVideoPreview || videoUrl) ? (
                        <div className="relative w-full h-full bg-black flex items-center justify-center">
                            {
                                // Priority 1: Local Preview (Instant playback after upload)
                                localVideoPreview ? (
                                    <video src={localVideoPreview} className="max-h-full max-w-full" controls playsInline />
                                ) :
                                    // Priority 2: Standard URL (Supabase or other direct link)
                                    (videoUrl.startsWith('http') || videoUrl.startsWith('blob:')) ? (
                                        <video src={videoUrl} className="max-h-full max-w-full" controls playsInline />
                                    ) : (
                                        // Priority 3: Cloudflare UID (Iframe)
                                        <iframe
                                            src={`https://iframe.videodelivery.net/${videoUrl}`}
                                            className="w-full h-full"
                                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                            allowFullScreen
                                        ></iframe>
                                    )
                            }
                            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full cursor-pointer hover:bg-black/80" onClick={(e) => { e.stopPropagation(); videoInputRef.current?.click(); }}>
                                <Upload className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 mb-4 relative">
                                <div className="absolute inset-0 bg-[#F5426C]/10 rounded-xl transform rotate-6"></div>
                                <div className="absolute inset-0 bg-[#F5426C]/20 rounded-xl transform -rotate-6"></div>
                                <div className="relative z-10 w-full h-full bg-zinc-900 border border-[#F5426C] rounded-xl flex items-center justify-center shadow-lg shadow-[#F5426C]/10">
                                    <Video className="w-8 h-8 text-[#F5426C]" />
                                    <div className="absolute -bottom-2 -right-2 bg-[#F5426C] rounded-full p-1 border-4 border-zinc-950">
                                        <Upload className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm font-medium">Drag and drop video here or <span className="text-white underline decoration-[#F5426C] decoration-2 underline-offset-4">Choose file</span></p>
                            <div className="flex justify-between w-full px-4 mt-6 text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                                <span>Supported formats: MP4, MOV, AVI, ...</span>
                                <span>Maximum size: 50MB</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Customer name <span className="text-[#F5426C]">*</span></Label>
                    <Input
                        value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-[#F5426C] focus:ring-1 focus:ring-[#F5426C]/50 text-zinc-200 placeholder:text-zinc-600 h-11"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Tagline</Label>
                    <Input
                        value={tagline} onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. CMO at TechCorp"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-11"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Avatar</Label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            ref={avatarInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'avatar')}
                        />
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                            {isUploadingAvatar ? (
                                <Loader2 className="w-4 h-4 text-[#F5426C] animate-spin" />
                            ) : avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-700"></div>
                            )}
                        </div>
                        <Button onClick={() => avatarInputRef.current?.click()} variant="outline" className="border-[#F5426C] text-[#F5426C] bg-transparent hover:bg-[#F5426C]/10 h-9 text-xs font-semibold px-4 tracking-wide uppercase">Pick an image</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Email</Label>
                    <Input
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-11"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Company</Label>
                        <Input
                            value={company} onChange={(e) => setCompany(e.target.value)}
                            placeholder="Ex. Trustmonials"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Team</Label>
                        <div className="relative">
                            <select className="w-full h-11 bg-zinc-900/50 border border-zinc-800 rounded-md px-3 text-sm text-zinc-400 appearance-none focus:border-[#F5426C] outline-none">
                                <option>Select a team</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Company Logo</Label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            ref={logoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'logo')}
                        />
                        <div className="w-10 h-8 rounded-md bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                            {isUploadingLogo ? (
                                <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />
                            ) : companyLogoUrl ? (
                                <img src={companyLogoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <ImageIcon className="w-4 h-4 text-zinc-600" />
                            )}
                        </div>
                        <Button onClick={() => logoInputRef.current?.click()} variant="outline" className="border-[#F5426C] text-[#F5426C] bg-transparent hover:bg-[#F5426C]/10 h-9 text-xs font-semibold px-4 tracking-wide uppercase">Pick an image</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Rating</Label>
                    <div className="flex gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                onClick={() => setRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                className="focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                            >
                                <Star className={`w-6 h-6 ${s <= (hoverRating || rating) ? "fill-[#F5426C] text-[#F5426C]" : "text-zinc-800 fill-zinc-800"}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Message</Label>
                    <Textarea
                        value={message} onChange={(e) => setMessage(e.target.value)}
                        placeholder="Love this service! If you have customers that need a level of confidence before they buy, this will help a ton!"
                        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none min-h-[120px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Date</Label>
                    <div className="relative">
                        <Input
                            value={date} onChange={(e) => setDate(e.target.value)}
                            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-11 pl-4"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                </div>


            </div>

            {/* Footer Button */}
            <div className="pt-6 pb-2">
                <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="w-full bg-[#F5426C] hover:bg-[#F5426C]/90 text-white shadow-lg shadow-[#F5426C]/20 h-11 text-sm font-semibold tracking-wide"
                >
                    {isPending ? "Importing..." : "Import testimonial"}
                </Button>
            </div>
        </div>
    );
}
