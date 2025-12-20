"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImportWebPage() {
    const [selectedSource, setSelectedSource] = useState<string | null>(null);

    const sources = [
        { id: "airbnb", label: "Airbnb", image: "/brands/air.png" },
        { id: "amazon", label: "Amazon", image: "/brands/Amazon_icon.png" },
        { id: "app-store", label: "App Store", image: "/brands/Appstore.svg" },
        { id: "chrome", label: "Chrome", image: "/brands/chrome-webstore.svg" },
        { id: "facebook", label: "Facebook", image: "/brands/facebook_icon.png" },
        { id: "google", label: "Google", image: "/brands/google.svg" },
        { id: "google-play", label: "Google Play", image: "/brands/playstore.svg" },
        { id: "linkedin", label: "LinkedIn", image: "/brands/linkedin.svg" },
    ];

    const selectedSourceData = sources.find(s => s.id === selectedSource);

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-semibold text-white">Import from web</h1>
                <span className="bg-zinc-800 text-zinc-400 text-xs font-medium px-2 py-0.5 rounded-md">
                    2/8
                </span>
            </div>
            <p className="text-zinc-500 text-sm mb-8">
                Paste a URL and Senja will import your proof.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
                {sources.map((source) => {
                    const isSelected = selectedSource === source.id;
                    const isAmazon = source.id === 'amazon';
                    return (
                        <button
                            key={source.id}
                            onClick={() => setSelectedSource(isSelected ? null : source.id)}
                            className={`group relative w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 ease-out border
                                ${isSelected
                                    ? "bg-zinc-900 border-purple-500 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] scale-105"
                                    : "bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                                }`}
                            aria-label={`Import from ${source.label}`}
                            aria-pressed={isSelected}
                        >
                            <div className={`relative transition-transform duration-300 group-hover:scale-110 w-7 h-7 
                                ${isAmazon ? 'bg-white rounded-md' : ''}`}>
                                <Image
                                    src={source.image}
                                    alt={source.label}
                                    fill
                                    className={`object-contain ${isAmazon ? 'p-[5px]' : ''}`}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedSource && selectedSourceData && (
                <div className="max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6">
                        <label htmlFor="url-input" className="text-sm font-medium text-zinc-300 block mb-2">
                            {selectedSourceData.label} URL
                        </label>
                        <input
                            type="text"
                            id="url-input"
                            placeholder={`https://www.${selectedSourceData.id === 'google-play' ? 'play.google' : selectedSourceData.id}.com/...`}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-mono text-sm"
                        />
                        <p className="text-xs text-zinc-500 mt-2 mb-6">
                            For example, https://www.{selectedSourceData.id === 'google-play' ? 'play.google' : selectedSourceData.id}.com/...
                        </p>

                        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                            Import testimonials
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
