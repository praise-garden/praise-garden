"use client";

import { useState } from "react";
import { TextTestimonialForm } from "./TextTestimonialForm";
import { VideoTestimonialForm } from "./VideoTestimonialForm";

export default function ManualImportPage() {
    const [importType, setImportType] = useState<"text" | "video">("text");
    const [rating, setRating] = useState(0);

    return (
        <div className="h-full flex flex-col justify-center items-center py-6 px-4">
            <div className="w-full max-w-3xl flex flex-col h-full bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5 mx-auto">

                {/* Header Section */}
                <div className="px-8 pt-8 pb-6 border-b border-zinc-800/50 bg-zinc-900/20">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Manual Import</h1>
                        <p className="text-sm text-zinc-400">Add text or video testimonials directly to your wall.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-zinc-900/80 rounded-xl mt-6 border border-zinc-800">
                        <button
                            onClick={() => setImportType("text")}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${importType === "text"
                                ? "bg-[#F5426C] text-white shadow-md shadow-[#F5426C]/20"
                                : "text-zinc-500 bg-zinc-900 hover:text-zinc-300 hover:bg-zinc-800"
                                }`}
                        >
                            Text Testimonial
                        </button>
                        <button
                            onClick={() => setImportType("video")}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${importType === "video"
                                ? "bg-[#F5426C] text-white shadow-md shadow-[#F5426C]/20"
                                : "text-zinc-500 bg-zinc-900 hover:text-zinc-300 hover:bg-zinc-800"
                                }`}
                        >
                            Video Testimonial
                        </button>
                    </div>
                </div>

                {importType === "text" ? (
                    <TextTestimonialForm rating={rating} setRating={setRating} />
                ) : (
                    <VideoTestimonialForm rating={rating} setRating={setRating} />
                )}
            </div>
        </div>
    );
}
