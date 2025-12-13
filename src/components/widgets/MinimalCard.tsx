
import * as React from "react"
import { Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { CardWidgetConfig } from "@/types/widget-config"

interface MinimalCardProps {
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
    isDarkMode: boolean
}

export function MinimalCard({ config, testimonial, isDarkMode }: MinimalCardProps) {
    const [isTruncated, setIsTruncated] = React.useState(false)
    const textRef = React.useRef<HTMLParagraphElement>(null)

    React.useEffect(() => {
        const checkTruncation = () => {
            if (textRef.current) {
                const { scrollHeight, clientHeight } = textRef.current
                setIsTruncated(scrollHeight > clientHeight)
            }
        }
        const timer = setTimeout(checkTruncation, 50)
        window.addEventListener('resize', checkTruncation)
        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', checkTruncation)
        }
    }, [testimonial, config])

    const getContainerStyles = () => {
        const baseStyles: React.CSSProperties = {
            position: 'relative',
        }

        switch (config.cardStyle) {
            case 'minimal':
                return {
                    className: cn("shadow-sm border transition-colors duration-300", isDarkMode ? "bg-black border-zinc-800" : "bg-white border-zinc-200"),
                    style: { ...baseStyles, borderRadius: `${config.borderRadius}px` }
                }
            case 'modern':
                return {
                    className: cn("border-y border-r border-border/50 shadow-md transition-colors duration-300", isDarkMode ? "bg-[#09090b]" : "bg-white"),
                    style: {
                        ...baseStyles,
                        borderRadius: `${config.borderRadius}px`,
                        borderLeft: `4px solid ${config.primaryColor}`
                    }
                }
            case 'brutal':
                return {
                    className: cn("shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:scale-[1.005] transition-all duration-200 ease-in-out border-2 border-black", isDarkMode ? "bg-[#111]" : "bg-white"),
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
        <div className={cn(
            "flex flex-col p-8 mx-auto w-full transition-colors duration-300 relative text-card-foreground",
            styleClass
        )} style={styleObject}>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-12 w-12 overflow-hidden",
                        config.cardStyle === 'brutal' ? "rounded-none border-2 border-white" : "rounded-full ring-2 ring-zinc-800"
                    )}>
                        {testimonial.authorAvatarUrl ? (
                            <img src={testimonial.authorAvatarUrl} alt={testimonial.authorName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-700 text-zinc-400 font-semibold text-sm">{testimonial.authorName.charAt(0)}</div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className={cn("font-bold text-base", isDarkMode ? "text-white" : "text-black")}>{testimonial.authorName}</span>
                            {config.showVerifiedBadge && (
                                <span style={{ color: config.primaryColor }}>
                                    <Check className="h-4 w-4 fill-current" strokeWidth={3} />
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-zinc-500">{testimonial.authorTitle}</span>
                    </div>
                </div>

                {config.showSourceIcon && (
                    <div style={{ color: config.primaryColor }}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                    </div>
                )}
            </div>

            {config.showRating && (
                <div className="flex gap-1 mb-4" style={{ color: config.ratingColor }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("fill-current w-5 h-5", config.cardStyle === 'brutal' ? "stroke-0" : "")} />
                    ))}
                </div>
            )}

            <div className="relative">
                <p
                    ref={textRef}
                    className="text-[15px] leading-relaxed font-normal mb-2"
                    style={{
                        color: config.textColor,
                        display: 'block',
                        maxHeight: `calc(1.625em * ${config.maxLines})`,
                        overflow: 'hidden',
                        lineHeight: '1.625em',
                        wordBreak: 'break-word'
                    }}
                >
                    {testimonial.content}
                </p>
                {isTruncated && (
                    <button className="text-sm font-medium hover:underline mt-1 block" style={{ color: config.accentColor }}>
                        Read more
                    </button>
                )}
            </div>

            {config.showDate && (
                <div className="mt-8 text-sm text-zinc-500 font-medium">
                    {testimonial.date}
                </div>
            )}
        </div>
    )
}
