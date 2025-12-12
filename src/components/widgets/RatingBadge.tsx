
import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { BadgeWidgetConfig } from "@/types/widget-config"

interface RatingBadgeProps {
    config: BadgeWidgetConfig
    isDarkMode: boolean
}

export function RatingBadge({ config, isDarkMode }: RatingBadgeProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-8 border rounded-2xl mx-auto max-w-xs transition-colors duration-300",
            isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
        )} style={{ borderRadius: `${config.borderRadius}px` }}>
            <div className="text-4xl font-bold">5.0</div>
            <div className="flex gap-1 text-yellow-400 my-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="fill-current w-6 h-6" />)}
            </div>
            <div className="text-sm text-muted-foreground">from 24 testimonials</div>
        </div>
    )
}
