"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ModernFontPicker } from "@/components/ui/modern-font-picker"
import Logo from "@/components/ui/Logo"
import { WallConfig, UpdateConfigFn } from "@/types/wall-config"

// ================================================================= //
//                           TYPES                                   //
// ================================================================= //

export type WallStyle = WallConfig['style']
export type TabType = 'templates' | 'style'

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

// ================================================================= //
//                         PROPS INTERFACE                           //
// ================================================================= //

interface WallDesignStudioSidebarProps {
    // Sidebar UI state
    isOpen: boolean
    onClose: () => void
    activeTab: TabType
    setActiveTab: (tab: TabType) => void

    // Configuration (single config object)
    config: WallConfig
    updateConfig: UpdateConfigFn

    // Template data (passed from parent)
    templates: TemplateConfig[]
    cardThemes: CardThemeConfig[]

    // Testimonial selection
    onSelectTestimonials?: () => void
    selectedTestimonialsCount?: number
}

// ================================================================= //
//                         COMPONENT                                 //
// ================================================================= //

export function WallDesignStudioSidebar({
    isOpen,
    onClose,
    activeTab,
    setActiveTab,
    config,
    updateConfig,
    templates,
    cardThemes,
    onSelectTestimonials,
    selectedTestimonialsCount
}: WallDesignStudioSidebarProps) {

    if (!isOpen) return null

    // ===================== HANDLERS ===================== //

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            updateConfig('logoUrl', url)
        }
    }

    const handleRemoveLogo = () => {
        updateConfig('logoUrl', null)
    }

    // ===================== RENDER ===================== //

    return (
        <div
            className="bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 overflow-hidden transition-all duration-300"
            style={{ width: 'clamp(280px, 22vw, 360px)' }}
        >
            {/* ===================== HEADER ===================== */}
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

            {/* ===================== TABS ===================== */}
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

            {/* ===================== TAB CONTENT ===================== */}
            <div className="flex-1 overflow-y-auto p-4">

                {/* =================== TEMPLATES TAB =================== */}
                {activeTab === 'templates' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => updateConfig('style', template.id as WallConfig['style'])}
                                    className={cn(
                                        "rounded-xl overflow-hidden transition-all border-2",
                                        config.style === template.id
                                            ? "border-violet-500 ring-2 ring-violet-500/30"
                                            : "border-zinc-700 hover:border-zinc-600"
                                    )}
                                >
                                    <div className={cn("h-20 flex items-center justify-center", template.preview)}>
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

                {/* =================== STYLE TAB =================== */}
                {activeTab === 'style' && (
                    <div className="space-y-8">
                        <div className="space-y-6">

                            {/* Background Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Background Color</Label>
                                <div className="flex gap-3">
                                    <div className="relative w-10 h-10 shrink-0">
                                        <input
                                            type="color"
                                            value={config.backgroundColor}
                                            onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="w-full h-full rounded border border-zinc-700 shadow-sm"
                                            style={{ backgroundColor: config.backgroundColor }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={config.backgroundColor}
                                        onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-300 text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
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
                                            onClick={() => updateConfig('cardTheme', theme.id as WallConfig['cardTheme'])}
                                            className={cn(
                                                "py-2.5 px-2 rounded-lg border transition-all text-center text-xs font-medium",
                                                config.cardTheme === theme.id
                                                    ? "bg-zinc-800 border-zinc-600 text-white shadow-sm"
                                                    : "bg-zinc-800/30 border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                            )}
                                        >
                                            {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Typography */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Typography</Label>
                                <ModernFontPicker
                                    value={config.fontFamily}
                                    onChange={(font) => updateConfig('fontFamily', font)}
                                />
                            </div>

                            {/* Shadow Intensity */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-zinc-400">Shadow Intensity</Label>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={config.shadowIntensity}
                                    onChange={(e) => updateConfig('shadowIntensity', Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-violet-500"
                                />
                            </div>

                            {/* Accent Color (Swatches) */}
                            <div className="space-y-3">
                                <Label className="text-xs text-zinc-400">Accent Color</Label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        '#8b5cf6', // Purple
                                        '#ec4899', // Pink
                                        '#10b981', // Green
                                        '#f59e0b', // Orange
                                        '#ef4444', // Red
                                        '#3b82f6', // Blue
                                    ].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => updateConfig('accentColor', color)}
                                            className={cn(
                                                "w-9 h-9 rounded-lg transition-all border-2",
                                                config.accentColor === color
                                                    ? "border-white scale-110 shadow-md"
                                                    : "border-transparent hover:scale-105"
                                            )}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select accent color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Title Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Title Color</Label>
                                <div className="flex gap-3">
                                    <div className="relative w-10 h-10 shrink-0">
                                        <input
                                            type="color"
                                            value={config.textColor}
                                            onChange={(e) => updateConfig('textColor', e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="w-full h-full rounded border border-zinc-700 shadow-sm"
                                            style={{ backgroundColor: config.textColor }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={config.textColor}
                                        onChange={(e) => updateConfig('textColor', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-300 text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                            </div>


                            {/* ============= BRANDING SECTION ============= */}
                            <div className="pt-6 border-t border-zinc-800 space-y-4">
                                <Label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Branding</Label>
                                <Label className="text-xs text-zinc-400 block -mt-2">Logo</Label>

                                {/* Logo Upload Card */}
                                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                                    {/* Logo Preview Area */}
                                    <div className="h-32 flex items-center justify-center bg-zinc-900/80 relative">
                                        {config.logoUrl ? (
                                            <div className="relative group">
                                                <img
                                                    src={config.logoUrl}
                                                    alt="Logo"
                                                    className="max-h-20 max-w-[80%] object-contain"
                                                />
                                                <button
                                                    onClick={handleRemoveLogo}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Logo size={48} color="#8b5cf6" />
                                        )}
                                    </div>

                                    {/* Upload Button Area */}
                                    <div className="p-3 bg-zinc-800/20 border-t border-zinc-800">
                                        <label className="cursor-pointer block">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoUpload}
                                            />
                                            <div className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all text-xs font-medium text-zinc-300">
                                                <Upload className="w-3.5 h-3.5" />
                                                Upload
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Logo Size Slider - Only show if logo exists */}
                                {/* Keeping this as it's useful functionality, even if not explicitly in the static screenshot, 
                                    or removing if strict adherence is required. The screenshot cuts off at the bottom. 
                                    I'll keep it for utility but styling it typically. */}
                                {config.logoUrl && (
                                    <div className="space-y-2 pt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">Logo Size</span>
                                            <span className="text-xs text-zinc-500">{config.logoSize}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="20"
                                            max="100"
                                            value={config.logoSize}
                                            onChange={(e) => updateConfig('logoSize', Number(e.target.value))}
                                            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-violet-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ===================== FOOTER ===================== */}
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



