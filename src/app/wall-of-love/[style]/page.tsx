"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Star,
    ArrowLeft,
    Pencil,
    Menu,
    Code,
    X,
    Twitter,
    Linkedin,
    Facebook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// ===================== TESTIMONIALS DATA ===================== //
const WALL_TESTIMONIALS = [
    {
        id: "wall-1",
        authorName: "Janie",
        company: "Company",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-orange-400 to-red-500",
        rating: 5,
        content: "Thank you for etc we stantly satisfied with the softs proces, and make uetno narks you snsny korutlon in temps to knowledges.",
        source: "TWITTER",
        date: "Oct 15, 2023",
        selected: true,
    },
    {
        id: "wall-2",
        authorName: "Alexandro",
        company: "Lioler",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-teal-400 to-cyan-500",
        rating: 5,
        content: "We mvered ove. Testimonies I were ired to form linguloal our companies and menuland about it.",
        source: "LINKEDIN",
        date: "Oct 14, 2023",
        selected: false,
    },
    {
        id: "wall-3",
        authorName: "Datwy",
        company: "Linner",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-indigo-400 to-purple-500",
        rating: 5,
        content: "Difstile nolbeen brarthing and endine morster. The process best ecoing vite m/barton each snow of compact stomphing and for both active and tows have /naprevik/millther.",
        source: "TWITTER",
        date: "Oct 13, 2023",
        selected: false,
    },
    {
        id: "wall-4",
        authorName: "Anna",
        company: "Company",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
        rating: 5,
        content: "The teain soro is paid customer company and executive affoted in an eleme and training olrase.",
        source: "FACEBOOK",
        date: "Oct 12, 2023",
        selected: false,
    },
    {
        id: "wall-5",
        authorName: "Kantan",
        company: "Unve",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-violet-400 to-purple-600",
        rating: 5,
        content: "Excellent care management services. in when expensed an excel.iwis, storeio and drwene and customoim support in is ofiser.",
        source: "PLAYSTORE",
        date: "Oct 11, 2023",
        selected: false,
    },
    {
        id: "wall-6",
        authorName: "Jucly",
        company: "Company",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
        rating: 5,
        content: "We have custom eur services Companies dinricnments works with you irvs easy and the convoundt surives.",
        source: "FACEBOOK",
        date: "Oct 10, 2023",
        selected: false,
    },
    {
        id: "wall-7",
        authorName: "Tiwer",
        company: "Company",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-pink-400 to-rose-500",
        rating: 5,
        content: "We have custom our services Companies oinric nments works with you irvs easy and the convoundt surives str...",
        source: "TWITTER",
        date: "Oct 9, 2023",
        selected: true,
    },
    {
        id: "wall-8",
        authorName: "Jenah",
        company: "Company",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-amber-400 to-orange-500",
        rating: 5,
        content: "The tornvarchen our consnutator managing anp with changes an'i quailled customers ho quality vandnring and professionals.",
        source: "LINKEDIN",
        date: "Oct 8, 2023",
        selected: false,
    },
    {
        id: "wall-9",
        authorName: "Elisandro",
        company: "Lio",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-cyan-400 to-blue-500",
        rating: 4,
        content: "The innivarlcnt is deeds and peamod lonar userdw irrelhes strategies with experinece and gmown-designed about-uparicle platform.",
        source: "TWITTER",
        date: "Oct 7, 2023",
        selected: false,
    },
    {
        id: "wall-10",
        authorName: "Jaanna",
        company: "Sinan",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-rose-400 to-pink-600",
        rating: 5,
        content: "ConHave is eiqnty best breed service and provide ex-an for...",
        source: "LINKEDIN",
        date: "Oct 6, 2023",
        selected: false,
    },
    {
        id: "wall-11",
        authorName: "Calireh",
        company: "Finor",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-green-400 to-emerald-500",
        rating: 5,
        content: "I have me-bootiiinnor in our customer xuor stronglest eucellent and responds for easi|llier to ternm or customs questions to blook how we work and help it.",
        source: "TWITTER",
        date: "Oct 5, 2023",
        selected: false,
    },
    {
        id: "wall-12",
        authorName: "Danid",
        company: "Company",
        authorAvatarUrl: "",
        avatarBg: "bg-gradient-to-br from-purple-400 to-violet-600",
        rating: 5,
        content: "We are ereatesloveliver consumers, to recipe avvioss",
        source: "LINKEDIN",
        date: "Oct 4, 2023",
        selected: true,
    },
]

