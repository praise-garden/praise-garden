"use client"

import * as React from "react"
import { WIDGET_MODELS } from "@/lib/widget-models"
import { WALL_OF_LOVE_MODELS } from "@/lib/wall-of-love-models"
import { PraiseWidget } from "@/components/praise/PraiseWidget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { ArrowLeft, Monitor, Smartphone, Tablet, Share2, Star, ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp, Save, Pencil, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  WidgetConfig,
  WidgetType,
  CardWidgetConfig,
  CollectionWidgetConfig,
  BadgeWidgetConfig,
  WallOfLoveWidgetConfig,
  isCardWidget,
  isCollectionWidget,
  isBadgeWidget,
  isWallOfLoveWidget,
  createWidgetConfig
} from "@/types/widget-config"
import { SocialCard } from "@/components/widgets/SocialCard"
import { MinimalCard } from "@/components/widgets/MinimalCard"
import { RatingBadge } from "@/components/widgets/RatingBadge"

// Testimonials data - Generic models for preview
const DEMO_TESTIMONIALS = [
  {
    id: "test-1",
    authorName: "Sarah Chen",
    authorTitle: "Senior FE Engineer",
    authorAvatarUrl: "/avatars/sarah.jpg",
    rating: 5,
    content: "This widget builder is an absolute game-changer. I used to spend hours custom-coding testimonials for every landing page. Now I just tweak a few sliders and copy the embed code. The design quality is top-notch right out of the box.",
    source: "TWITTER",
    date: "Oct 15, 2023"
  },
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `test-${i + 2}`,
    authorName: `User Name ${i + 2}`,
    authorTitle: "Job Title",
    authorAvatarUrl: "",
    rating: 5,
    content: "This is a placeholder for the testimonial content. It demonstrates how the text will look in the widget layout. The actual content will be populated from your collected testimonials.",
    source: "Source",
    date: "Oct 12, 2025"
  }))
];

const ACCENT_COLORS = [
  { name: "Purple", value: "#8b5cf6", class: "bg-violet-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
  { name: "Green", value: "#10b981", class: "bg-emerald-500" },
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "White", value: "#ffffff", class: "bg-white" },
]

const RATING_COLORS = [
  { name: "Yellow", value: "#fbbf24", class: "bg-amber-400" },
  { name: "Orange", value: "#f59e0b", class: "bg-amber-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Green", value: "#10b981", class: "bg-emerald-500" },
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
  { name: "Purple", value: "#8b5cf6", class: "bg-violet-500" },
]

// ===================== REUSABLE COLOR PICKER FIELD ===================== //
// A single color swatch + hex input field for any color property
interface ColorPickerFieldProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleColorClick = () => {
    inputRef.current?.click()
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value
    // Allow input even without #
    if (!hex.startsWith('#') && hex.length > 0) {
      hex = '#' + hex
    }
    // Basic validation: only update if it looks like a valid hex
    if (/^#([0-9A-Fa-f]{0,6})$/.test(hex) || hex === '') {
      onChange(hex || '#000000')
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-zinc-400">{label}</Label>
      <div className="flex items-center gap-3">
        {/* Hidden native color picker */}
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        {/* Visible color swatch (clickable) */}
        <button
          type="button"
          onClick={handleColorClick}
          className="h-8 w-8 rounded-lg border border-zinc-700 cursor-pointer transition-transform hover:scale-105 shrink-0"
          style={{ backgroundColor: value }}
          aria-label={`Pick ${label}`}
        />
        {/* Hex text input */}
        <Input
          type="text"
          value={value.toUpperCase()}
          onChange={handleHexChange}
          placeholder="#FFFFFF"
          className="h-8 w-28 bg-zinc-900 border-zinc-700 text-white text-xs font-mono uppercase"
        />
      </div>
    </div>
  )
}

// ===================== WALL OF LOVE PREVIEW COMPONENT ===================== //
interface WallOfLovePreviewProps {
  config: WallOfLoveWidgetConfig
  testimonials: typeof DEMO_TESTIMONIALS
  isDarkMode: boolean
}

