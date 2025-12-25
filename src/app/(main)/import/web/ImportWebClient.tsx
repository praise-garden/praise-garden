"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type Source = {
    id: string;
    label: string;
    image: string;
};

interface ImportWebClientProps {
    sources: Source[];
}

export default function ImportWebClient({ sources }: ImportWebClientProps) {
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const selectedSourceData = sources.find(s => s.id === selectedSource);

    const filteredSources = sources.filter((source) =>
        source.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full max-w-4xl py-4 px-8 relative">
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-semibold text-white">Import from web</h1>
                <span className="bg-zinc-800 text-zinc-400 text-xs font-medium px-2 py-0.5 rounded-md">
                    {sources.length} sources
                </span>
            </div>
            <p className="text-zinc-500 text-sm mb-6">
                Paste a URL and Trustimonials will import your proof.
            </p>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search sources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all text-sm"
                />
            </div>

            {selectedSource && selectedSourceData && (
                <div className="max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 relative">
                        <button
                            onClick={() => setSelectedSource(null)}
                            className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <label htmlFor="url-input" className="text-sm font-medium text-zinc-300 block mb-2">
                            {selectedSourceData.label} URL
                        </label>
                        <input
                            type="text"
                            id="url-input"
                            placeholder={`Paste ${selectedSourceData.label} link here...`}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-mono text-sm"
                        />
                        <p className="text-xs text-zinc-500 mt-2 mb-6">
                            For example, enter the direct link to the {selectedSourceData.label} page.
                        </p>

                        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                            Import testimonials
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4">
                {filteredSources.map((source) => {
                    const isSelected = selectedSource === source.id;
                    // Add background for logos that might be dark/black on transparent and need contrast on dark theme
                    const isWhiteBg = ['amazon', 'twitter-x', 'tiktok', 'uber', 'notion', 'apple', 'g2'].includes(source.id);

                    return (
                        <button
                            key={source.id}
                            onClick={() => setSelectedSource(isSelected ? null : source.id)}
                            className={`group relative flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 border text-left
                                ${isSelected
                                    ? "bg-zinc-800 border-purple-500 ring-1 ring-purple-500/50"
                                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
                                }`}
                            aria-label={`Import from ${source.label}`}
                            aria-pressed={isSelected}
                        >
                            <div className={`relative flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center
                                ${isWhiteBg ? 'bg-white p-0.5' : ''}`}>
                                <Image
                                    src={source.image}
                                    alt={source.label}
                                    fill
                                    className={`object-contain ${isWhiteBg ? 'p-0.5' : ''}`}
                                />
                            </div>
                            <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                {source.label}
                            </span>
                        </button>
                    );
                })}
            </div>


        </div>
    );
}
