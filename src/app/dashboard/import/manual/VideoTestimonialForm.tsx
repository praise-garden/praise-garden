"use client";

import { useState, useTransition } from "react";
import { Video, Upload, ChevronDown, ImageIcon, Star, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createTestimonial } from "@/lib/actions/testimonials";

interface VideoTestimonialFormProps {
    rating: number;
    setRating: (rating: number) => void;
}

export function VideoTestimonialForm({ rating, setRating }: VideoTestimonialFormProps) {
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [team, setTeam] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [date, setDate] = useState(new Date().toLocaleDateString());

    const handleSubmit = () => {
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
            testimonial_message: excerpt, // Using excerpt as message
            testimonial_date: date,
            source: 'manual',
            tags: [], // No tag input in this form except 'Add a tag' button which was dummy
            // media: { ... } // Video upload not yet implemented
        };

        startTransition(async () => {
            try {
                await createTestimonial(formData);
                alert("Video testimonial imported successfully!");
                // Reset form
                setName("");
                setTagline("");
                setEmail("");
                setCompany("");
                setExcerpt("");
            } catch (error: any) {
                console.error(error);
                alert("Failed to import: " + (error.message || "Unknown error"));
            }
        });
    };

    return (
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar space-y-6">
            {/* Video Upload Zone */}
            <div className="w-full h-48 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 flex flex-col items-center justify-center group hover:border-[#F5426C]/50 transition-colors cursor-pointer relative overflow-hidden">
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
                    <span>Maximum size: 1000MB</span>
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
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-zinc-700 animate-pulse"></div>
                            </div>
                        </div>
                        <Button variant="outline" className="border-[#F5426C] text-[#F5426C] bg-transparent hover:bg-[#F5426C]/10 h-9 text-xs font-semibold px-4 tracking-wide uppercase">Pick an image</Button>
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
                        <div className="w-10 h-8 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-4 h-4 text-zinc-600" />
                        </div>
                        <Button variant="outline" className="border-[#F5426C] text-[#F5426C] bg-transparent hover:bg-[#F5426C]/10 h-9 text-xs font-semibold px-4 tracking-wide uppercase">Pick an image</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Rating</Label>
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                onClick={() => setRating(s)}
                                className="focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                            >
                                <Star className={`w-6 h-6 ${s <= rating ? "fill-[#F5426C] text-[#F5426C]" : "text-zinc-800 fill-zinc-800"}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wide font-semibold">Excerpt</Label>
                    <Textarea
                        value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
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

                <div className="space-y-2">
                    <Button variant="outline" className="text-zinc-400 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white h-9 px-3 gap-2 text-xs">
                        <Tag className="w-3 h-3" />
                        Add a tag
                    </Button>
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
