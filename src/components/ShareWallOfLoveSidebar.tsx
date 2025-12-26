"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    X,
    Twitter,
    Linkedin,
    Facebook,
    Copy,
    Check,
    MessageCircle,
    MessageSquare,
    Lock,
    Link,
    Pencil,
} from "lucide-react"
import { EditWallUrlDialog } from "@/components/EditWallUrlDialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ShareWallOfLoveSidebarProps {
    isOpen: boolean
    onClose: () => void
    shareableLink?: string
}

export function ShareWallOfLoveSidebar({
    isOpen,
    onClose,
    shareableLink,
}: ShareWallOfLoveSidebarProps) {
    const [currentLink, setCurrentLink] = React.useState("")
    const [linkCopied, setLinkCopied] = React.useState(false)
    const [codeCopied, setCodeCopied] = React.useState(false)
    const [editUrlOpen, setEditUrlOpen] = React.useState(false)

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentLink(shareableLink || window.location.href.split('?')[0])
        }
    }, [shareableLink, isOpen])

    // Generate embed code
    const embedCode = `<iframe 
    id="wall-of-love" 
    src="${currentLink}?embed=true" 
    style="width:100%; height:100vh; border:none; overflow:hidden;"
    scrolling="no"
    loading="lazy"
></iframe>`

    // Copy to clipboard handlers
    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(currentLink)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
    }

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(embedCode)
        setCodeCopied(true)
        setTimeout(() => setCodeCopied(false), 2000)
    }

    if (!isOpen) return null

    return (
        <>
            <EditWallUrlDialog
                isOpen={editUrlOpen}
                onOpenChange={setEditUrlOpen}
                initialUrl={currentLink}
            />

            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar Panel - Responsive width using viewport units */}
            <div
                className="fixed right-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300"
                style={{ width: 'clamp(360px, 30vw, 480px)' }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            Share your Wall of Love
                            <span className="text-xl">🎉</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                            aria-label="Close embed sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-sm text-white/80">
                        Share your Wall of Love with your potential customers.
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {/* Copy the link */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-zinc-900">Copy the link</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                {/* Using simple text or icon if needed, but input handles it */}
                            </div>
                            <Input
                                value={currentLink}
                                readOnly
                                className="pr-20 pl-4 h-11 text-sm bg-white border-zinc-200 rounded-xl text-zinc-600 focus-visible:ring-violet-500"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button
                                    onClick={() => setEditUrlOpen(true)}
                                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors group text-zinc-400 hover:text-zinc-700"
                                    aria-label="Edit URL"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors group"
                                    aria-label="Copy link"
                                >
                                    {linkCopied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Link className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Social Share Icons */}
                        <div className="flex items-center gap-3 pt-1">
                            <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                                <Twitter className="w-5 h-5 fill-current" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                                <Facebook className="w-5 h-5 fill-current" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                                <Linkedin className="w-5 h-5 fill-current" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Add a custom domain */}
                    <div className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <Label className="text-sm font-semibold text-zinc-900">Add a custom domain</Label>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Collect and share testimonials with a branded URL like <span className="text-violet-600 font-medium bg-violet-50 px-1 py-0.5 rounded">love.www.tc.com</span>.<br />
                                Available on all paid plans.
                            </p>
                        </div>

                        {/* Browser Preview Card */}
                        <div className="bg-zinc-50/50 rounded-xl border border-zinc-200/60 p-4 shadow-sm relative overflow-hidden group">
                            <div className="bg-gradient-to-br from-white to-zinc-50/50 absolute inset-0 z-0" />

                            <div className="relative z-10">
                                {/* Browser Header */}
                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                </div>
                                {/* Address Bar */}
                                <div className="bg-white rounded-lg border border-zinc-200 h-9 flex items-center px-3 gap-2 shadow-sm">
                                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="text-xs text-zinc-600 font-medium">love.www.tc.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Button */}
                        <Button
                            className="h-10 bg-black hover:bg-black/90 text-white font-medium rounded-lg text-sm px-6 shadow-lg shadow-zinc-900/10"
                        >
                            Upgrade
                        </Button>
                    </div>

                    {/* Embed it on your website */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                            Embed it on your website
                            <span className="text-[10px] bg-green-100/80 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-green-200">New</span>
                        </Label>

                        {/* Code Preview */}
                        <div className="relative group">
                            <div className="bg-[#1e1e2e] rounded-xl p-6 min-h-[160px] overflow-hidden shadow-xl shadow-indigo-900/5 ring-1 ring-black/5 flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-0 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                                    <button
                                        onClick={handleCopyCode}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                                    >
                                        {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <pre className="text-[13px] font-mono leading-loose overflow-x-auto text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pb-1">
                                    <code>
                                        <span className="text-[#fca7ea]">&lt;iframe</span>{" "}
                                        <span className="text-[#8bcdef]">id</span>=
                                        <span className="text-[#a6e3a1]">"wall-of-love"</span>{" "}
                                        <span className="text-[#8bcdef]">src</span>=
                                        <span className="text-[#a6e3a1]">"{currentLink}?embed=true"</span>{" "}
                                        <span className="text-[#8bcdef]">style</span>=
                                        <span className="text-[#a6e3a1]">"width:100%; height:100vh; border:none; overflow:hidden;"</span>
                                        <span className="text-[#fca7ea]">&gt;&lt;/iframe&gt;</span>
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <p className="text-xs text-zinc-500">
                            We&apos;ll hide the navigation and logo for you.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 pb-8 bg-white/80 backdrop-blur-sm">
                    <Button
                        onClick={onClose}
                        className="w-full bg-black hover:bg-zinc-800 text-white font-semibold h-12 rounded-xl text-base shadow-xl shadow-zinc-900/5 transition-all active:scale-[0.99]"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </>
    )
}
