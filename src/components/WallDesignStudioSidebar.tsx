"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ModernFontPicker } from "@/components/ui/modern-font-picker"
import Logo from "@/components/ui/Logo"

// Types matching page.tsx
export type WallStyle = 'glassmorphism' | 'brutalist' | 'cinematic' | 'bento'
export type TabType = 'templates' | 'style'

// Shared constants (can be passed as props if preferred, but defining structure here for type safety)
export interface TemplateConfig {
    id: string
    name: string
    subtitle: string
    preview: string
}

export interface CardThemeConfig {
    id: string
    name: string
    cardBg: string
    cardBorder: string
    cardShadow: string
}

interface WallDesignStudioSidebarProps {
    isOpen: boolean
    onClose: () => void
    activeTab: TabType
    setActiveTab: (tab: TabType) => void
    activeStyle: WallStyle
    setActiveStyle: (style: WallStyle) => void
    templates: TemplateConfig[]
    cardThemes: CardThemeConfig[]
    activeCardTheme: string
    setActiveCardTheme: (id: string) => void
    backgroundColor: string
    setBackgroundColor: (color: string) => void
    fontFamily: string
    setFontFamily: (font: string) => void
    shadowIntensity: number
    setShadowIntensity: (val: number) => void
    accentColor: string
    setAccentColor: (color: string) => void
    wallTextColor: string
    setWallTextColor: (color: string) => void
    logoSize: number
    setLogoSize: (size: number) => void
    logoUrl: string | null
    setLogoUrl: (url: string | null) => void
    onSelectTestimonials?: () => void
    selectedTestimonialsCount?: number
}

export function WallDesignStudioSidebar({
    isOpen,
    onClose,
    activeTab,
    setActiveTab,
    activeStyle,
    setActiveStyle,
    templates,
    cardThemes,
    activeCardTheme,
    setActiveCardTheme,
    backgroundColor,
    setBackgroundColor,
    fontFamily,
    setFontFamily,
    shadowIntensity,
    setShadowIntensity,
    accentColor,
    setAccentColor,
    wallTextColor,
    setWallTextColor,
    logoSize,
    setLogoSize,
    logoUrl,
    setLogoUrl,
    onSelectTestimonials,
    selectedTestimonialsCount
}: WallDesignStudioSidebarProps) {
    if (!isOpen) return null

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setLogoUrl(url)
        }
    }

    return (
        <div
            className="bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 overflow-hidden transition-all duration-300"
            style={{ width: 'clamp(280px, 22vw, 360px)' }}
        >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-white font-semibold">Studio Controls</h3>
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-white transition-colors p-1 rounded hover:bg-zinc-800"
                    aria-label="Close sidebar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
                {(['templates', 'style'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium transition-all capitalize",
                            activeTab === tab
                                ? "text-violet-400 border-b-2 border-violet-400"
                                : "text-zinc-400 hover:text-zinc-200"
                        )}
                    >
                        {tab === 'templates' ? 'Templates' : 'Style'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Templates Tab */}
                {activeTab === 'templates' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setActiveStyle(template.id as WallStyle)}
                                    className={cn(
                                        "rounded-xl overflow-hidden transition-all border-2",
                                        activeStyle === template.id
                                            ? "border-violet-500 ring-2 ring-violet-500/30"
                                            : "border-zinc-700 hover:border-zinc-600"
                                    )}
                                >
                                    <div className={cn("h-20 flex items-center justify-center", template.preview)}>
                                        {/* Mini preview cards */}
                                        <div className="flex flex-col gap-1 p-2 scale-[0.6]">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={cn(
                                                    "h-4 rounded",
                                                    template.id === 'cinematic' ? 'bg-zinc-700' :
                                                        template.id === 'brutalist' ? 'bg-white border border-black' :
                                                            'bg-white/80'
                                                )} style={{ width: `${50 + i * 10}px` }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-zinc-800 text-left">
                                        <p className="text-xs font-medium text-white">{template.name}</p>
                                        <p className="text-[10px] text-zinc-400">{template.subtitle}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {/* Style Tab */}
                {activeTab === 'style' && (
                    <div className="space-y-8">


                        <div className="space-y-6">
                            {/* Background Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Background Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={backgroundColor}
                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={backgroundColor}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackgroundColor(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs font-mono uppercase"
                                    />
                                </div>
                            </div>

                            {/* Card Theme */}
                            <div className="space-y-3">
                                <Label className="text-xs text-zinc-400">Card Theme</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {cardThemes.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setActiveCardTheme(theme.id)}
                                            className={cn(
                                                "py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                                activeCardTheme === theme.id
                                                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                            )}
                                        >
                                            {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Typography */}
                            <div className="space-y-2">
                                <ModernFontPicker
                                    label="Typography"
                                    value={fontFamily}
                                    onChange={setFontFamily}
                                    compact
                                />
                            </div>

                            {/* Shadow Intensity */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Shadow Intensity</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={shadowIntensity}
                                    onChange={(e) => setShadowIntensity(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                            </div>

                            {/* Accent Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Accent Color</Label>
                                <div className="flex gap-2">
                                    {['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setAccentColor(color)}
                                            className={cn(
                                                "w-8 h-8 rounded-lg transition-all",
                                                accentColor === color && "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Wall Text Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Title Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={wallTextColor}
                                        onChange={(e) => setWallTextColor(e.target.value)}
                                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={wallTextColor}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWallTextColor(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs font-mono uppercase"
                                    />
                                </div>
                            </div>

                            {/* Branding Section - Moved to bottom */}
                            <div className="space-y-4 pt-4 border-t border-zinc-800">
                                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Branding</h4>

                                {/* Logo Preview & Upload */}
                                <div className="space-y-3">
                                    <Label className="text-xs text-zinc-400">Logo</Label>
                                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-800 p-6 flex flex-col items-center justify-center gap-4 relative group">
                                        <div className="h-16 flex items-center justify-center">
                                            {logoUrl ? (
                                                <img
                                                    src={logoUrl}
                                                    alt="Logo preview"
                                                    className="h-full w-auto object-contain"
                                                    style={{ maxHeight: '64px' }}
                                                />
                                            ) : (
                                                <Logo size={48} />
                                            )}
                                        </div>

                                        <div className="flex gap-2 w-full">
                                            <div className="relative flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <Button variant="outline" className="w-full h-8 text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white text-zinc-300 gap-2">
                                                    <Upload className="w-3 h-3" />
                                                    {logoUrl ? 'Change' : 'Upload'}
                                                </Button>
                                            </div>
                                            {logoUrl && (
                                                <Button
                                                    onClick={() => setLogoUrl(null)}
                                                    variant="outline"
                                                    className="h-8 w-8 px-0 bg-zinc-800 border-zinc-700 hover:bg-red-900/20 hover:border-red-900/50 hover:text-red-400 text-zinc-400"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Logo Size */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-zinc-400">Logo Size</Label>
                                        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                                            {logoSize}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20"
                                        max="100"
                                        value={logoSize}
                                        onChange={(e) => setLogoSize(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-violet-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Select Testimonials Button */}
            <div className="p-4 border-t border-zinc-800">
                <Button
                    onClick={onSelectTestimonials}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium"
                >
                    Select Testimonials {selectedTestimonialsCount !== undefined && `(${selectedTestimonialsCount})`}
                </Button>
            </div>
        </div>
    )
}
