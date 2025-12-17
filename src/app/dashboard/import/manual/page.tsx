"use client";

import { useState } from "react";
import { Upload, Calendar, X, Star, ChevronDown, Check } from "lucide-react";
import Image from "next/image";

export default function ManualImportPage() {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    // Form Stats
    const [rating, setRating] = useState(5);
    const [tags, setTags] = useState(["product", "marketing"]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col items-center justify-center min-h-full py-12 px-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Manual Import</h1>
                    <p className="text-zinc-400">Add testimonials manually to your account.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">
                        <span>Step {step} of {totalSteps}</span>
                        <span>{step === 1 ? "Customer Details" : step === 2 ? "Testimonial Content" : "Verification & Metadata"}</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

                    {/* Step 1: Customer Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-semibold text-white">Customer Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Job Title</label>
                                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Avatar Upload</label>
                                    <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-zinc-500" />
                                        </div>
                                        <p className="text-sm text-zinc-400 font-medium mb-1">Drag-and-drop zone</p>
                                        <button className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-zinc-200 transition-colors mt-2">
                                            Choose File
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Company</label>
                                        <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Website URL</label>
                                        <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Testimonial Content */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-semibold text-white">Testimonial Content</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button key={s} onClick={() => setRating(s)} className="focus:outline-none">
                                                <Star className={`w-6 h-6 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
                                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Testimonial Body</label>
                                    <textarea rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all resize-none"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Source</label>
                                    <div className="relative">
                                        <button className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {/* Placeholder for source icon */}
                                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                                <span>Custom Import</span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Media Attachments</label>
                                    <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-zinc-500" />
                                        </div>
                                        <p className="text-sm text-zinc-400 font-medium mb-1">Drag-and-drop zone</p>
                                        <p className="text-xs text-zinc-600">Or click to upload</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Verification & Metadata */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-semibold text-white">Verification & Metadata</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Post URL</label>
                                    <input type="text" placeholder="Enter original post URL" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                    <p className="text-xs text-zinc-500 mt-1">Enter validation link to post URL</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Date of Testimonial</label>
                                    <div className="relative">
                                        <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all" />
                                        <Calendar className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tags</label>
                                    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-zinc-200 flex flex-wrap gap-2 min-h-[46px]">
                                        {tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-200 text-xs font-medium px-2 py-1 rounded-md">
                                                {tag}
                                                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-white">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                        <input type="text" placeholder="Add tag..." className="bg-transparent border-none outline-none text-sm min-w-[80px] flex-1 px-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800/50">
                        {step > 1 ? (
                            <button
                                onClick={prevStep}
                                className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                className="px-6 py-2.5 rounded-lg border border-zinc-800 text-zinc-600 font-medium cursor-not-allowed"
                                disabled
                            >
                                Back
                            </button>
                        )}

                        <div className="flex gap-3">
                            <button className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors">
                                Cancel
                            </button>
                            {step < totalSteps ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2.5 rounded-lg bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-colors"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    className="px-6 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-bold hover:bg-white transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                                >
                                    Import Testimonial
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
