"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Star, Twitter, Linkedin, Facebook, MessageSquare } from "lucide-react"
import { VideoPlayer } from "@/components/ui/VideoPlayer"

interface WallEmbedClientProps {
    wall: {
        id: string
        name: string
        config: Record<string, any>
    }
    testimonials: any[]
}

// Card theme definitions
const CARD_THEMES = {
    glassmorphism: {
        cardBg: "bg-white/80 backdrop-blur-xl",
        cardBorder: "border border-white/20",
        textColor: "text-zinc-900",
        subtitleColor: "text-zinc-500",
    },
    brutalist: {
        cardBg: "bg-white",
        cardBorder: "border-2 border-black",
        textColor: "text-black",
        subtitleColor: "text-zinc-600",
    },
    cinematic: {
        cardBg: "bg-zinc-900/90 backdrop-blur-md",
        cardBorder: "border border-zinc-700/50",
        textColor: "text-white",
        subtitleColor: "text-zinc-400",
    },
    classic: {
        cardBg: "bg-white",
        cardBorder: "border border-zinc-200",
        textColor: "text-zinc-900",
        subtitleColor: "text-zinc-500",
    },
}

// Source icon helper - comprehensive mapping
function getSourceIcon(source: string) {
    const s = (source || '').toUpperCase().trim()

    if (s.includes('TWITTER') || s === 'X') {
        return { icon: Twitter, color: 'text-white', bg: 'bg-black' }
    }
    if (s.includes('LINKEDIN')) {
        return { icon: Linkedin, color: 'text-white', bg: 'bg-[#0A66C2]' }
    }
    if (s.includes('FACEBOOK')) {
        return { icon: Facebook, color: 'text-white', bg: 'bg-[#1877F2]' }
    }
    if (s.includes('PLAYSTORE') || s.includes('PLAY STORE') || s.includes('GOOGLE')) {
        return { icon: null, color: 'text-white', bg: 'bg-gradient-to-br from-green-400 via-blue-500 to-red-500', text: 'G' }
    }
    if (s.includes('PRODUCTHUNT') || s.includes('PRODUCT HUNT')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#DA552F]', text: 'P' }
    }
    if (s === 'G2' || s.includes('G2CROWD')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#FF492C]', text: 'G2' }
    }
    if (s.includes('CAPTERRA')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#FF9D28]', text: 'C' }
    }
    if (s.includes('TRUSTPILOT')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#00B67A]', text: 'TP' }
    }
    if (s.includes('INSTAGRAM')) {
        return { icon: null, color: 'text-white', bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', text: 'IG' }
    }
    if (s.includes('YOUTUBE')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#FF0000]', text: 'YT' }
    }
    if (s.includes('TIKTOK')) {
        return { icon: null, color: 'text-white', bg: 'bg-black', text: 'TT' }
    }
    if (s.includes('EMAIL')) {
        return { icon: null, color: 'text-white', bg: 'bg-zinc-700', text: '@' }
    }
    // Manual / Other - Use chat bubble icon like dashboard
    return { icon: MessageSquare, color: 'text-white', bg: 'bg-zinc-700' }
}

export function WallEmbedClient({ wall, testimonials }: WallEmbedClientProps) {
    const config = wall.config || {}
    const cardTheme = CARD_THEMES[config.cardTheme as keyof typeof CARD_THEMES] || CARD_THEMES.classic

    return (
        <>
            {/* Hide scrollbar globally for this page */}
            <style jsx global>{`
                html, body {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                }
            `}</style>
            <div
                className="min-h-screen w-full"
                style={{
                    backgroundColor: config.backgroundColor || "#09090b",
                    fontFamily: config.fontFamily || "Inter"
                }}
            >
                {/* Header */}
                {config.showHeader !== false && (
                    <div className="text-center py-12 px-4">
                        <h1
                            className="text-3xl md:text-4xl font-bold mb-4"
                            style={{ color: config.textColor || "#ffffff" }}
                        >
                            {config.headerTitle || "Wall of Love"}
                        </h1>
                        <p
                            className="text-lg max-w-2xl mx-auto opacity-70"
                            style={{ color: config.textColor || "#ffffff" }}
                        >
                            {config.headerSubtitle || ""}
                        </p>
                    </div>
                )}

                {/* Masonry Grid */}
                <div className="px-4 pb-12 max-w-7xl mx-auto">
                    <div
                        className="columns-1 md:columns-2 lg:columns-3 xl:columns-4"
                        style={{ columnGap: `${config.cardGap || 16}px` }}
                    >
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className={cn(
                                    "break-inside-avoid rounded-xl mb-4 overflow-hidden",
                                    cardTheme.cardBg,
                                    cardTheme.cardBorder
                                )}
                                style={{
                                    boxShadow: config.shadowIntensity > 0
                                        ? `0 4px 20px rgba(0, 0, 0, ${(config.shadowIntensity || 50) / 100 * 0.3})`
                                        : 'none',
                                    borderRadius: `${config.borderRadius || 12}px`
                                }}
                            >
                                {/* Video Testimonial Layout - Check type is video */}
                                {t.type === 'video' && t.video_url ? (
                                    <>
                                        {/* Video Section with Overlay */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <VideoPlayer
                                                url={t.video_url}
                                                poster={t.video_thumbnail}
                                                showControls={true}
                                                showPlayPauseButton={true}
                                                className="w-full h-full"
                                            />

                                            {/* Gradient overlay at bottom */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                                            {/* User info overlaid at bottom-left */}
                                            <div className="absolute bottom-3 left-3 right-16">
                                                {/* Stars - only show if rating exists */}
                                                {t.rating && t.rating > 0 && (
                                                    <div className="flex gap-0.5 mb-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className="w-3.5 h-3.5"
                                                                style={{
                                                                    fill: i < t.rating ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                                                                    color: i < t.rating ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Name with verification */}
                                                <p className="font-semibold text-white text-sm flex items-center gap-1">
                                                    {t.author_name}
                                                    <span className="text-yellow-400">⚡</span>
                                                </p>
                                                {/* Title */}
                                                <p className="text-xs text-white/70">
                                                    {t.author_title}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content below video */}
                                        {t.content && (
                                            <div className="p-4">
                                                <p className={cn("text-sm leading-relaxed break-words", cardTheme.textColor)}
                                                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                                                >
                                                    {t.content}
                                                </p>
                                                {/* Date */}
                                                {t.created_at && (
                                                    <p className="text-xs text-zinc-400 mt-2">
                                                        {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Text Testimonial Layout */
                                    <div className="p-5">
                                        {/* Author row with Source Icon - same line */}
                                        <div className="flex items-center justify-between mb-3">
                                            {/* Author Info */}
                                            <div className="flex items-center gap-3">
                                                {t.author_avatar_url ? (
                                                    <img
                                                        src={t.author_avatar_url}
                                                        alt={t.author_name}
                                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                                                        {t.author_name?.charAt(0) || "?"}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={cn("font-semibold text-sm", cardTheme.textColor)}>
                                                        {t.author_name}
                                                    </p>
                                                    <p className={cn("text-xs", cardTheme.subtitleColor)}>
                                                        {t.author_title}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Source Icon */}
                                            {(() => {
                                                const sourceInfo = getSourceIcon(t.source)
                                                const IconComponent = sourceInfo.icon
                                                return (
                                                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", sourceInfo.bg)}>
                                                        {IconComponent ? (
                                                            <IconComponent className={cn("w-4 h-4", sourceInfo.color)} />
                                                        ) : (
                                                            <span className={cn("text-xs font-bold", sourceInfo.color)}>
                                                                {sourceInfo.text}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })()}
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-0.5 mb-3">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4"
                                                    style={{
                                                        fill: i < t.rating ? (config.accentColor || "#fbbf24") : "#e4e4e7",
                                                        color: i < t.rating ? (config.accentColor || "#fbbf24") : "#e4e4e7",
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Content */}
                                        {t.content && (
                                            <p className={cn("text-sm leading-relaxed break-words", cardTheme.textColor)}
                                                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                                            >
                                                {t.content}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

