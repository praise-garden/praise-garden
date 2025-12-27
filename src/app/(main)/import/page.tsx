"use client";

import { Globe, FileSpreadsheet, PenTool, Chrome, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Extracted Component for better readability and formatting
const ImportFromWebCard = () => {
    return (
        <Link href="/import/web" className="block">
            <div className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 flex items-center justify-between transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-0.5">Import from web</h3>
                        <p className="text-sm text-zinc-500">Paste a URL and Trustimonials will import your proof.</p>
                    </div>
                </div>

                {/* Logos preview */}
                <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
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
    )
}

export default function ImportPage() {
    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Add proof to your account</h1>
                <p className="text-zinc-400">Import your proof from 30 sources.</p>
            </div>

            <div className="space-y-4">
                {/* Import from web */}
                <ImportFromWebCard />

                {/* Upload spreadsheet */}
                <button className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-0.5">Upload spreadsheet</h3>
                        <p className="text-sm text-zinc-500">Upload a CSV, XLS or XLSX file and Trustimonials will import your proof.</p>
                    </div>
                </button>

                {/* Manual import */}
                <Link href="/import/manual" className="block">
                    <div className="w-full group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center gap-4 transition-all text-left">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <PenTool className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-0.5">Manual import</h3>
                            <p className="text-sm text-zinc-500">Manually add video, text or screengrab proof to your account. Trustimonials will transcribe your videos and screengrabs.</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Bottom Footer */}
            <div className="mt-8">
                <button className="w-full group bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full p-4 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                        <Chrome className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">You can import from across the web with Trustimonials' free Chrome Extension.</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
            </div>
        </div>
    );
}
