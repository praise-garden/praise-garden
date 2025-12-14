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
import { ArrowLeft, Monitor, Smartphone, Tablet, Share2, Star, ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp, Save, Pencil, Heart, X, Search, ListFilter, Twitter } from "lucide-react"
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
import { ModernFontPicker } from "@/components/ui/modern-font-picker"

// ===================== TESTIMONIAL TYPES ===================== //
export interface WidgetTestimonial {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatarUrl?: string;
  rating: number;
  content: string;
  source: string;
  date: string;
}

// ===================== DEFAULT DEMO TESTIMONIALS ===================== //
// Shown when user has no testimonials selected (fallback)
const DEFAULT_DEMO_TESTIMONIALS: WidgetTestimonial[] = [
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
  {
    id: "demo-3",
    authorName: "Amanda Lee",
    authorTitle: "Startup Founder",
    rating: 4,
    content: "This widget builder is an absolute game-changer. Great for quick prototyping.",
    source: "LINKEDIN",
    date: "Oct 13, 2023"
  },
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

// ===================== SELECT TESTIMONIALS MODAL ===================== //
interface SelectTestimonialsModalProps {
  isOpen: boolean
  onClose: () => void
  testimonials: WidgetTestimonial[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

function SelectTestimonialsModal({
  isOpen,
  onClose,
  testimonials,
  selectedIds,
  onSelectionChange
}: SelectTestimonialsModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState<"all" | "5-stars" | "twitter">("all")
  const [localSelectedIds, setLocalSelectedIds] = React.useState<string[]>(selectedIds)

  // Reset local state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds(selectedIds)
      setSearchQuery("")
      setActiveFilter("all")
    }
  }, [isOpen, selectedIds])

  // Filter testimonials based on search and filter
  const filteredTestimonials = React.useMemo(() => {
    return testimonials.filter(t => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      let matchesFilter = true
      if (activeFilter === "5-stars") {
        matchesFilter = t.rating === 5
      } else if (activeFilter === "twitter") {
        matchesFilter = t.source.toUpperCase() === "TWITTER"
      }

      return matchesSearch && matchesFilter
    })
  }, [testimonials, searchQuery, activeFilter])

  const toggleSelection = (id: string) => {
    setLocalSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleSave = () => {
    onSelectionChange(localSelectedIds)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1f] rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[80vh] flex flex-col border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Select Testimonials</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-zinc-800 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search by name or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full border transition-all",
                activeFilter === "all"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300"
              )}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("5-stars")}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full border transition-all",
                activeFilter === "5-stars"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300"
              )}
            >
              5 Stars
            </button>
            <button
              onClick={() => setActiveFilter("twitter")}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full border transition-all",
                activeFilter === "twitter"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300"
              )}
            >
              Twitter
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No testimonials found matching your criteria.
            </div>
          ) : (
            filteredTestimonials.map((t) => {
              const isSelected = localSelectedIds.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleSelection(t.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex gap-3",
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500/50"
                      : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                  )}
                >
                  {/* Checkbox */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      isSelected
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-zinc-600 bg-transparent"
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-indigo-600 text-white shrink-0"
                      >
                        {t.authorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{t.authorName}</p>
                      </div>
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {t.content}
                    </p>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Save Selection ({localSelectedIds.length})
          </Button>
        </div>
      </div>
    </div>
  )
}

// ===================== WALL OF LOVE PREVIEW COMPONENT ===================== //
interface WallOfLovePreviewProps {
  config: WallOfLoveWidgetConfig
  testimonials: WidgetTestimonial[]
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


// ===================== PROPS INTERFACE ===================== //
interface WidgetEditorClientProps {
  widgetId: string;
  userTestimonials: WidgetTestimonial[];
}

export function WidgetEditorClient({ widgetId, userTestimonials }: WidgetEditorClientProps) {
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
  const [isSelectTestimonialsOpen, setIsSelectTestimonialsOpen] = React.useState(false)
  // Initialize with all user testimonials selected by default
  const [selectedTestimonialIds, setSelectedTestimonialIds] = React.useState<string[]>(
    userTestimonials.map(t => t.id)
  )
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

  // @ts-ignore
  const isDarkMode = config.colorScheme === 'dark' || config.colorScheme === 'auto'

  // Filter testimonials based on selection, fallback to defaults if none selected
  const filteredTestimonials = React.useMemo(() => {
    const selected = userTestimonials.filter(t => selectedTestimonialIds.includes(t.id))
    return selected
  }, [userTestimonials, selectedTestimonialIds])

  // Use selected testimonials or fall back to defaults if none selected
  const displayTestimonials = React.useMemo(() => {
    if (filteredTestimonials.length === 0) {
      return DEFAULT_DEMO_TESTIMONIALS
    }
    return filteredTestimonials
  }, [filteredTestimonials])

  const activeTestimonial = displayTestimonials[activeCardIndex % displayTestimonials.length] || displayTestimonials[0]

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % displayTestimonials.length)
  }

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => {
      const len = displayTestimonials.length || 1
      return (prev - 1 + len) % len
    })
  }

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
          {/* Select Testimonials Button */}
          <Button
            variant="outline"
            onClick={() => setIsSelectTestimonialsOpen(true)}
            className="border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2 font-medium"
          >
            <ListFilter className="h-4 w-4" />
            Select Testimonials ({selectedTestimonialIds.length})
          </Button>
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
              style={{
                maxWidth: device === "desktop" ? `${config.maxWidth}px` : undefined,
                fontFamily: config.fontFamily
              }}
            >
              <div className="min-h-[400px] flex flex-col justify-center items-center relative">
                <div className={cn("w-full", isDarkMode ? "dark" : "")} style={{ fontFamily: config.fontFamily }}>

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
                        testimonials={displayTestimonials}
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
                          fontFamily: config.fontFamily,
                        }}
                      />
                    </div>
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
                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-zinc-400">Font Family</Label>
                    <ModernFontPicker
                      value={config.fontFamily}
                      onChange={(font) => updateConfig('fontFamily', font)}
                      compact
                    />
                  </div>

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

      {/* Select Testimonials Modal */}
      <SelectTestimonialsModal
        isOpen={isSelectTestimonialsOpen}
        onClose={() => setIsSelectTestimonialsOpen(false)}
        testimonials={userTestimonials}
        selectedIds={selectedTestimonialIds}
        onSelectionChange={setSelectedTestimonialIds}
      />
    </div>
  )
}
