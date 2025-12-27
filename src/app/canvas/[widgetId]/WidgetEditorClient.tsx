"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { WIDGET_MODELS } from "@/lib/widget-models"
import { PraiseWidget } from "@/components/praise/PraiseWidget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Monitor, Smartphone, Tablet, Share2, Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Save, Pencil, ListFilter, Loader2, Check } from "lucide-react"
import Link from "next/link"
import {
  WidgetConfig,
  WidgetType,
  isCardWidget,
  isCollectionWidget,
  isBadgeWidget,
  createWidgetConfig
} from "@/types/widget-config"
import { SocialCard } from "@/components/widgets/SocialCard"
import { MinimalCard } from "@/components/widgets/MinimalCard"
import { RatingBadge } from "@/components/widgets/RatingBadge"
import { ModernFontPicker } from "@/components/ui/modern-font-picker"
import { ShareWidgetPanel } from "@/components/widgets/Sharewidgetpanel/ShareWidgetPanel"
import { SelectTestimonialsModal, Testimonial } from "@/components/widgets/SelectTestimonialsModal"
import { useUserData } from "@/contexts/UserDataContext"
import { saveWidget, getWidgetById } from "@/lib/actions/widgets"
import { toast } from "sonner"

// Re-export the Testimonial type for use elsewhere
export type WidgetTestimonial = Testimonial;

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



// ===================== REUSABLE COLOR PICKER FIELD ===================== //
// A single color swatch + hex input field for any color property
interface ColorPickerFieldProps {
  label: string
  value: string
  onChange: (newValue: string) => void
}

function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Ensure value is always a string to prevent crashes
  const safeValue = value || "#000000"

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
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        {/* Visible color swatch (clickable) */}
        <button
          type="button"
          onClick={handleColorClick}
          className="h-8 w-8 rounded-lg border border-zinc-700 cursor-pointer transition-transform hover:scale-105 shrink-0"
          style={{ backgroundColor: safeValue }}
          aria-label={`Pick ${label}`}
        />
        {/* Hex text input */}
        <Input
          type="text"
          value={safeValue.toUpperCase()}
          onChange={handleHexChange}
          placeholder="#FFFFFF"
          className="h-8 w-28 bg-zinc-900 border-zinc-700 text-white text-xs font-mono uppercase"
        />
      </div>
    </div>
  )
}


// ===================== PROPS INTERFACE ===================== //
interface WidgetEditorClientProps {
  widgetId: string;
}

