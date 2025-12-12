
import * as React from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { CardWidgetConfig } from "@/types/widget-config"

interface SocialCardProps {
    config: CardWidgetConfig
    testimonial: {
        id: string
        authorName: string
        authorTitle: string
        authorAvatarUrl: string
        rating: number
        content: string
        source: string
        date: string
    }
    handleNextCard?: () => void
    handlePrevCard?: () => void
}

export function SocialCard({
    config,
    testimonial,
    handleNextCard,
    handlePrevCard
}: SocialCardProps) {
    const getContainerStyles = () => {
        const baseStyles: React.CSSProperties = {
            position: 'relative',
        }

        switch (config.cardStyle) {
            case 'minimal':
                return {
                    className: "bg-black border border-zinc-800 shadow-sm",
                    style: { ...baseStyles, borderRadius: `${config.borderRadius}px` }
                }
            case 'modern':
                return {
                    className: "bg-[#18181b] border-y border-r border-border/50 shadow-md",
                    style: {
                        ...baseStyles,
                        borderRadius: `${config.borderRadius}px`,
                        borderLeft: `4px solid ${config.primaryColor}`
                    }
                }
            case 'brutal':
                return {
                    className: "bg-[#111] shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:scale-[1.005] transition-all duration-200 ease-in-out",
                    style: { ...baseStyles, borderRadius: '0px' }
                }
            default:
                return {
                    className: "bg-card border border-border/50 shadow-sm",
                    style: { ...baseStyles, borderRadius: `${config.borderRadius}px` }
                }
        }
    }

    const { className: styleClass, style: styleObject } = getContainerStyles()

    return (
        <div
            className={cn(
                "w-full mx-auto overflow-hidden transition-all duration-300 flex flex-col font-sans text-card-foreground",
                styleClass
            )}
            style={styleObject}
        >
            <div className={cn(
                "h-28 bg-[#5454d4] relative px-6 flex items-center justify-between",
                config.cardStyle === 'brutal' && "border-b-2 border-black"
            )}>
                <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="flex items-center gap-4 z-10">
                    <div className={cn(
                        "h-12 w-12 flex items-center justify-center text-white text-sm font-medium tracking-wide shrink-0",
                        config.cardStyle === 'brutal' ? "bg-[#111113] border-2 border-black rounded-[4px]" : "rounded-full bg-[#111113]"
                    )}>
                        {testimonial.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-[16px] leading-tight">{testimonial.authorName}</span>
                        <span className="text-white/80 text-[13px] font-normal">{testimonial.authorTitle}</span>
                    </div>
                </div>
                {config.showNavigation && (
                    <div className="flex items-center gap-2 z-10">
                        <button onClick={handlePrevCard} className={cn(
                            "h-8 w-8 flex items-center justify-center text-white backdrop-blur-sm transition-colors cursor-pointer",
                            config.cardStyle === 'brutal'
                                ? "bg-[#111113] border border-black hover:bg-zinc-800 rounded-[2px]"
                                : "rounded-full bg-black/20 hover:bg-black/30"
                        )}>
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={handleNextCard} className={cn(
                            "h-8 w-8 flex items-center justify-center text-white transition-colors cursor-pointer",
                            config.cardStyle === 'brutal'
                                ? "bg-[#111113] border border-black hover:bg-zinc-800 rounded-[2px]"
                                : "rounded-full bg-[#111113] hover:bg-black"
                        )}>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 pb-8 space-y-4 bg-[#111113] flex-1">
                <div className="flex items-center justify-between">
                    {config.showRating && (
                        <div className="flex gap-1" style={{ color: config.primaryColor }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("fill-current w-4 h-4", i < testimonial.rating ? "" : "text-zinc-800 fill-zinc-800", config.cardStyle === 'brutal' ? "stroke-0" : "")} style={i < testimonial.rating ? { color: config.primaryColor } : {}} />
                            ))}
                        </div>
                    )}
                    {config.showSourceIcon && (
                        <span className="px-2.5 py-0.5 rounded-[4px] bg-[#1c1c2e] text-[#5b5bd6] text-[10px] font-bold tracking-widest uppercase">
                            {testimonial.source}
                        </span>
                    )}
                </div>

                <div className="relative">
                    <p
                        className="text-zinc-300 text-[15px] leading-[1.5] font-normal"
                        style={{
                            display: 'block',
                            maxHeight: `calc(1.5em * ${config.maxLines})`,
                            overflow: 'hidden',
                            lineHeight: '1.5em'
                        }}
                    >
                        {testimonial.content}
                    </p>
                    <button className="text-sm font-medium hover:underline mt-1 block" style={{ color: config.primaryColor }}>
                        Read more
                    </button>
                </div>

                {config.showDate && (
                    <div className="pt-2 text-zinc-500 text-[13px]">
                        {testimonial.date}
                    </div>
                )}
            </div>
        </div>
    )
}

