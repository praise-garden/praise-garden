"use client";

import { useState, useTransition } from "react";
import { Camera, Calendar, Star, X, Image as ImageIcon, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createTestimonial } from "@/lib/actions/testimonials";

interface TextTestimonialFormProps {
    rating: number;
    setRating: (rating: number) => void;
}

export function TextTestimonialForm({ rating, setRating }: TextTestimonialFormProps) {
    const [tags, setTags] = useState(["product", "service", "customer-love"]);
    const [newTag, setNewTag] = useState("");
    const [showCompanyDetails, setShowCompanyDetails] = useState(false);

    // Form States
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState("");
    const [headline, setHeadline] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [website, setWebsite] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [originalPostUrl, setOriginalPostUrl] = useState("");
    const [source, setSource] = useState("manual");

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.trim()) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = () => {
        if (!name) {
            alert("Please enter a customer name.");
            return;
        }

        const formData = {
            type: 'text',
            rating,
            tags,
            customer_name: name,
            customer_headline: headline,
            customer_email: email,
            company_name: companyName,
            company_title: jobTitle,
            company_website: website,
            testimonial_title: title,
            testimonial_message: message,
            testimonial_date: date,
            original_post_url: originalPostUrl,
            source: source.toLowerCase()
        };

        startTransition(async () => {
            try {
                await createTestimonial(formData);
                alert("Testimonial imported successfully!");
                // Clear form or redirect could happen here
                setName("");
                setMessage("");
                setTitle("");
                setHeadline("");
                // Reset other fields as needed
            } catch (error: any) {
                console.error(error);
                alert("Failed to import: " + (error.message || "Unknown error"));
            }
        });
    };

    return (
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar space-y-10">
            {/* Customer Information */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Customer Info</h2>
                </div>

                <div className="grid grid-cols-[1fr,auto] gap-6">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-zinc-400 font-medium">Full Name <span className="text-[#F5426C]">*</span></Label>
                            <Input
                                value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sarah Connor"
                                className="bg-zinc-900/50 border-zinc-800 focus:border-[#F5426C] focus:ring-1 focus:ring-[#F5426C]/50 text-zinc-200 placeholder:text-zinc-600 h-10 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400 font-medium">Headline</Label>
                            <Input
                                value={headline} onChange={(e) => setHeadline(e.target.value)}
                                placeholder="e.g. CMO at TechCorp"
                                className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400 font-medium">Email Address</Label>
                            <Input
                                type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="sarah@example.com"
                                className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-8">
                        <div className="group relative w-28 h-28 rounded-full bg-zinc-900 border-2 border-dashed border-[#F5426C]/50 hover:border-[#F5426C] hover:bg-[#F5426C]/5 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden">
                            <Camera className="w-8 h-8 text-[#F5426C] mb-2 transition-colors" />
                            <span className="text-[10px] uppercase font-bold text-[#F5426C] text-center tracking-wide">Upload<br />Avatar</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Details */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Company Details</h2>
                    <div className="flex items-center gap-3 bg-zinc-900/40 px-3 py-1.5 rounded-full border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                        <Label htmlFor="company-details-toggle" className="text-xs text-zinc-400 font-medium cursor-pointer select-none">
                            {showCompanyDetails ? "Details Visible" : "Add Details"}
                        </Label>
                        <Switch
                            id="company-details-toggle"
                            checked={showCompanyDetails}
                            onCheckedChange={setShowCompanyDetails}
                            className="data-[state=checked]:bg-[#F5426C] data-[state=unchecked]:bg-zinc-700 border-transparent h-5 w-9 ring-0 focus-visible:ring-2 focus-visible:ring-[#F5426C]/50"
                        />
                    </div>
                </div>

                {showCompanyDetails && (
                    <div className="grid grid-cols-[1fr,auto] gap-6 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400 font-medium">Company Name</Label>
                                    <Input
                                        value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="TechCorp Inc."
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400 font-medium">Job Title</Label>
                                    <Input
                                        value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="Chief Marketing Officer"
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 font-medium">Website URL</Label>
                                <Input
                                    value={website} onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://techcorp.com"
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-8">
                            <div className="group relative w-28 h-28 rounded-xl bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden">
                                <ImageIcon className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 mb-2 transition-colors" />
                                <span className="text-[10px] uppercase font-medium text-zinc-600 group-hover:text-zinc-400 text-center tracking-wide">Company<br />Logo</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Testimonial Content */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Testimonial Content</h2>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Rating</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setRating(s)}
                                    className="focus:outline-none hover:scale-110 active:scale-95 transition-transform p-1 hover:bg-white/5 rounded-md"
                                >
                                    <Star className={`w-6 h-6 ${s <= rating ? "fill-[#F5426C] text-[#F5426C] drop-shadow-md" : "text-zinc-700 fill-zinc-800"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Title</Label>
                        <Input
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="Great experience!"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Message</Label>
                        <Textarea
                            rows={5}
                            value={message} onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share your experience working with us..."
                            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none min-h-[120px]"
                        />
                    </div>
                </div>
            </div>

            {/* Attachments */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Attachments</h2>
                </div>

                <div className="w-full h-40 rounded-xl bg-zinc-900/30 border-2 border-dashed border-zinc-700 hover:border-[#F5426C]/50 hover:bg-[#F5426C]/5 transition-all cursor-pointer group flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                        <Upload className="w-5 h-5 text-zinc-400 group-hover:text-[#F5426C]" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400 group-hover:text-[#F5426C] mb-1">Click to upload or drag & drop</span>
                    <span className="text-xs text-zinc-600">Images or Video (Max 50MB)</span>
                </div>
            </div>

            {/* Verification & Metadata */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-2">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Verification & Metadata</h2>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Original Post URL</Label>
                        <Input
                            value={originalPostUrl} onChange={(e) => setOriginalPostUrl(e.target.value)}
                            placeholder="https://..."
                            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10"
                        />
                        <p className="text-[10px] text-zinc-500">Original Post URL or verification for the comment.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Date</Label>
                        <div className="relative">
                            <Input
                                value={date} onChange={(e) => setDate(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 h-10 pl-4"
                            />
                            <Calendar className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span key={i} className="bg-zinc-800 text-zinc-300 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm border border-zinc-700/50 group">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="p-0.5 hover:bg-zinc-700 rounded-full transition-colors">
                                        <X className="w-3 h-3 text-zinc-500 group-hover:text-red-400" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Source</Label>
                        <div className="relative">
                            <select
                                value={source} onChange={(e) => setSource(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md h-10 px-3 text-sm text-zinc-200 focus:outline-none focus:border-[#F5426C]/50 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="manual">Select source</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="email">Email</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400 font-medium">Tags</Label>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add a topic or tags..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md h-10 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#F5426C]/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-transparent blur-none">
                <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="bg-[#F5426C] hover:bg-[#F5426C]/90 text-white shadow-lg shadow-[#F5426C]/20 px-8"
                >
                    {isPending ? "Importing..." : "Import Testimonial"}
                </Button>
            </div>
        </div>
    );
}
