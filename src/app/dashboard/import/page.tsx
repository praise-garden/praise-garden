"use client";

import { RefreshCw, Globe, FileSpreadsheet, PenTool, ThumbsUp, Chrome, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ImportPage() {
    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Add proof to your account</h1>
                <p className="text-zinc-400">Import your proof from 30 sources.</p>
            </div>

            <div className="space-y-4">
                {/* Auto-import */}
                <button className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-0.5">Auto-import</h3>
                        <p className="text-sm text-zinc-500">Connect to 21 platforms and Senja will automatically import your new proof.</p>
                    </div>
                </button>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-zinc-800"></div>
                    <span className="text-xs font-medium text-zinc-600 uppercase">OR</span>
                    <div className="h-[1px] flex-1 bg-zinc-800"></div>
                </div>

                {/* Import from web */}
                <Link href="/dashboard/import/web" className="block">
                    <div className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-0.5">Import from web</h3>
                                <p className="text-sm text-zinc-500">Paste a URL and Senja will import your proof.</p>
                            </div>
                        </div>

                        {/* Logos preview */}
                        <div className="flex items-center gap-2 pr-4 opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="grid grid-cols-4 gap-2">
                                {/* First row */}
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/air.png" alt="Airbnb" fill className="object-contain p-1" /></div>
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/google.svg" alt="Google" fill className="object-contain p-1" /></div>
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/facebook_icon.png" alt="Facebook" fill className="object-contain p-1" /></div>
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/linkedin.svg" alt="LinkedIn" fill className="object-contain p-1" /></div>
                                {/* Second row */}
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/Appstore.svg" alt="App Store" fill className="object-contain p-1" /></div>
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden bg-white"><Image src="/brands/Amazon_icon.png" alt="Amazon" fill className="object-contain p-0.5" /></div>
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/playstore.svg" alt="Play Store" fill className="object-contain p-1" /></div>
                                <div className="w-6 h-6 relative bg-zinc-800 rounded-md overflow-hidden"><Image src="/brands/chrome-webstore.svg" alt="Chrome" fill className="object-contain p-1" /></div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Upload spreadsheet */}
                <button className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-0.5">Upload spreadsheet</h3>
                        <p className="text-sm text-zinc-500">Upload a CSV, XLS or XLSX file and Senja will import your proof.</p>
                    </div>
                </button>

                {/* Manual import */}
                <Link href="/dashboard/import/manual" className="block">
                    <div className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <PenTool className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-0.5">Manual import</h3>
                            <p className="text-sm text-zinc-500">Manually add video, text or screengrab proof to your account. Senja will transcribe your videos and screengrabs.</p>
                        </div>
                    </div>
                </Link>

                {/* Migrate */}
                <button className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <ThumbsUp className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-0.5">Migrate</h3>
                        <p className="text-sm text-zinc-500">Paste your Testimonial.to Wall of Love URL and Senja will import your proof.</p>
                    </div>
                </button>
            </div>

            {/* Bottom Footer */}
            <div className="mt-8">
                <button className="w-full group bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full p-4 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                        <Chrome className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">You can import from across the web with Senja's free Chrome Extension.</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
            </div>
        </div>
    );
}
