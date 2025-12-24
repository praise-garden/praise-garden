"use client"

import * as React from "react"
import { WidgetRecord } from "@/lib/actions/widgets"
import { SocialCard } from "@/components/widgets/SocialCard"
import { MinimalCard } from "@/components/widgets/MinimalCard"
import { RatingBadge } from "@/components/widgets/RatingBadge"
import { PraiseWidget } from "@/components/praise/PraiseWidget"
import {
    WidgetConfig,
    isCardWidget,
    isCollectionWidget,
    isBadgeWidget
} from "@/types/widget-config"
import Logo from "@/components/ui/Logo"

interface PublicWidgetClientProps {
    widget: WidgetRecord
    testimonials?: any[]
}

// Demo testimonials for widgets without selected testimonials
const DEMO_TESTIMONIALS = [
    {
        id: "demo-1",
        authorName: "Sarah Chen",
        authorTitle: "Senior FE Engineer",
        rating: 5,
        content: "This widget builder is an absolute game-changer. I used to spend hours custom-coding testimonials for every landing page. Now I just tweak a few sliders and copy the embed code.",
        source: "TWITTER",
        date: "Oct 15, 2023"
    },
    {
        id: "demo-2",
        authorName: "Mike Ross",
        authorTitle: "Product Designer",
        rating: 5,
        content: "The widget builder is an absolute game-changer. I used to spend hours custom-coding testimonials for every landing page.",
        source: "TWITTER",
        date: "Oct 14, 2023"
    },
]

export default function PublicWidgetClient({ widget, testimonials: initialTestimonials = [] }: PublicWidgetClientProps) {
    // Reconstruct the config
    const config: WidgetConfig = React.useMemo(() => ({
        id: widget.id,
        name: widget.name,
        type: widget.type,
        projectId: widget.project_id,
        createdAt: widget.created_at,
        updatedAt: widget.updated_at,
        ...widget.config,
    } as WidgetConfig), [widget])

    const isDarkMode = config.colorScheme === 'dark' || config.colorScheme === 'auto'

    // Map testimonials to the format expected by the components
    // The backend format is slightly different from what the components expect
    const testimonials = React.useMemo(() => {
        if (initialTestimonials.length > 0) {
            return initialTestimonials.map(t => ({
                id: t.id,
                authorName: t.author_name,
                authorTitle: t.author_title,
                authorAvatar: t.author_avatar_url, // For SocialCard/MinimalCard
                authorAvatarUrl: t.author_avatar_url, // For PraiseWidget
                rating: t.rating,
                content: t.content,
                source: t.source,
                date: t.date,
                type: t.type,
                videoUrl: t.video_url,
                videoThumbnail: t.video_thumbnail,
                attachments: t.attachments
            }))
        }
        return DEMO_TESTIMONIALS
    }, [initialTestimonials])
    const [activeCardIndex, setActiveCardIndex] = React.useState(0)
    const activeTestimonial = testimonials[activeCardIndex % testimonials.length]

    const handleNextCard = () => {
        setActiveCardIndex((prev) => (prev + 1) % testimonials.length)
    }

    const handlePrevCard = () => {
        setActiveCardIndex((prev) => {
            const len = testimonials.length || 1
            return (prev - 1 + len) % len
        })
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-8"
            style={{
                backgroundColor: isDarkMode ? '#09090b' : '#f5f5f7',
                fontFamily: config.fontFamily
            }}
        >
            {/* Widget Container */}
            <div
                className="w-full"
                style={{
                    maxWidth: `${config.maxWidth}px`,
                    fontFamily: config.fontFamily
                }}
            >
                {/* Render based on widget type */}
                {config.type === "social-card" && isCardWidget(config) && (
                    <SocialCard
                        config={config}
                        testimonial={activeTestimonial}
                        handleNextCard={handleNextCard}
                        handlePrevCard={handlePrevCard}
                        isDarkMode={isDarkMode}
                    />
                )}

                {config.type === "minimal-card" && isCardWidget(config) && (
                    <MinimalCard
                        config={config}
                        testimonial={activeTestimonial}
                        isDarkMode={isDarkMode}
                    />
                )}

                {config.type === "rating-badge" && isBadgeWidget(config) && (
                    <RatingBadge
                        config={config}
                        isDarkMode={isDarkMode}
                    />
                )}

                {isCollectionWidget(config) && (
                    <PraiseWidget
                        testimonials={testimonials}
                        layout={config.type === "grid" ? "grid" : config.type === "list-feed" ? "list" : "carousel"}
                        columns={config.columns}
                        showRating={config.showRating}
                        showSource={config.showSourceIcon}
                        compact={false}
                        colorConfig={{
                            primaryColor: config.primaryColor,
                            ratingColor: config.ratingColor,
                            accentColor: config.accentColor,
                            textColor: config.textColor,
                            fontFamily: config.fontFamily,
                        }}
                    />
                )}
            </div>

            {/* Powered By Footer */}
            <div className="mt-8 flex items-center gap-2 text-sm">
                <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>
                    Powered by
                </span>
                <Logo size={20} />
                <span className={isDarkMode ? "text-zinc-300" : "text-zinc-600"} style={{ fontWeight: 600 }}>
                    Trustimonials
                </span>
            </div>
        </div>
    )
}
