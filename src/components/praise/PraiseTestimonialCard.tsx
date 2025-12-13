"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type PraiseTestimonial = {
  id: string
  authorName: string
  authorTitle?: string
  authorAvatarUrl?: string
  rating?: number
  content: string
  source?: string
  date?: string
}

// Color config for theming
export type ColorConfig = {
  primaryColor?: string
  ratingColor?: string
  accentColor?: string
  textColor?: string
}

type Props = React.ComponentProps<typeof Card> & {
  testimonial: PraiseTestimonial
  showRating?: boolean
  showSource?: boolean
  compact?: boolean
  colorConfig?: ColorConfig
}

export function PraiseTestimonialCard({
  testimonial,
  className,
  showRating = true,
  showSource = true,
  compact = false,
  colorConfig,
  ...props
}: Props) {
  const initials = getInitials(testimonial.authorName)
  const stars = typeof testimonial.rating === "number" ? clamp(testimonial.rating, 0, 5) : undefined

  return (
    <Card
      role="article"
      aria-label={`Testimonial by ${testimonial.authorName}`}
      className={cn(
        "h-full",
        compact ? "p-4" : "p-6",
        className
      )}
      {...props}
    >
      <CardContent className={cn("grid gap-4 p-0", compact ? "gap-3" : "gap-4")}>
        {showRating && stars !== undefined ? (
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`${stars} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < stars} color={colorConfig?.ratingColor} />
            ))}
          </div>
        ) : null}

        <blockquote
          className={cn("text-balance text-sm leading-6 md:text-base md:leading-7", compact && "line-clamp-6 md:line-clamp-5")}
          aria-label="Testimonial content"
          style={colorConfig?.textColor ? { color: colorConfig.textColor } : undefined}
        >
          <span className="text-muted-foreground">"</span>
          {testimonial.content}
          <span className="text-muted-foreground">"</span>
        </blockquote>

        <div className="flex items-center gap-3">
          <Avatar className={compact ? "size-8" : "size-10"}>
            {testimonial.authorAvatarUrl ? (
              <AvatarImage src={testimonial.authorAvatarUrl} alt={`${testimonial.authorName}'s avatar`} />
            ) : null}
            <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{testimonial.authorName}</p>
            {(testimonial.authorTitle || (showSource && testimonial.source)) ? (
              <p
                className="truncate text-xs"
                style={colorConfig?.accentColor ? { color: colorConfig.accentColor } : undefined}
              >
                {testimonial.authorTitle}
                {testimonial.authorTitle && showSource && testimonial.source ? " · " : ""}
                {showSource && testimonial.source}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Star({ filled, color }: { filled: boolean; color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="transition-colors"
      style={{
        fill: filled ? (color || '#facc15') : '#3f3f46',
        color: filled ? (color || '#facc15') : '#3f3f46',
      }}
    >
      <path d="M12 .587l3.668 7.568L24 9.75l-6 5.848 1.416 8.26L12 19.771 4.584 23.858 6 15.598 0 9.75l8.332-1.595z" />
    </svg>
  )
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (!parts.length) return "?"
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
  return (first + last).toUpperCase()
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default PraiseTestimonialCard
