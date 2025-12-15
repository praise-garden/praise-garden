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
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.backgroundColor}
                                        onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={config.backgroundColor}
                                        onChange={(e) => updateConfig('backgroundColor', e.target.value)}
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
                                            onClick={() => updateConfig('cardTheme', theme.id as WallConfig['cardTheme'])}
                                            className={cn(
                                                "p-2 rounded-lg border-2 transition-all text-center",
                                                config.cardTheme === theme.id
                                                    ? "border-violet-500 bg-violet-500/10"
                                                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                                            )}
                                        >
                                            <span className="text-xs font-medium text-white">{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Accent Color (Stars)</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.accentColor}
                                        onChange={(e) => updateConfig('accentColor', e.target.value)}
                                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={config.accentColor}
                                        onChange={(e) => updateConfig('accentColor', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs font-mono uppercase"
                                    />
                                </div>
                            </div>

                            {/* Text Color */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Header Text Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={config.textColor}
                                        onChange={(e) => updateConfig('textColor', e.target.value)}
                                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={config.textColor}
                                        onChange={(e) => updateConfig('textColor', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs font-mono uppercase"
                                    />
                                </div>
                            </div>

                            {/* Font Family */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Font</Label>
                                <ModernFontPicker
                                    value={config.fontFamily}
                                    onChange={(font) => updateConfig('fontFamily', font)}
                                />
                            </div>

                            {/* Shadow Intensity */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-400">Shadow Intensity</Label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500 w-8">{config.shadowIntensity}%</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={config.shadowIntensity}
                                        onChange={(e) => updateConfig('shadowIntensity', Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-violet-500"
                                    />
                                </div>
                            </div>

                            {/* ============= BRANDING SECTION ============= */}
                            <div className="pt-4 border-t border-zinc-800 space-y-4">
                                <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Branding</Label>

                                {/* Logo Preview */}
                                <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                    <div
                                        className="flex items-center justify-center bg-zinc-900 rounded-lg border border-zinc-700"
                                        style={{ width: `${Math.max(40, config.logoSize)}px`, height: `${Math.max(40, config.logoSize)}px` }}
                                    >
                                        {config.logoUrl ? (
                                            <img
                                                src={config.logoUrl}
                                                alt="Logo"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <Logo size={Math.min(config.logoSize * 0.6, 40)} color="#8b5cf6" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoUpload}
                                            />
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors text-xs text-white">
                                                <Upload className="w-3 h-3" />
                                                Upload
                                            </div>
                                        </label>
                                        {config.logoUrl && (
                                            <button
                                                onClick={handleRemoveLogo}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors text-xs text-red-400"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Logo Size */}
                                <div className="space-y-2">
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
                                        className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-violet-500"
                                    />
                                </div>
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
