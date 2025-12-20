"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, LayoutGrid, Save, Heart, Play, Star } from "lucide-react"
import { WIDGET_MODELS } from "@/lib/widget-models"
import { cn } from "@/lib/utils"

// Demo testimonials for Wall of Love previews
const DEMO_TESTIMONIALS = [
  { name: "Joe Rogan", title: "Entrepreneur & Podcaster", content: "We solve web and mobile design problems with clarity and precision." },
  { name: "Celia Tinson", title: "Founder @ SQUAD", content: "Pretty much everyone who approaches for frontend work is extremely talented." },
  { name: "Steve Deno", title: "Animator", content: "This is really useful. Had to share this with everyone at my company." },
  { name: "Marc Cooper", title: "Designer at DevLabs", content: "This was like a whole project for the team but this widget made it so easy." },
  { name: "Nitish Singh", title: "Product Lead", content: "Congrats on the launch! amazing product. This is amazing and saving lots." },
  { name: "John Smith", title: "CEO @ StartupCo", content: "Have the ops for revenues, bumping your latest project on us." },
]

// Wall of Love template - Only Classic
const WALL_TEMPLATES = [
  {
    id: "classic",
    styleId: "classic",
    name: "Classic",
    description: "Create a beautiful, shareable Wall of Love with your best testimonials",
    bgColor: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
    cardBg: "bg-white",
    textColor: "text-zinc-900",
    accentColor: "text-purple-500",
    borderColor: "border-zinc-200",
  },
]

// Mini testimonial card for preview
function MiniTestimonialCard({
  testimonial,
  template,
  isSmall = false
}: {
  testimonial: typeof DEMO_TESTIMONIALS[0]
  template: typeof WALL_TEMPLATES[0]
  isSmall?: boolean
}) {
  return (
    <div className={cn(
      "rounded-lg p-2 transition-all border",
      template.cardBg,
      template.borderColor
    )}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
          {testimonial.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <p className={cn("text-[7px] font-semibold truncate leading-tight", template.textColor)}>
            {testimonial.name}
          </p>
          <p className={cn("text-[5px] truncate opacity-60", template.textColor)}>
            {testimonial.title}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={cn("w-2 h-2 fill-current", template.accentColor)} />
        ))}
      </div>
      {!isSmall && (
        <p className={cn("text-[6px] line-clamp-2 leading-relaxed opacity-80", template.textColor)}>
          {testimonial.content}
        </p>
      )}
    </div>
  )
}

// Wall of Love template preview card
function WallTemplateCard({ template }: { template: typeof WALL_TEMPLATES[0] }) {
  return (
    <Link
      href={`/wall-of-love/${template.styleId}`}
      className="group block"
    >
      <div className="relative rounded-xl overflow-hidden border border-zinc-800 transition-all duration-300 hover:border-zinc-600 hover:shadow-xl hover:-translate-y-1">
        {/* Play button */}
        <button className="absolute top-3 left-3 z-10 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center border border-zinc-600/50 group-hover:bg-violet-600 transition-colors">
          <Play className="w-3 h-3 text-white fill-white" />
        </button>

        {/* Preview area */}
        <div className={cn("p-4 min-h-[200px]", template.bgColor)}>
          {/* Header */}
          <div className="text-center mb-3">
            <h3 className={cn("text-sm font-bold", template.textColor)}>Testimonials for Bungee</h3>
            <p className={cn("text-[8px] opacity-60 mt-0.5", template.textColor)}>
              We're loved by entrepreneurs, creators, freelancers and agencies from all over the world.
            </p>
            <button className={cn(
              "mt-2 px-3 py-1 text-[8px] font-medium rounded-full",
              template.id === "brutalist"
                ? "bg-black text-white"
                : "bg-violet-600 text-white"
            )}>
              Get back home
            </button>
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-3 gap-2">
            {DEMO_TESTIMONIALS.slice(0, 6).map((testimonial, i) => (
              <MiniTestimonialCard
                key={i}
                testimonial={testimonial}
                template={template}
                isSmall={i > 2}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function WidgetsPage() {
  const [activeTab, setActiveTab] = useState<"widgets" | "walls-of-love">("widgets")

  const tabs = [
    { label: "Saved", icon: Save, id: "saved" as const, active: false },
    { label: "Widgets", icon: LayoutGrid, id: "widgets" as const, active: activeTab === "widgets" },
    { label: "Walls of Love", icon: Heart, id: "walls-of-love" as const, active: activeTab === "walls-of-love" },
  ]

  return (
    <div className="min-h-full bg-[#09090b] text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Social Proof Studio</h1>
            <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-zinc-400">What would you like to create?</p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {tabs.map((tab) => (
              <Button
                key={tab.label}
                variant="ghost"
                onClick={() => {
                  if (tab.id === "widgets" || tab.id === "walls-of-love") {
                    setActiveTab(tab.id)
                  }
                }}
                className={cn(
                  "h-10 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 gap-2 rounded-lg px-4",
                  tab.active && "border-zinc-700 bg-zinc-800 text-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Widgets Section */}
        {activeTab === "widgets" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Widgets</h2>
              <p className="text-zinc-500 text-sm">
                Embed testimonials on your website without code.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WIDGET_MODELS.map((widget) => (
                <Link key={widget.id} href={`/canvas/${widget.id}`} className="group block h-full">
                  <div className="h-full bg-[#111] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:-translate-y-1">

                    {/* Preview Area */}
                    <div className="aspect-[4/3] bg-[#0c0c0e] relative p-6 flex items-center justify-center group-hover:bg-[#151518] transition-colors">
                      <widget.icon className={cn("h-16 w-16 opacity-20 transition-all group-hover:opacity-100 group-hover:scale-110", widget.iconColor)} />

                      {widget.tag && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20">
                          {widget.tag}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 border-t border-zinc-800 bg-[#111]">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-zinc-200">{widget.name}</h3>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-1">{widget.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Walls of Love Section */}
        {activeTab === "walls-of-love" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Walls of Love</h2>
              <p className="text-zinc-500 text-sm">
                Create a beautiful, shareable Wall of Love with your best testimonials
              </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WALL_TEMPLATES.map((template) => (
                <WallTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