// Source icon helper
const getSourceIcon = (source: string) => {
    switch (source) {
        case 'TWITTER':
            return { icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500/10' }
        case 'LINKEDIN':
            return { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10' }
        case 'FACEBOOK':
            return { icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500/10' }
        case 'PLAYSTORE':
            return { icon: null, color: 'text-green-600', bg: 'bg-green-600/10', text: '▶' }
        default:
            return { icon: null, color: 'text-zinc-500', bg: 'bg-zinc-500/10', text: '●' }
    }
}

// ===================== TEMPLATE CONFIGURATIONS ===================== //
// Only Bento Grid as the template
const TEMPLATES = [
    {
        id: "bento",
        name: "Bento Grid",
        subtitle: "Modular Layout",
        preview: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    },
]

// Card themes - text only, no preview images
const CARD_THEMES = [
    {
        id: "glassmorphism",
        name: "Minimal",
        cardBg: "bg-white/70 backdrop-blur-md",
        cardBorder: "border border-white/50",
        cardShadow: "shadow-lg shadow-purple-500/5",
    },
    {
        id: "cinematic",
        name: "Dark",
        cardBg: "bg-[#13131a]",
        cardBorder: "border border-purple-500/20",
        cardShadow: "shadow-lg shadow-purple-500/10",
    },
    {
        id: "brutalist",
        name: "Bold",
        cardBg: "bg-white",
        cardBorder: "border-2 border-black",
        cardShadow: "shadow-[4px_4px_0px_0px_#000]",
    },
]

type WallStyle = 'glassmorphism' | 'brutalist' | 'cinematic' | 'bento'
type TabType = 'templates' | 'style'

interface WallOfLovePageProps {
    params: { style: string }
}

export default function WallOfLovePage({ params }: WallOfLovePageProps) {
    const router = useRouter()
    const [activeStyle, setActiveStyle] = React.useState<WallStyle>('bento')
    const [sidebarOpen, setSidebarOpen] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState<TabType>('templates')
    const [activeCardTheme, setActiveCardTheme] = React.useState('glassmorphism')

    // Wall name state
    const [wallName, setWallName] = React.useState('My Wall of Love')
    const [isEditingName, setIsEditingName] = React.useState(false)
    const nameInputRef = React.useRef<HTMLInputElement>(null)

    // Style settings
    const [backgroundColor, setBackgroundColor] = React.useState('#f0f4ff')
    const [shadowIntensity, setShadowIntensity] = React.useState(50)
    const [accentColor, setAccentColor] = React.useState('#8b5cf6')

    // Handle name editing
    const handleNameClick = () => {
        setIsEditingName(true)
        setTimeout(() => nameInputRef.current?.focus(), 0)
    }

    const handleNameBlur = () => {
        setIsEditingName(false)
        if (!wallName.trim()) {
            setWallName('My Wall of Love')
        }
    }

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditingName(false)
        }
    }

    const getStyleConfig = () => {
        switch (activeStyle) {
            case 'glassmorphism':
                return {
                    containerBg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
                    cardBg: 'bg-white/70 backdrop-blur-md',
                    cardBorder: 'border border-white/50',
                    cardShadow: 'shadow-lg shadow-purple-500/5',
                    cardRadius: 'rounded-2xl',
                    textColor: 'text-zinc-800',
                    subtitleColor: 'text-zinc-500',
                    styleName: 'Modern Masonry Glassmorphism',
                }
            case 'brutalist':
                return {
                    containerBg: 'bg-[#fffef0]',
                    cardBg: 'bg-white',
                    cardBorder: 'border-2 border-black',
                    cardShadow: 'shadow-[4px_4px_0px_0px_#000]',
                    cardRadius: 'rounded-none',
                    textColor: 'text-black',
                    subtitleColor: 'text-zinc-700',
                    styleName: 'Neo-Brutalist',
                }
            case 'cinematic':
                return {
                    containerBg: 'bg-[#0a0a0f]',
                    cardBg: 'bg-[#13131a]',
                    cardBorder: 'border border-purple-500/20',
                    cardShadow: 'shadow-lg shadow-purple-500/10',
                    cardRadius: 'rounded-xl',
                    textColor: 'text-white',
                    subtitleColor: 'text-zinc-400',
                    styleName: 'Cinematic Dark Mode',
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
                    styleName: 'Bento Grid Layout',
                }
        }
    }

    // Get current card theme styling
    const getCardThemeConfig = () => {
        const theme = CARD_THEMES.find(t => t.id === activeCardTheme)
        if (theme) {
            return {
                cardBg: theme.cardBg,
                cardBorder: theme.cardBorder,
                cardShadow: theme.cardShadow,
                textColor: activeCardTheme === 'cinematic' ? 'text-white' : 'text-zinc-900',
                subtitleColor: activeCardTheme === 'cinematic' ? 'text-zinc-400' : 'text-zinc-500',
            }
        }
        // Default
        return {
            cardBg: 'bg-white',
            cardBorder: 'border border-zinc-200',
            cardShadow: 'shadow-sm',
            textColor: 'text-zinc-900',
            subtitleColor: 'text-zinc-500',
        }
    }

    const styleConfig = getStyleConfig()
    const cardTheme = getCardThemeConfig()

    // Display all testimonials since Select feature is removed
    const displayTestimonials = WALL_TESTIMONIALS

    return (
        <div className="h-[100vh] w-[100vw] flex flex-col bg-[#f5f5f7] overflow-hidden">
            {/* ===================== SIMPLE TOP HEADER ===================== */}
            <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-zinc-900"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-zinc-900 font-semibold text-lg">Wall of Love Design Studio</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Editable Wall Name - Ghost/Inline Style */}
                    <div
                        className={cn(
                            "group flex items-center gap-2 px-2 py-1 rounded-md cursor-text transition-all",
                            isEditingName
                                ? "bg-zinc-100 ring-1 ring-zinc-300"
                                : "hover:bg-zinc-50"
                        )}
                        onClick={handleNameClick}
                    >
                        {isEditingName ? (
                            <input
                                ref={nameInputRef}
                                type="text"
                                value={wallName}
                                onChange={(e) => setWallName(e.target.value)}
                                onBlur={handleNameBlur}
                                onKeyDown={handleNameKeyDown}
                                className="text-sm font-medium text-zinc-900 bg-transparent outline-none min-w-[120px]"
                            />
                        ) : (
                            <>
                                <span className="text-sm font-medium text-zinc-900">{wallName}</span>
                                <Pencil className="h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                        )}
                    </div>

                    {/* Embed Code Button */}
                    <Button
                        variant="outline"
                        className="gap-2 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                    >
                        <Code className="h-4 w-4" />
                        Embed Code
                    </Button>

                    {/* Save Button */}
                    <Button className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-5">
                        Save
                    </Button>

                    {/* Sidebar Toggle (Hamburger) - Only shows when sidebar is closed */}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600"
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* ===================== MAIN CONTENT ===================== */}
            <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 3.5rem)' }}>
                {/* ===================== PREVIEW AREA ===================== */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                    {/* Preview Canvas */}
                    <div
                        className="flex-1 overflow-auto"
                        style={{ backgroundColor: backgroundColor }}
                    >
                        <div className="min-h-full">
                            {/* Wall Header */}
                            <div className="py-10 px-8 text-center">
                                <h2 className="text-4xl font-bold text-zinc-900">
                                    Wall of Love
                                </h2>
                            </div>

                            {/* Testimonials Masonry Grid */}
                            <div className="px-6 pb-8">
                                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                                    {displayTestimonials.map((t, index) => {
                                        // Get dot color based on index
                                        const dotColors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-red-500', 'bg-yellow-500']
                                        const dotColor = dotColors[index % dotColors.length]

                                        return (
                                            <div
                                                key={t.id}
                                                className={cn(
                                                    "relative break-inside-avoid rounded-xl p-5 transition-all hover:scale-[1.02]",
                                                    cardTheme.cardBg,
                                                    cardTheme.cardBorder,
                                                    cardTheme.cardShadow
                                                )}
                                            >
                                                {/* Source Icon */}
                                                <div className="absolute top-4 right-4">
                                                    {(() => {
                                                        const sourceInfo = getSourceIcon(t.source)
                                                        const IconComponent = sourceInfo.icon
                                                        return (
                                                            <div className={cn(
                                                                "w-6 h-6 rounded-full flex items-center justify-center",
                                                                sourceInfo.bg
                                                            )}>
                                                                {IconComponent ? (
                                                                    <IconComponent className={cn("w-3.5 h-3.5", sourceInfo.color)} />
                                                                ) : (
                                                                    <span className={cn("text-xs font-bold", sourceInfo.color)}>
                                                                        {sourceInfo.text}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )
                                                    })()}
                                                </div>

                                                {/* Author */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div
                                                        className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
                                                            t.avatarBg
                                                        )}
                                                    >
                                                        {t.authorName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={cn("font-semibold text-sm", cardTheme.textColor)}>
                                                            {t.authorName}
                                                        </p>
                                                        <p className={cn("text-xs", cardTheme.subtitleColor)}>
                                                            {t.company}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex gap-0.5 mb-3">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4"
                                                            style={{
                                                                fill: i < t.rating ? accentColor : (activeCardTheme === 'cinematic' ? '#52525b' : '#e4e4e7'),
                                                                color: i < t.rating ? accentColor : (activeCardTheme === 'cinematic' ? '#52525b' : '#e4e4e7'),
                                                            }}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Content */}
                                                <p className={cn("text-sm leading-relaxed", cardTheme.textColor === 'text-white' ? 'text-zinc-300' : 'text-zinc-700')}>
                                                    {t.content}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Powered By Branding - Only show when sidebar is closed */}
                            {!sidebarOpen && (
                                <div className="fixed bottom-6 right-6 z-10">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-zinc-200">
                                        <span className="text-xs text-zinc-500">Powered by</span>
                                        <span className="text-xs font-semibold text-zinc-900">TestimonialLogo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===================== RIGHT SIDEBAR ===================== */}
                {sidebarOpen && (
                    <div
                        className="bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 overflow-hidden transition-all duration-300"
                        style={{ width: 'clamp(280px, 22vw, 360px)' }}
                    >
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="text-white font-semibold">Studio Controls</h3>
                            <button
                                onClick={() => setSidebarOpen(false)}
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
                                        {TEMPLATES.map((template) => (
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
                                            {CARD_THEMES.map((theme) => (
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
                                        <Label className="text-xs text-zinc-400">Typography</Label>
                                        <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                                            <span className="text-sm text-white flex-1">Appen</span>
                                            <span className="text-zinc-400 text-xs">▼</span>
                                        </div>
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
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="p-4 border-t border-zinc-800">
                            <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium">
                                Save & Publish
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