function WallOfLovePreview({ config, testimonials }: WallOfLovePreviewProps) {
  const { wallStyle } = config

  // Style-specific configurations
  const getStyleConfig = () => {
    switch (wallStyle) {
      case 'glassmorphism':
        return {
          containerBg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          cardBg: 'bg-white/70 backdrop-blur-md',
          cardBorder: 'border border-white/50',
          cardShadow: 'shadow-lg shadow-purple-500/5',
          cardRadius: 'rounded-2xl',
          textColor: 'text-zinc-800',
          subtitleColor: 'text-zinc-500',
        }
      case 'brutalist':
        return {
          containerBg: 'bg-white',
          cardBg: 'bg-yellow-300',
          cardBorder: 'border-2 border-black',
          cardShadow: 'shadow-[4px_4px_0px_0px_#000]',
          cardRadius: 'rounded-none',
          textColor: 'text-black',
          subtitleColor: 'text-zinc-700',
        }
      case 'cinematic':
        return {
          containerBg: 'bg-[#0f0f13]',
          cardBg: 'bg-[#1a1a23]',
          cardBorder: 'border border-purple-500/20',
          cardShadow: 'shadow-lg shadow-purple-500/10',
          cardRadius: 'rounded-xl',
          textColor: 'text-white',
          subtitleColor: 'text-zinc-400',
        }
      case 'bento':
      default:
        return {
          containerBg: 'bg-slate-50',
          cardBg: 'bg-white',
          cardBorder: 'border border-slate-200',
          cardShadow: 'shadow-sm',
          cardRadius: 'rounded-xl',
          textColor: 'text-zinc-900',
          subtitleColor: 'text-zinc-500',
        }
    }
  }

  const styleConfig = getStyleConfig()
  const columnClass = config.columns === 2 ? 'grid-cols-2' :
    config.columns === 3 ? 'grid-cols-3' :
      config.columns === 4 ? 'grid-cols-4' : 'grid-cols-5'

  return (
    <div className={cn("w-full min-h-[500px] overflow-hidden transition-colors", styleConfig.containerBg)}>
      {/* Header */}
      {config.showHeader && (
        <div className="p-8 text-center">
          <h1 className={cn(
            "text-3xl font-bold mb-2",
            wallStyle === 'cinematic' ? 'text-white' : 'text-zinc-900'
          )}>
            {config.headerTitle}
          </h1>
          <p className={cn(
            "text-sm max-w-xl mx-auto mb-1",
            wallStyle === 'cinematic' ? 'text-zinc-400' :
              wallStyle === 'brutalist' ? 'text-zinc-700 font-mono' : 'text-zinc-500'
          )}>
            {wallStyle === 'glassmorphism' && 'Modern Masonry Glassmorphism'}
            {wallStyle === 'brutalist' && 'Neo-Brutalist'}
            {wallStyle === 'cinematic' && 'Cinematic Dark Mode'}
            {wallStyle === 'bento' && 'Strict, Modulay with Bento Grid'}
          </p>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className={cn("p-6 grid gap-4", columnClass)}>
        {testimonials.slice(0, 10).map((t, index) => (
          <div
            key={t.id}
            className={cn(
              "p-4 transition-all",
              styleConfig.cardBg,
              styleConfig.cardBorder,
              styleConfig.cardShadow,
              styleConfig.cardRadius,
              // Brutalist: some cards are dark for contrast
              wallStyle === 'brutalist' && index === 4 && 'bg-zinc-900 text-white',
              // Cinematic: featured card with video placeholder
              wallStyle === 'cinematic' && index === 4 && 'row-span-2 bg-zinc-800/50',
            )}
          >
            {/* Author */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 flex items-center justify-center text-xs font-medium",
                    wallStyle === 'brutalist' ? 'rounded-none bg-black text-white' : 'rounded-full',
                    wallStyle === 'cinematic' && 'ring-2 ring-purple-500/50'
                  )}
                  style={{ backgroundColor: wallStyle !== 'brutalist' ? config.primaryColor : undefined, color: '#fff' }}
                >
                  {t.authorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", styleConfig.textColor,
                    wallStyle === 'brutalist' && index === 4 && 'text-white'
                  )}>
                    {t.authorName}
                  </p>
                  <p className={cn("text-xs", styleConfig.subtitleColor,
                    wallStyle === 'brutalist' && index === 4 && 'text-zinc-400'
                  )}>
                    {t.authorTitle}
                  </p>
                </div>
              </div>
              {/* Company Icon Placeholder */}
              <div className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
                wallStyle === 'cinematic' ? 'bg-purple-500/20 text-purple-400' :
                  wallStyle === 'brutalist' ? 'bg-black text-white border border-black' :
                    'bg-blue-500/10 text-blue-600'
              )}>
                {t.source.charAt(0)}
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2" style={{ color: config.ratingColor }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="fill-current w-3.5 h-3.5" />
              ))}
            </div>

            {/* Content */}
            <p className={cn(
              "text-sm leading-relaxed",
              wallStyle === 'cinematic' && index === 4 ? 'line-clamp-6' : 'line-clamp-4',
              styleConfig.textColor,
              wallStyle === 'brutalist' && index === 4 && 'text-white'
            )}>
              {t.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


export function WidgetEditorClient({ widgetId }: { widgetId: string }) {
  const router = useRouter()

  // Initialize config using the helper from widget-config.ts
  const [config, setConfig] = React.useState<WidgetConfig>(() =>
    createWidgetConfig(widgetId as WidgetType, {
      id: "draft_widget",
      name: "Untitled",
      projectId: "draft"
    })
  )

  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">("desktop")
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["appearance"])
  const [isEditingName, setIsEditingName] = React.useState(false)
  const nameInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [isEditingName])

  const handleNameSave = () => {
    if (config.name.trim() === "") {
      updateConfig("name", "Untitled")
    }
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave()
    }
  }

  // Local state for interactions (not persisted)
  const [activeCardIndex, setActiveCardIndex] = React.useState(0)

  // ===================== Config Update Helpers ===================== //
  // These update the flat config object directly

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value, updatedAt: new Date().toISOString() } as WidgetConfig
      console.log('📦 Config Updated:', JSON.stringify(newConfig, null, 2))
      return newConfig
    })
  }

  const handleWidgetChange = (newWidgetId: string) => {
    // PRESERVE all existing settings from the current config.
    // Only update the 'type' and add type-specific defaults if not already present.

    const newType = newWidgetId as WidgetType
    const now = new Date().toISOString()

    // Start with the EXISTING config (preserving all user settings)
    let updatedConfig: WidgetConfig = {
      ...config,
      type: newType,
      updatedAt: now,
    } as WidgetConfig

    // Add type-specific defaults ONLY if they don't exist on the current config
    if (['social-card', 'minimal-card', 'quote-card'].includes(newType)) {
      updatedConfig = {
        ...updatedConfig,
        cardStyle: (config as any).cardStyle ?? 'minimal',
        maxLines: (config as any).maxLines ?? 4,
        showNavigation: (config as any).showNavigation ?? true,
      } as WidgetConfig
    } else if (['list-feed', 'grid', 'masonry', 'carousel'].includes(newType)) {
      updatedConfig = {
        ...updatedConfig,
        columns: (config as any).columns ?? 1,
        gap: (config as any).gap ?? 16,
        itemsPerPage: (config as any).itemsPerPage ?? 10,
        navigationType: (config as any).navigationType ?? 'arrows',
      } as WidgetConfig
    } else if (['rating-badge', 'trust-badge'].includes(newType)) {
      updatedConfig = {
        ...updatedConfig,
        size: (config as any).size ?? 'medium',
        layout: (config as any).layout ?? 'row',
      } as WidgetConfig
    } else if (['wall-glassmorphism', 'wall-brutalist', 'wall-cinematic', 'wall-bento'].includes(newType)) {
      const wallStyleMap: Record<string, string> = {
        'wall-glassmorphism': 'glassmorphism',
        'wall-brutalist': 'brutalist',
        'wall-cinematic': 'cinematic',
        'wall-bento': 'bento',
      }
      updatedConfig = {
        ...updatedConfig,
        wallStyle: (config as any).wallStyle ?? wallStyleMap[newType] ?? 'glassmorphism',
        headerTitle: (config as any).headerTitle ?? 'Wall of Love',
        headerSubtitle: (config as any).headerSubtitle ?? "We're loved by entrepreneurs, creators, freelancers and agencies from all over the world.",
        showHeader: (config as any).showHeader ?? true,
        columns: (config as any).columns ?? 5,
      } as WidgetConfig
    }

    console.log('🔄 Widget Changed:', newType, JSON.stringify(updatedConfig, null, 2))
    setConfig(updatedConfig)
    // NOTE: We do NOT navigate. The config.type IS the source of truth.
    // The URL widgetId is only used for initial load.
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % DEMO_TESTIMONIALS.length)
  }

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev - 1 + DEMO_TESTIMONIALS.length) % DEMO_TESTIMONIALS.length)
  }

  const activeTestimonial = DEMO_TESTIMONIALS[activeCardIndex]
  // @ts-ignore
  const isDarkMode = config.colorScheme === 'dark' || config.colorScheme === 'auto'

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      {/* TOP HEADER - FULL WIDTH */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b] shrink-0">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                ref={nameInputRef}
                value={config.name}
                onChange={(e) => updateConfig("name", e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                placeholder="Enter Widget Name"
                className="h-8 w-64 bg-zinc-900 border-zinc-700 text-white focus-visible:ring-emerald-500 placeholder:text-zinc-600"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsEditingName(true)}>
              <h1 className="text-xl font-semibold text-white tracking-tight">{config.name}</h1>
              <button
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-medium">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button className="bg-[#6366f1] hover:bg-[#5558dd] text-white gap-2 font-medium">
            <Share2 className="h-4 w-4" />
            Get Embed Code
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - DESIGN LIBRARY */}
        <div className="w-[280px] flex flex-col border-r border-zinc-800 bg-[#0c0c0e] shrink-0">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="pb-2 px-1">
              <Link href="/dashboard/widgets" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wide">
                Design Library
              </Link>
            </div>
            {WIDGET_MODELS.map((widget) => {
              const isActive = config.type === widget.id
              return (
                <button
                  key={widget.id}
                  onClick={() => handleWidgetChange(widget.id)}
                  className={cn(
                    "w-full text-left rounded-xl border transition-all duration-200 overflow-hidden group relative flex flex-col",
                    isActive
                      ? "border-transparent bg-zinc-900/50 ring-1 ring-indigo-500"
                      : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                  )}
                >
                  <div className={cn(
                    "h-28 flex items-center justify-center transition-colors w-full",
                    isActive ? `bg-gradient-to-br ${widget.color}` : "bg-zinc-900/40 group-hover:bg-zinc-800/60"
                  )}>
                    <widget.icon className={cn(
                      "h-8 w-8 transition-colors",
                      isActive ? widget.iconColor : "text-zinc-600 group-hover:text-zinc-500"
                    )} />
                  </div>
                  <div className="p-3 bg-[#0c0c0e]/50 w-full border-t border-zinc-800/50">
                    <h4 className={cn("text-sm font-medium mb-0.5", isActive ? "text-white" : "text-zinc-300")}>
                      {widget.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 leading-relaxed">
                      {widget.description}
                    </p>
                  </div>
                </button>
              )
            })}

            {/* Walls of Love Section */}
            <div className="pt-4 pb-2 px-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wide">
                <Heart className="h-3 w-3" />
                Walls of Love
              </div>
            </div>
            {WALL_OF_LOVE_MODELS.map((wall) => {
              const isActive = config.type === wall.id
              return (
                <button
                  key={wall.id}
                  onClick={() => handleWidgetChange(wall.id)}
                  className={cn(
                    "w-full text-left rounded-xl border transition-all duration-200 overflow-hidden group relative flex flex-col",
                    isActive
                      ? "border-transparent bg-zinc-900/50 ring-1 ring-purple-500"
                      : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                  )}
                >
                  <div className={cn(
                    "h-28 flex items-center justify-center transition-colors w-full",
                    isActive ? `bg-gradient-to-br ${wall.color}` : "bg-zinc-900/40 group-hover:bg-zinc-800/60"
                  )}>
                    <wall.icon className={cn(
                      "h-8 w-8 transition-colors",
                      isActive ? wall.iconColor : "text-zinc-600 group-hover:text-zinc-500"
                    )} />
                  </div>
                  <div className="p-3 bg-[#0c0c0e]/50 w-full border-t border-zinc-800/50">
                    <h4 className={cn("text-sm font-medium mb-0.5", isActive ? "text-white" : "text-zinc-300")}>
                      {wall.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 leading-relaxed">
                      {wall.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                N
              </div>
            </div>
          </div>
        </div>

        {/* CENTER - CANVAS */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto relative flex items-center justify-center p-8 bg-[#09090b]">
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                opacity: 0.8
              }}
            />

            <div
              className={cn(
                "transition-all duration-300 mx-auto z-10",
                device === "mobile" ? "w-[375px]" : device === "tablet" ? "w-[768px]" : "w-full"
              )}
              style={device === "desktop" ? { maxWidth: `${config.maxWidth}px` } : {}}
            >
              <div className="min-h-[400px] flex flex-col justify-center items-center relative">
                <div className={cn("w-full", isDarkMode ? "dark" : "")}>

                  {/* RENDER BASED ON CONFIG TYPE */}
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
                    <div className={cn("transition-all duration-300", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
                      <PraiseWidget
                        testimonials={DEMO_TESTIMONIALS}
                        // @ts-ignore - Temporary mapping
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
                        }}
                      />
                    </div>
                  )}

                  {/* Wall of Love Preview */}
                  {isWallOfLoveWidget(config) && (
                    <WallOfLovePreview
                      config={config}
                      testimonials={DEMO_TESTIMONIALS}
                      isDarkMode={isDarkMode}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - DESIGN & SETTINGS */}
        <div className="w-[340px] flex flex-col border-l border-zinc-800 bg-[#09090b] shrink-0 font-sans">
          <div className="h-20 flex flex-col justify-center px-6 border-b border-zinc-800/50">
            <h2 className="font-semibold text-base text-white">Design Settings</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Customize your design</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Appearance Section */}
            <div className="border-b border-zinc-800/50">
              <button
                onClick={() => toggleSection('appearance')}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-200">Appearance</span>
                </div>
                {expandedSections.includes('appearance') ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
              </button>

              {expandedSections.includes('appearance') && (
                <div className="px-4 pb-6 space-y-6">

                  {/* Card Style (Card widgets only) */}
                  {isCardWidget(config) && (
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-zinc-400">Card Style</Label>
                      <div className="grid grid-cols-3 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                        {(["minimal", "modern", "brutal"] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateConfig('cardStyle', style)}
                            className={cn(
                              "px-2 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                              config.cardStyle === style ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                            )}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========== COLOR SETTINGS ========== */}
                  <ColorPickerField
                    label="Primary Color"
                    value={config.primaryColor}
                    onChange={(v) => updateConfig('primaryColor', v)}
                  />
                  <ColorPickerField
                    label="Rating Color"
                    value={config.ratingColor}
                    onChange={(v) => updateConfig('ratingColor', v)}
                  />
                  <ColorPickerField
                    label="Accent Color"
                    value={config.accentColor}
                    onChange={(v) => updateConfig('accentColor', v)}
                  />
                  <ColorPickerField
                    label="Text Color"
                    value={config.textColor}
                    onChange={(v) => updateConfig('textColor', v)}
                  />

                  {/* Border Radius */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-zinc-400">Border Radius</Label>
                      <span className="text-xs text-zinc-500 font-mono">{config.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={config.borderRadius}
                      onChange={(e) => updateConfig('borderRadius', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Color Scheme */}
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-zinc-400">Color Scheme</Label>
                    <div className="grid grid-cols-3 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                      {(["light", "dark", "auto"] as const).map((scheme) => (
                        <button
                          key={scheme}
                          onClick={() => updateConfig('colorScheme', scheme)}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                            config.colorScheme === scheme ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                          )}
                        >
                          {scheme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Width */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-zinc-400">Max Width</Label>
                      <span className="text-xs text-zinc-500 font-mono">{config.maxWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="1400"
                      step="10"
                      value={config.maxWidth}
                      onChange={(e) => updateConfig('maxWidth', Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* Columns (Collection only) */}
                  {isCollectionWidget(config) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-zinc-400">Columns</Label>
                        <span className="text-xs text-zinc-500 font-mono">{config.columns}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={config.columns}
                        onChange={(e) => updateConfig('columns', Number(e.target.value) as 1 | 2 | 3 | 4)}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="border-b border-zinc-800/50">
              <button
                onClick={() => toggleSection('content')}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-200">Content</span>
                </div>
                {expandedSections.includes('content') ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
              </button>

              {expandedSections.includes('content') && (
                <div className="px-4 pb-6 space-y-4">
                  {isCardWidget(config) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-white">Max Lines</Label>
                        <span className="text-xs text-zinc-500 font-mono">{config.maxLines} lines</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={config.maxLines}
                        onChange={(e) => updateConfig('maxLines', Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                      />
                      <p className="text-[10px] text-zinc-500">Text exceeding this limit will show "Read more".</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Visibility Section */}
            <div className="border-b border-zinc-800/50">
              <button
                onClick={() => toggleSection('visibility')}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-200">Visibility</span>
                </div>
                {expandedSections.includes('visibility') ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
              </button>

              {expandedSections.includes('visibility') && (
                <div className="px-4 pb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Date</Label>
                    <Switch checked={config.showDate} onCheckedChange={(c) => updateConfig('showDate', c)} className="data-[state=checked]:bg-white scale-75" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Source Icon</Label>
                    <Switch checked={config.showSourceIcon} onCheckedChange={(c) => updateConfig('showSourceIcon', c)} className="data-[state=checked]:bg-white scale-75" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Rating Stars</Label>
                    <Switch checked={config.showRating} onCheckedChange={(c) => updateConfig('showRating', c)} className="data-[state=checked]:bg-white scale-75" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Verified Badge</Label>
                    <Switch checked={config.showVerifiedBadge} onCheckedChange={(c) => updateConfig('showVerifiedBadge', c)} className="data-[state=checked]:bg-white scale-75" />
                  </div>
                  {isCardWidget(config) && (
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-zinc-300">Show Navigation</Label>
                      <Switch checked={config.showNavigation} onCheckedChange={(c) => updateConfig('showNavigation', c)} className="data-[state=checked]:bg-white scale-75" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