export function WidgetEditorClient({ widgetId }: WidgetEditorClientProps) {
  // Get user testimonials from context
  const { testimonials: dbTestimonials, loading: testimonialsLoading } = useUserData()

  // Transform DB testimonials to the format expected by this component
  const userTestimonials: WidgetTestimonial[] = React.useMemo(() => {
    if (dbTestimonials.length === 0) {
      return DEFAULT_DEMO_TESTIMONIALS
    }
    return dbTestimonials.map(t => ({
      id: t.id,
      type: (t as any).type || 'text',
      authorName: t.author_name,
      authorTitle: t.author_title || '',
      authorAvatarUrl: t.author_avatar_url,
      rating: t.rating ?? 5,
      content: t.content,
      source: t.source,
      date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      videoUrl: (t as any).video_url || null,
      videoThumbnail: (t as any).video_thumbnail || null,
      attachments: (t as any).attachments || [],
    })) as WidgetTestimonial[]
  }, [dbTestimonials])

  // Helper to check if widgetId is a UUID (saved widget) vs widget type
  const isUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

  const isSavedWidget = isUUID(widgetId)

  // Initialize config using the helper from widget-config.ts
  // For new widgets (widget type), create default config
  // For saved widgets (UUID), we'll load from DB in useEffect
  const [config, setConfig] = React.useState<WidgetConfig>(() => {
    if (isSavedWidget) {
      // Placeholder config while loading - will be replaced by DB data
      return createWidgetConfig('social-card' as WidgetType, {
        id: widgetId,
        name: "Loading...",
        projectId: "loading"
      })
    }
    return createWidgetConfig(widgetId as WidgetType, {
      id: "draft_widget",
      name: "Untitled",
      projectId: "draft"
    })
  })

  // Loading state for saved widgets
  const [isLoadingWidget, setIsLoadingWidget] = React.useState(isSavedWidget)

  const router = useRouter()
  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">("desktop")
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["appearance"])
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [isSelectTestimonialsOpen, setIsSelectTestimonialsOpen] = React.useState(false)
  const [isSharePanelOpen, setIsSharePanelOpen] = React.useState(false)
  // Initialize with empty array - will be populated when testimonials load
  const [selectedTestimonialIds, setSelectedTestimonialIds] = React.useState<string[]>([])
  const nameInputRef = React.useRef<HTMLInputElement>(null)

  // Saving state
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [savedWidgetId, setSavedWidgetId] = React.useState<string | null>(isSavedWidget ? widgetId : null)

  // Load saved widget from database
  React.useEffect(() => {
    if (isSavedWidget) {
      loadSavedWidget()
    }
  }, [widgetId])

  const loadSavedWidget = async () => {
    setIsLoadingWidget(true)
    try {
      const result = await getWidgetById(widgetId)
      if (result.data) {
        const savedWidget = result.data
        // Reconstruct full config from saved data
        const fullConfig: WidgetConfig = {
          id: savedWidget.id,
          name: savedWidget.name,
          type: savedWidget.type as WidgetType,
          projectId: savedWidget.project_id,
          createdAt: savedWidget.created_at,
          updatedAt: savedWidget.updated_at,
          ...savedWidget.config,
        } as WidgetConfig

        setConfig(fullConfig)
        setSavedWidgetId(savedWidget.id)

        // Load selected testimonial IDs
        if (savedWidget.selected_testimonial_ids && savedWidget.selected_testimonial_ids.length > 0) {
          setSelectedTestimonialIds(savedWidget.selected_testimonial_ids)
          hasInitializedSelection.current = true
        }
      } else {
        console.error('Failed to load widget:', result.error)
        // Redirect to design page if widget not found
        router.push('/design')
      }
    } catch (error) {
      console.error('Error loading widget:', error)
      router.push('/design')
    } finally {
      setIsLoadingWidget(false)
    }
  }

  // Sync selected IDs when userTestimonials loads (only on first load)
  const hasInitializedSelection = React.useRef(false)
  React.useEffect(() => {
    if (!hasInitializedSelection.current && userTestimonials.length > 0 && selectedTestimonialIds.length === 0) {
      // Only auto-select all if using demo testimonials
      const isDemo = userTestimonials.some(t => t.id.toString().startsWith('demo-'))
      if (isDemo) {
        setSelectedTestimonialIds(userTestimonials.map(t => t.id))
      }
      hasInitializedSelection.current = true
    }
  }, [userTestimonials, selectedTestimonialIds.length])

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
    } else if (['wall-glassmorphism', 'wall-brutalist', 'wall-cinematic', 'wall-classic'].includes(newType)) {
      const wallStyleMap: Record<string, string> = {
        'wall-glassmorphism': 'glassmorphism',
        'wall-brutalist': 'brutalist',
        'wall-cinematic': 'cinematic',
        'wall-classic': 'classic',
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

  // Count of real (non-demo) selected testimonials for display
  const realSelectedCount = React.useMemo(() => {
    return selectedTestimonialIds.filter(id => !id.toString().startsWith('demo-')).length
  }, [selectedTestimonialIds])

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

  // ===================== Save Widget Handler ===================== //
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')

    try {
      // Filter out demo testimonial IDs before saving
      const realTestimonialIds = selectedTestimonialIds.filter(
        id => !id.toString().startsWith('demo-')
      )

      const result = await saveWidget({
        id: savedWidgetId || undefined, // Pass existing ID if we've saved before
        name: config.name.trim(),
        type: config.type,
        config: config as Record<string, any>,
        selectedTestimonialIds: realTestimonialIds,
        status: 'published',
      })

      if (result.success && result.data) {
        setSavedWidgetId(result.data.id)
        setSaveStatus('saved')
        toast.success('Widget saved successfully!')

        // Update URL to reflect the saved widget ID (without full page reload)
        // This allows subsequent saves to update the same widget
        if (!savedWidgetId) {
          // First save - update the URL
          window.history.replaceState({}, '', `/canvas/${result.data.id}`)
        }

        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        console.error('Save failed:', result.error)
        toast.error(result.error || 'Failed to save widget. Please try again.')
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state while fetching saved widget
  if (isLoadingWidget) {
    return (
      <div className="flex flex-col h-screen bg-[#09090b] text-white items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500 mb-4" />
        <p className="text-zinc-400">Loading widget...</p>
      </div>
    )
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
            onClick={() => setIsSelectTestimonialsOpen(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white gap-2 font-medium"
          >
            <ListFilter className="h-4 w-4" />
            Select Testimonials ({realSelectedCount})
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "text-white gap-2 font-medium transition-all",
              saveStatus === 'saved'
                ? "bg-green-600 hover:bg-green-500"
                : saveStatus === 'error'
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-emerald-600 hover:bg-emerald-500"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : saveStatus === 'error' ? (
              <>
                <Save className="h-4 w-4" />
                Error - Retry
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            onClick={async () => {
              if (isSaving) return;
              if (!savedWidgetId) {
                await handleSave();
              }
              setIsSharePanelOpen(true);
            }}
            className="bg-[#6366f1] hover:bg-[#5558dd] text-white gap-2 font-medium"
          >
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
        <div className={cn("flex-1 flex flex-col min-w-0 relative transition-colors duration-300", isDarkMode ? "bg-[#09090b]" : "bg-[#fafafa]")}>
          {/* Canvas Area */}
          <div className={cn(
            "flex-1 overflow-auto relative flex items-start justify-center p-8 pt-12 transition-colors duration-300",
            isDarkMode ? "bg-[#09090b]" : "bg-[#fafafa]"
          )}>
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${isDarkMode ? '#27272a' : '#e4e4e7'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#27272a' : '#e4e4e7'} 1px, transparent 1px)`,
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
              <div className="min-h-[400px] flex flex-col justify-start items-center relative">
                <div id="widget-export-container" className={cn("w-full", isDarkMode ? "dark" : "")} style={{ fontFamily: config.fontFamily }}>

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

      {/* Share Widget Panel */}
      <ShareWidgetPanel
        isOpen={isSharePanelOpen}
        onClose={() => setIsSharePanelOpen(false)}
        widgetId={savedWidgetId || widgetId}
        widgetName={config.name}
      />
    </div>
  )
}
