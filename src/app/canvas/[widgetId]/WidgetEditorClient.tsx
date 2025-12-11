"use client"

import * as React from "react"
import { WIDGET_MODELS } from "@/lib/widget-models"
import { PraiseWidget } from "@/components/praise/PraiseWidget"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ArrowLeft, Monitor, Smartphone, Tablet, Share2, Star, ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Testimonials data - Generic models for preview
const DEMO_TESTIMONIALS = [
  {
    id: "test-1",
    authorName: "Sarah Chen",
    authorTitle: "Senior FE Engineer",
    authorAvatarUrl: "/avatars/sarah.jpg", // Placeholder, will fallback to initials if not found
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

export function WidgetEditorClient({ widgetId }: { widgetId: string }) {
  const router = useRouter()
  // Default to first widget if widgetId not found in models
  const initialWidget = WIDGET_MODELS.find(w => w.id === widgetId) || WIDGET_MODELS[0]
  const [currentWidgetId, setCurrentWidgetId] = React.useState(initialWidget.id)
  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">("desktop")
  
  // Design State
  const [fontFamily, setFontFamily] = React.useState("Inter")
  const [isDarkMode, setIsDarkMode] = React.useState(true)
  const [cardRadius, setCardRadius] = React.useState(16)
  
  // New Design State
  const [cardTheme, setCardTheme] = React.useState<"Minimal" | "Social" | "Glass">("Minimal")
  const [accentColor, setAccentColor] = React.useState("#6366f1") // Indigo default
  const [colorScheme, setColorScheme] = React.useState<"Light" | "Dark" | "Auto">("Dark")
  const [maxWidth, setMaxWidth] = React.useState(1200)
  
  // Expanded State for Accordions
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["appearance"])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    )
  }

  const ACCENT_COLORS = [
    { name: "Purple", value: "#8b5cf6", class: "bg-violet-500" },
    { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
    { name: "Green", value: "#10b981", class: "bg-emerald-500" },
    { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
    { name: "Orange", value: "#f97316", class: "bg-orange-500" },
    { name: "Red", value: "#ef4444", class: "bg-red-500" },
    { name: "White", value: "#ffffff", class: "bg-white" },
  ]
  
  // Content State
  const [showRating, setShowRating] = React.useState(true)
  const [showSource, setShowSource] = React.useState(true)
  const [showDate, setShowDate] = React.useState(true)
  const [showVerifiedBadge, setShowVerifiedBadge] = React.useState(true)
  const [maxLines, setMaxLines] = React.useState(4)
  
  // Social Card State
  const [activeCardIndex, setActiveCardIndex] = React.useState(0)
  
  // Truncation State
  const [isTruncated, setIsTruncated] = React.useState(false)
  const textRef = React.useRef<HTMLParagraphElement>(null)

  const currentWidget = WIDGET_MODELS.find(w => w.id === currentWidgetId) || WIDGET_MODELS[0]
  
  const handleWidgetChange = (id: string) => {
    setCurrentWidgetId(id)
    router.push(`/canvas/${id}`, { scroll: false })
  }

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % DEMO_TESTIMONIALS.length)
  }

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev - 1 + DEMO_TESTIMONIALS.length) % DEMO_TESTIMONIALS.length)
  }
  
  const activeTestimonial = DEMO_TESTIMONIALS[activeCardIndex]

  // Check for truncation
  React.useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // We compare scrollHeight to clientHeight to see if text is clamped
        // But with line-clamp, clientHeight is constrained.
        // A better check for line-clamp often involves checking scrollHeight > clientHeight
        // However, some browsers report different values.
        // Let's rely on scrollHeight > clientHeight
        const { scrollHeight, clientHeight } = textRef.current
        setIsTruncated(scrollHeight > clientHeight)
      }
    }

    // Small timeout to allow layout to settle
    const timer = setTimeout(checkTruncation, 50)
    window.addEventListener('resize', checkTruncation)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkTruncation)
    }
  }, [activeTestimonial, maxLines, maxWidth, device, cardRadius])

  // Preview container width based on device
  const getContainerWidth = () => {
    switch (device) {
      case "mobile": return "375px"
      case "tablet": return "768px"
      default: return "100%"
    }
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      {/* LEFT SIDEBAR - WIDGET LIBRARY */}
      <div className="w-[280px] flex flex-col border-r border-zinc-800 bg-[#0c0c0e] shrink-0">
        <div className="h-16 flex items-center px-4 border-b border-zinc-800">
          <Link href="/dashboard/widgets" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wide">
            <ArrowLeft className="h-3.5 w-3.5" />
            Widget Library
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {WIDGET_MODELS.map((widget) => {
             const isActive = currentWidgetId === widget.id
             return (
              <button
                key={widget.id}
                onClick={() => handleWidgetChange(widget.id)}
                className={cn(
                  "w-full text-left rounded-xl border transition-all duration-200 overflow-hidden group relative flex flex-col",
                  isActive 
                    ? `border-transparent bg-zinc-900/50 ring-1 ring-${widget.activeBorder?.split('-')[1] || 'indigo'}-500` 
                    : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                )}
                style={isActive ? { borderColor: 'transparent', boxShadow: `0 0 0 1px ${widget.activeBorder ? 'var(--tw-ring-color)' : '#6366f1'}` } : {}}
              >
                {/* Preview Area */}
                <div className={cn(
                  "h-28 flex items-center justify-center transition-colors w-full",
                  isActive 
                    ? `bg-gradient-to-br ${widget.color}` 
                    : "bg-zinc-900/40 group-hover:bg-zinc-800/60"
                )}>
                  <widget.icon className={cn(
                    "h-8 w-8 transition-colors",
                    isActive ? widget.iconColor : "text-zinc-600 group-hover:text-zinc-500"
                  )} />
                </div>
                
                {/* Text Area */}
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
        
        {/* User profile or bottom actions could go here */}
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
        {/* Top Bar */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b]">
          {/* Device Toggles */}
          <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setDevice("desktop")}
              className={cn(
                "p-2 rounded-md transition-all",
                device === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={cn(
                "p-2 rounded-md transition-all",
                device === "tablet" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={cn(
                "p-2 rounded-md transition-all",
                device === "mobile" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button className="bg-[#6366f1] hover:bg-[#5558dd] text-white gap-2 font-medium">
              <Share2 className="h-4 w-4" />
              Get Embed Code
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className={cn(
          "flex-1 overflow-auto relative flex items-center justify-center p-8",
          colorScheme === "Light" ? "bg-zinc-100" : "bg-[#09090b]" 
        )}>
           {/* Grid Background Pattern */}
           <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(${colorScheme === "Light" ? "#e4e4e7" : "#27272a"} 1px, transparent 1px), linear-gradient(90deg, ${colorScheme === "Light" ? "#e4e4e7" : "#27272a"} 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               opacity: 0.8
             }}
           />
           
           <div 
             className={cn(
               "transition-all duration-300 mx-auto z-10",
               device === "mobile" ? "w-[375px]" : device === "tablet" ? "w-[768px]" : "w-full"
             )}
             style={device === "desktop" ? { maxWidth: `${maxWidth}px` } : {}}
           >
             <div className={cn(
               "min-h-[400px] flex flex-col justify-center items-center relative",
             )}>
                <div className={cn("w-full", isDarkMode ? "dark" : "")}>
                  {currentWidget.id === "social-card" ? (
                    <div 
                      className="w-full mx-auto bg-[#18181b] overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 flex flex-col font-sans relative"
                      style={{ borderRadius: `${cardRadius}px` }}
                    >
                      {/* Card Header with Solid Color */}
                      <div className="h-28 bg-[#5454d4] relative px-6 flex items-center justify-between">
                        {/* Decorative subtle circles */}
                        <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        <div className="flex items-center gap-4 z-10">
                          <div className="h-12 w-12 rounded-full bg-[#111113] flex items-center justify-center text-white text-sm font-medium tracking-wide shrink-0">
                             {/* Initials */}
                            {activeTestimonial.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-[16px] leading-tight">{activeTestimonial.authorName}</span>
                            <span className="text-white/80 text-[13px] font-normal">{activeTestimonial.authorTitle}</span>
                          </div>
                        </div>
                        
                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2 z-10">
                           <button 
                              onClick={handlePrevCard}
                              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors cursor-pointer"
                           >
                             <ChevronLeft className="h-4 w-4" />
                           </button>
                           <button 
                              onClick={handleNextCard}
                              className="h-8 w-8 rounded-full bg-[#111113] hover:bg-black flex items-center justify-center text-white transition-colors cursor-pointer"
                           >
                             <ChevronRight className="h-4 w-4" />
                           </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 pb-8 space-y-4 bg-[#111113] flex-1">
                        <div className="flex items-center justify-between">
                           {showRating && (
                             <div className="flex gap-1" style={{ color: accentColor }}>
                               {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={cn(
                                      "fill-current w-4 h-4", 
                                      i < activeTestimonial.rating ? "" : "text-zinc-800 fill-zinc-800"
                                    )} 
                                    style={i < activeTestimonial.rating ? { color: accentColor } : {}}
                                  />
                               ))}
                             </div>
                           )}
                           
                           {showSource && (
                             <span className="px-2.5 py-0.5 rounded-[4px] bg-[#1c1c2e] text-[#5b5bd6] text-[10px] font-bold tracking-widest uppercase">
                               {activeTestimonial.source}
                             </span>
                           )}
                        </div>

                        <div className="relative">
                          <p 
                            className="text-zinc-300 text-[15px] leading-[1.5] font-normal"
                            style={{
                              display: 'block',
                              maxHeight: `calc(1.5em * ${maxLines})`,
                              overflow: 'hidden',
                              lineHeight: '1.5em'
                            }}
                          >
                            {activeTestimonial.content}
                          </p>
                          {/* Logic to show Read more would need a ref here too for Social Card, but strictly following user request for "Minimal Card style behavior" on Social Card as implied by context switch */}
                          <button className="text-sm font-medium hover:underline mt-1 block" style={{ color: accentColor }}>
                              Read more
                          </button>
                        </div>

                        {showDate && (
                          <div className="pt-2 text-zinc-500 text-[13px]">
                            {activeTestimonial.date}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : currentWidget.id === "minimal-card" ? (
                    <div className={cn(
                       "flex flex-col p-8 border border-zinc-800/50 rounded-3xl mx-auto w-full transition-colors duration-300 relative shadow-2xl",
                       isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-white text-zinc-900"
                     )} style={{ borderRadius: `${cardRadius}px` }}>
                        
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-zinc-800 overflow-hidden ring-2 ring-zinc-800">
                                 {/* Avatar placeholder if no image */}
                                 {activeTestimonial.authorAvatarUrl ? (
                                   <img src={activeTestimonial.authorAvatarUrl} alt={activeTestimonial.authorName} className="w-full h-full object-cover" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center bg-zinc-700 text-zinc-400 font-semibold text-sm">
                                      {activeTestimonial.authorName.charAt(0)}
                                   </div>
                                 )}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-base text-white">{activeTestimonial.authorName}</span>
                                  {showVerifiedBadge && (
                                    <span style={{ color: accentColor }}>
                                      <Check className="h-4 w-4 fill-current" strokeWidth={3} />
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-zinc-500">{activeTestimonial.authorTitle || "Senior FE Engineer"}</span>
                              </div>
                           </div>
                           
                           {showSource && (
                             <div className="text-[#1DA1F2]">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                             </div>
                           )}
                        </div>

                        {showRating && (
                          <div className="flex gap-1 mb-4" style={{ color: accentColor }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="fill-current w-5 h-5" />
                            ))}
                          </div>
                        )}
                        
                        <div className="relative">
                          <p 
                            ref={textRef}
                            className="text-[15px] text-zinc-300 leading-relaxed font-normal mb-2"
                            style={{ 
                              display: 'block',
                              maxHeight: `calc(1.625em * ${maxLines})`,
                              overflow: 'hidden',
                              lineHeight: '1.625em',
                              wordBreak: 'break-word'
                            }}
                          >
                            {activeTestimonial.content}
                          </p>
                          {isTruncated && (
                            <button className="text-sm font-medium hover:underline mt-1 block" style={{ color: accentColor }}>
                              Read more
                            </button>
                          )}
                        </div>

                        {showDate && (
                          <div className="mt-8 text-sm text-zinc-500 font-medium">
                            {activeTestimonial.date}
                          </div>
                        )}
                     </div>
                  ) : currentWidget.type === "badge" ? (
                     <div className={cn(
                       "flex flex-col items-center justify-center p-8 border rounded-2xl mx-auto max-w-xs transition-colors duration-300",
                       isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
                     )} style={{ borderRadius: `${cardRadius}px` }}>
                        <div className="text-4xl font-bold">5.0</div>
                        <div className="flex gap-1 text-yellow-400 my-2">
                          <Star className="fill-current w-6 h-6" />
                          <Star className="fill-current w-6 h-6" />
                          <Star className="fill-current w-6 h-6" />
                          <Star className="fill-current w-6 h-6" />
                          <Star className="fill-current w-6 h-6" />
                        </div>
                        <div className="text-sm text-muted-foreground">from 24 testimonials</div>
                     </div>
                  ) : (
                    <div className={cn(
                      "transition-all duration-300",
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    )}>
                      <PraiseWidget 
                        testimonials={DEMO_TESTIMONIALS}
                        // @ts-ignore
                        layout={currentWidget.type === "grid" ? "grid" : currentWidget.type === "carousel" ? "carousel" : "list"}
                        columns={currentWidget.type === "grid" ? 3 : 1}
                        showRating={showRating}
                        showSource={showSource}
                        compact={false}
                        className={cn(
                           // Apply styles that might affect internal cards
                        )}
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
          <h2 className="font-semibold text-base text-white">Widget Settings</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Customize your single testimonial widget</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Appearance Section */}
          <div className="border-b border-zinc-800/50">
            <button 
              onClick={() => toggleSection('appearance')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
                </span>
                <span className="text-sm font-medium text-zinc-200">Appearance</span>
              </div>
              {expandedSections.includes('appearance') ? (
                <ChevronUp className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              )}
            </button>
            
            {expandedSections.includes('appearance') && (
              <div className="px-4 pb-6 space-y-6">
                {/* Card Theme */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-zinc-400">Card Theme</Label>
                  <div className="grid grid-cols-3 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    {["Minimal", "Social", "Glass"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setCardTheme(theme as any)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                          cardTheme === theme 
                            ? "bg-white text-black shadow-sm" 
                            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                        )}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-zinc-400">Accent Color</Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setAccentColor(color.value)}
                        className={cn(
                          "h-6 w-6 rounded-full transition-all ring-offset-2 ring-offset-[#09090b]",
                          color.class,
                          accentColor === color.value 
                            ? "ring-2 ring-white scale-110" 
                            : "hover:scale-110 opacity-80 hover:opacity-100"
                        )}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Roundness */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-400">Card Roundness</Label>
                    <span className="text-xs text-zinc-500 font-mono">{cardRadius}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="32" 
                    value={cardRadius} 
                    onChange={(e) => setCardRadius(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-zinc-200"
                  />
                </div>

                {/* Color Scheme */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-zinc-400">Color Scheme</Label>
                  <div className="grid grid-cols-3 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    {["Light", "Dark", "Auto"].map((scheme) => (
                      <button
                        key={scheme}
                        onClick={() => setColorScheme(scheme as any)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                          colorScheme === scheme 
                            ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" 
                            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
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
                    <Label className="text-xs font-medium text-zinc-400">Max Width ({maxWidth}px)</Label>
                  </div>
                  <input 
                    type="range" 
                    min="300" 
                    max="1400" 
                    step="10"
                    value={maxWidth} 
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-zinc-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Logic Section */}
          <div className="border-b border-zinc-800/50">
            <button 
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </span>
                <span className="text-sm font-medium text-zinc-200">Content Logic</span>
              </div>
              {expandedSections.includes('content') ? (
                <ChevronUp className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              )}
            </button>
            
            {expandedSections.includes('content') && (
              <div className="px-4 pb-6 space-y-4">
                 {/* Max Lines */}
                 <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-white">Max Lines</Label>
                    <span className="text-xs text-zinc-500 font-mono">{maxLines} lines</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={maxLines} 
                    onChange={(e) => setMaxLines(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-zinc-200"
                  />
                  <p className="text-[10px] text-zinc-500">Text exceeding this limit will show a "Read more" link.</p>
                </div>
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
                <span className="text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </span>
                <span className="text-sm font-medium text-zinc-200">Visibility</span>
              </div>
              {expandedSections.includes('visibility') ? (
                <ChevronUp className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              )}
            </button>
            
            {expandedSections.includes('visibility') && (
              <div className="px-4 pb-6 space-y-4">
                 <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Date</Label>
                    <Switch 
                      checked={showDate} 
                      onCheckedChange={setShowDate}
                      className="data-[state=checked]:bg-white scale-75" 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Source Icon</Label>
                    <Switch 
                      checked={showSource} 
                      onCheckedChange={setShowSource}
                      className="data-[state=checked]:bg-white scale-75" 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Rating Stars</Label>
                    <Switch 
                      checked={showRating} 
                      onCheckedChange={setShowRating}
                      className="data-[state=checked]:bg-white scale-75" 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-300">Show Verified Badge</Label>
                    <Switch 
                      checked={showVerifiedBadge} 
                      onCheckedChange={setShowVerifiedBadge}
                      className="data-[state=checked]:bg-white scale-75" 
                    />
                 </div>
              </div>
            )}
          </div>

          {/* Growth & SEO Section */}
          <div className="border-b border-zinc-800/50">
            <button 
              onClick={() => toggleSection('growth')}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </span>
                <span className="text-sm font-medium text-zinc-200">Growth & SEO</span>
              </div>
              {expandedSections.includes('growth') ? (
                <ChevronUp className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
