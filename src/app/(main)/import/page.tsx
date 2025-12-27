"use client";

import { Globe, FileSpreadsheet, PenTool, Chrome, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ImportPage() {
    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Add proof to your account</h1>
                <p className="text-zinc-400">Import your proof from 30 sources.</p>
            </div>

            {/* Cards Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Import from Web Card */}
                <Link href="/import/web" className="block group">
                    <div className="bg-zinc-900/70 hover:bg-zinc-800/70 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 h-full transition-all duration-200 flex flex-col">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-semibold text-base mb-2">Import from web</h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                            Paste a URL and Trustimonials will import your proof.
                        </p>

                        {/* Brand Logos Grid - 2 rows of 4 */}
                        <div className="grid grid-cols-4 gap-2 mt-auto">
                            <div className="w-10 h-10 relative bg-[#ff5a5f] rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/airbnb.png`} alt="Airbnb" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/play-store.png`} alt="Play Store" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-[#1877f2] rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/facebook.png`} alt="Facebook" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-[#0a66c2] rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/linkedin.webp`} alt="LinkedIn" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/google.png`} alt="Google" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-white rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/amazon.png`} alt="Amazon" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/app-store.png`} alt="App Store" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-10 h-10 relative bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/Brands/twitter-x.png`} alt="Twitter" className="w-6 h-6 object-contain" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Upload Spreadsheet Card */}
                <button className="block group text-left w-full">
                    <div className="bg-zinc-900/70 hover:bg-zinc-800/70 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 h-full transition-all duration-200 flex flex-col">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mb-6">
                            <FileSpreadsheet className="w-5 h-5 text-red-400" />
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-semibold text-base mb-2">Upload spreadsheet</h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Upload a CSV, XLS or XLSX file and Trustimonials will import your proof.
                        </p>
                    </div>
                </button>

                {/* Manual Import Card */}
                <Link href="/import/manual" className="block group">
                    <div className="bg-zinc-900/70 hover:bg-zinc-800/70 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 h-full transition-all duration-200 flex flex-col">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                            <PenTool className="w-5 h-5 text-emerald-400" />
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-semibold text-base mb-2">Manual import</h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Manually add video, text or screengrab proof to your account. Trustimonials will transcribe your videos and screengrabs.
                        </p>
                    </div>
                </Link>

            </div>

            {/* Chrome Extension Footer */}
            <div className="mt-auto pt-12">
                <button className="w-full group bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 rounded-full py-4 px-5 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center">
                            <Chrome className="w-4 h-4 text-zinc-500" />
                        </div>
                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            You can import from across the web with Trustimonials' free Chrome Extension.
                        </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
            </div>
        </div>
    );
}
