"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getTestimonials } from "@/lib/actions/testimonials"
import {
    Star,
    ArrowLeft,
    Pencil,
    Menu,
    Code,
    Twitter,
    Linkedin,
    Facebook,
    Loader2,
    MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareWallOfLoveSidebar } from "@/components/ShareWallOfLoveSidebar"
import { WallDesignStudioSidebar, TabType } from "@/components/WallDesignStudioSidebar"
import { SelectTestimonialsModal, Testimonial } from "@/components/widgets/SelectTestimonialsModal"
import Logo from "@/components/ui/Logo"
import { WallConfig, DEFAULT_WALL_CONFIG, UpdateConfigFn } from "@/types/wall-config"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { saveWall, getWallById } from "@/lib/actions/walls"
import { toast, Toaster } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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

// Source icon helper - returns icon info for various testimonial sources
const getSourceIcon = (source: string) => {
    const s = (source || '').toUpperCase().trim()

    // Twitter/X
    if (s.includes('TWITTER') || s === 'X') {
        return { icon: Twitter, color: 'text-white', bg: 'bg-black' }
    }
    // LinkedIn
    if (s.includes('LINKEDIN')) {
        return { icon: Linkedin, color: 'text-white', bg: 'bg-[#0A66C2]' }
    }
    // Facebook
    if (s.includes('FACEBOOK')) {
        return { icon: Facebook, color: 'text-white', bg: 'bg-[#1877F2]' }
    }
    // Play Store / Google
    if (s.includes('PLAYSTORE') || s.includes('PLAY STORE') || s.includes('GOOGLE')) {
        return { icon: null, color: 'text-white', bg: 'bg-gradient-to-br from-green-400 via-blue-500 to-red-500', text: 'G' }
    }
    // Product Hunt
    if (s.includes('PRODUCTHUNT') || s.includes('PRODUCT HUNT')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#DA552F]', text: 'P' }
    }
    // G2
    if (s === 'G2' || s.includes('G2CROWD')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#FF492C]', text: 'G2' }
    }
    // Capterra
    if (s.includes('CAPTERRA')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#FF9D28]', text: 'C' }
    }
    // TrustPilot
    if (s.includes('TRUSTPILOT')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#00B67A]', text: 'TP' }
    }
    // Instagram
    if (s.includes('INSTAGRAM')) {
        return { icon: null, color: 'text-white', bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', text: 'IG' }
    }
    // YouTube
    if (s.includes('YOUTUBE')) {
        return { icon: null, color: 'text-white', bg: 'bg-[#FF0000]', text: 'YT' }
    }
    // TikTok
    if (s.includes('TIKTOK')) {
        return { icon: null, color: 'text-white', bg: 'bg-black', text: 'TT' }
    }
    // Email
    if (s.includes('EMAIL')) {
        return { icon: null, color: 'text-white', bg: 'bg-zinc-700', text: '@' }
    }
    // Manual / Other - Use chat bubble icon like dashboard
    return { icon: MessageSquare, color: 'text-white', bg: 'bg-zinc-700' }
}

// ===================== TEMPLATE CONFIGURATIONS ===================== //
// Only Classic as the template
const TEMPLATES = [
    {
        id: "classic",
        name: "Classic",
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

// ===================== HELPER COMPONENTS ===================== //

const ExpandableContent = ({
    content,
    fontFamily,
    textColorClass,
    subtitleColorClass
}: {
    content: string
    fontFamily?: string
    textColorClass: string
    subtitleColorClass: string
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    // Limit to 200 chars as requested
    const shouldTruncate = content.length > 200

    if (!shouldTruncate) {
        return (
            <p
                className={cn("text-sm leading-relaxed break-words whitespace-pre-wrap", textColorClass)}
                style={{ fontFamily }}
            >
                {content}
            </p>
        )
    }

    return (
        <div>
            <p
                className={cn(
                    "text-sm leading-relaxed break-words whitespace-pre-wrap",
                    textColorClass,
                    !isExpanded && "line-clamp-6"
                )}
                style={{ fontFamily }}
            >
                {content}
            </p>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                }}
                className={cn(
                    "text-xs font-medium mt-2 hover:underline focus:outline-none flex items-center gap-1",
                    subtitleColorClass
                )}
            >
                {isExpanded ? "Read Less" : "Read More"}
            </button>
        </div>
    )
}


interface WallOfLovePageProps {
    params: Promise<{ style: string }>
}

export default function WallOfLovePage({ params }: WallOfLovePageProps) {
    const resolvedParams = React.use(params)
    const router = useRouter()
    const searchParams = useSearchParams()


    // Check if we are in "Edit Mode" (saved wall) or "Create Mode" (new template)
    const isEditMode = React.useMemo(() =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedParams.style),
        [resolvedParams.style]
    );

    // Initial load state to prevent flash of default content
    const [isInitializing, setIsInitializing] = React.useState(true);

    // ===================== CONFIG STATE (Single Source of Truth) ===================== //
    const [config, setConfig] = React.useState<WallConfig>(DEFAULT_WALL_CONFIG)

    // Config updater function
    const updateConfig: UpdateConfigFn = React.useCallback((key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }, [])

    // ===================== UI STATE ===================== //
    const [sidebarOpen, setSidebarOpen] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState<TabType>('templates')
    const [embedSidebarOpen, setEmbedSidebarOpen] = React.useState(false)
    const [isSelectTestimonialsOpen, setIsSelectTestimonialsOpen] = React.useState(false)
    const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false)
    const [saveSource, setSaveSource] = React.useState<'save' | 'embed'>('save')

    // Wall ID state for saving/updating
    const [wallId, setWallId] = React.useState<string | null>(null)
    const [isSaving, setIsSaving] = React.useState(false)

    // Wall name state (metadata, not config)
    const [wallName, setWallName] = React.useState('My Wall of Love')
    const [isEditingName, setIsEditingName] = React.useState(false)
    const nameInputRef = React.useRef<HTMLInputElement>(null)

    // Handle Save
    const handleSave = async (silent = false, openEmbed = false) => {
        setIsSaving(true)
        try {
            // Generate a simple slug from name
            const baseSlug = wallName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const slug = wallId ? baseSlug : `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

            const result = await saveWall({
                id: wallId || undefined,
                name: wallName,
                slug: slug,
                config: config,
                selectedTestimonialIds: selectedTestimonialIds,
                isPublished: true
            })

            if (result.success && result.data) {
                setWallId(result.data.id)
                if (!silent) toast.success("Wall saved successfully!")

                // Use pushState to update URL without triggering Next.js re-fetch/remount
                // This ensures a smooth "Local Update" feel
                window.history.pushState(null, '', `/wall-of-love/${result.data.id}`)

                return result.data.id
            } else {
                toast.error(result.error || "Failed to save wall")
                return null
            }
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred")
            return null
        } finally {
            setIsSaving(false)
        }
    }

    const handleEmbedClick = () => {
        // If saved, open embed sidebar
        if (wallId) {
            setEmbedSidebarOpen(true)
        } else {
            // If unsaved, open save modal
            setSaveSource('embed')
            setIsSaveModalOpen(true)
        }
    }

    const handleModalSave = async () => {
        const id = await handleSave(false)
        if (id) {
            setIsSaveModalOpen(false)
            // Open sidebar immediately if that was the intent
            if (saveSource === 'embed') {
                setEmbedSidebarOpen(true)
            }
        }
    }

    // Effect: Handle URL actions (like opening sidebar after save redirect)
    React.useEffect(() => {
        if (searchParams.get('action') === 'embed') {
            setEmbedSidebarOpen(true)
            // Cleanup param to avoid reopening on refresh (Optional, but clean)
            // router.replace(...) - skipping for now to keep history simple
        }
    }, [searchParams])

    // Testimonial selection state
    const [selectedTestimonialIds, setSelectedTestimonialIds] = React.useState<string[]>([])
    const [userTestimonials, setUserTestimonials] = React.useState<Testimonial[] | null>(null)
    const [isLoadingData, setIsLoadingData] = React.useState(true)

    // Fetch user testimonials
    React.useEffect(() => {
        const fetchUserTestimonials = async () => {
            try {
                const { data } = await getTestimonials()

                if (data && data.length > 0) {
                    // Map DB records to Testimonial interface
                    const mapped: Testimonial[] = data.map((t: any) => ({
                        id: t.id,
                        type: t.type || 'text',
                        authorName: t.author_name || 'Anonymous',
                        authorTitle: t.author_title || '',
                        authorAvatarUrl: t.author_avatar_url,
                        rating: t.rating ?? null,
                        content: t.content || '',
                        source: t.source || 'MANUAL',
                        date: new Date(t.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        }),
                        videoUrl: t.video_url,
                        videoThumbnail: t.video_thumbnail,
                        attachments: t.attachments || []
                    }))

                    setUserTestimonials(mapped)
                    // Select all user testimonials by default ONLY if we are creating a new wall
                    // If editing, we wait for the saved selection from loadWall
                    if (!isEditMode) {
                        setSelectedTestimonialIds(mapped.map(t => t.id))
                    }
                } else {
                    setUserTestimonials([])
                }
            } catch (err) {
                console.error("Failed to fetch testimonials:", err)
                setUserTestimonials([])
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchUserTestimonials()
    }, [isEditMode])

    // Fetch existing wall data if URL param is a UUID
    React.useEffect(() => {
        const loadWall = async () => {
            if (!isEditMode) {
                setIsInitializing(false);
                return;
            }

            const styleParam = resolvedParams.style;

            try {
                const { data } = await getWallById(styleParam);
                if (data) {
                    setWallId(data.id);
                    setWallName(data.name);
                    // Cast config from DB record to WallConfig type
                    if (data.config) {
                        setConfig(data.config as WallConfig);
                        // Checks for selectedTestimonialIds in config json (primary storage)
                        if ((data.config as any).selectedTestimonialIds) {
                            setSelectedTestimonialIds((data.config as any).selectedTestimonialIds);
                        }
                    }
                    // Fallback to column if present
                    if (data.selected_testimonial_ids && data.selected_testimonial_ids.length > 0) {
                        setSelectedTestimonialIds(data.selected_testimonial_ids);
                    }
                } else {
                    // If ID valid format but not found (deleted?), maybe show error or treat as new
                    console.error("Wall ID not found");
                }
            } catch (error) {
                console.error("Failed to load wall:", error);
            } finally {
                setIsInitializing(false);
            }
        };

        loadWall();
    }, [isEditMode, resolvedParams.style]);

    // Transform testimonials to the format expected by SelectTestimonialsModal
    // Logic: ONLY show user testimonials in the modal. If none, modal list is empty.
    const modalTestimonials: Testimonial[] = userTestimonials || []

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
        switch (config.style) {
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
            case 'classic':
            default:
                return {
                    containerBg: 'bg-slate-50',
                    cardBg: 'bg-white',
                    cardBorder: 'border border-slate-200',
                    cardShadow: 'shadow-sm',
                    cardRadius: 'rounded-xl',
                    textColor: 'text-zinc-900',
                    subtitleColor: 'text-zinc-500',
                    styleName: 'Classic Layout',
                }
        }
    }

    // Get current card theme styling
    const getCardThemeConfig = () => {
        const theme = CARD_THEMES.find(t => t.id === config.cardTheme)
        if (theme) {
            return {
                cardBg: theme.cardBg,
                cardBorder: theme.cardBorder,
                cardShadow: theme.cardShadow,
                textColor: config.cardTheme === 'cinematic' ? 'text-white' : 'text-zinc-900',
                subtitleColor: config.cardTheme === 'cinematic' ? 'text-zinc-400' : 'text-zinc-500',
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


    // Display testimonials based on selection
    // If user has NO data, fallback to DEMO data (WALL_TESTIMONIALS)
    // If user HAS data, use userTestimonials filtered by selection
    const displayTestimonials = React.useMemo(() => {
        // If loading, return empty (we will show spinner in UI)
        if (isLoadingData) return []

        // If user has NO data (and not loading), show Demo
        if (userTestimonials && userTestimonials.length === 0) {
            return WALL_TESTIMONIALS
        }

        // If user has data but DESELECTED all, show Demo
        if (selectedTestimonialIds.length === 0) {
            return WALL_TESTIMONIALS
        }

        // Otherwise filter user data
        if (userTestimonials) {
            return userTestimonials.filter(t => selectedTestimonialIds.includes(t.id))
        }

        return []
    }, [selectedTestimonialIds, userTestimonials, isLoadingData])

    if (isInitializing) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        )
    }

    return (
        <div className="h-[100vh] w-[100vw] flex flex-col bg-[#f5f5f7] overflow-hidden" style={{ backgroundColor: '#f5f5f7' }}>
            {/* ===================== SIMPLE TOP HEADER ===================== */}
            <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-zinc-900"
                        aria-label="Go back"
                        style={{ backgroundColor: 'transparent' }}
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
                                style={{ backgroundColor: 'transparent' }}
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
                        className={cn(
                            "gap-2 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                        )}
                        onClick={handleEmbedClick}
                        disabled={isSaving}
                        title={!wallId ? "Save to get embed code" : "Get embed code"}
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        <Code className="h-4 w-4" />
                        Embed Code
                    </Button>

                    {/* Save Button */}
                    <Button
                        onClick={() => {
                            if (wallId) {
                                handleSave()
                            } else {
                                setSaveSource('save')
                                setIsSaveModalOpen(true)
                            }
                        }}
                        disabled={isSaving}
                        className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-5"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
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
                        style={{ backgroundColor: config.backgroundColor }}
                    >
                        <div className="min-h-full">
                            {/* Wall Header */}
                            <div className="py-10 px-8 relative flex items-center justify-center">
                                <div className="absolute left-8 flex items-center justify-center">
                                    {config.logoUrl ? (
                                        <img
                                            src={config.logoUrl}
                                            alt="Project Logo"
                                            className="object-contain"
                                            style={{
                                                width: config.logoSize,
                                                height: config.logoSize,
                                                maxWidth: 'none'
                                            }}
                                        />
                                    ) : (
                                        <Logo
                                            size={config.logoSize}
                                        />
                                    )}
                                </div>
                                <h2
                                    className="text-4xl font-bold transition-colors duration-200"
                                    style={{ fontFamily: config.fontFamily, color: config.textColor, backgroundColor: 'transparent' }}
                                >
                                    Wall of Love
                                </h2>
                            </div>

                            {/* Testimonials Masonry Grid */}
                            <div className="px-6 pb-8">
                                {isLoadingData ? (
                                    <div className="flex justify-center items-center py-20">
                                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                                    </div>
                                ) : (
                                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                                        {displayTestimonials.map((t, index) => {


                                            return (
                                                <div
                                                    key={t.id}
                                                    className={cn(
                                                        "relative break-inside-avoid rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]",
                                                        cardTheme.cardBg,
                                                        cardTheme.cardBorder
                                                    )}
                                                    style={{
                                                        boxShadow: config.shadowIntensity > 0
                                                            ? `0 4px 20px rgba(0, 0, 0, ${config.shadowIntensity / 100 * 0.3}), 0 2px 8px rgba(0, 0, 0, ${config.shadowIntensity / 100 * 0.15})`
                                                            : 'none'
                                                    }}
                                                >
                                                    {/* Video Testimonial Layout - Check type is video */}
                                                    {(t as any).type === 'video' && (t as any).videoUrl ? (
                                                        <>
                                                            {/* Video Section with Overlay */}
                                                            <div className="relative aspect-video overflow-hidden">
                                                                <VideoPlayer
                                                                    url={(t as any).videoUrl}
                                                                    poster={(t as any).videoThumbnail}
                                                                    showControls={true}
                                                                    showPlayPauseButton={true}
                                                                    className="w-full h-full"
                                                                />

                                                                {/* Gradient overlay at bottom */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                                                                {/* User info overlaid at bottom-left */}
                                                                <div className="absolute bottom-3 left-3 right-16">
                                                                    {/* Stars - only show if rating exists */}
                                                                    {t.rating && t.rating > 0 && (
                                                                        <div className="flex gap-0.5 mb-1">
                                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                                <Star
                                                                                    key={i}
                                                                                    className="w-3.5 h-3.5"
                                                                                    style={{
                                                                                        fill: i < t.rating ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                                                                                        color: i < t.rating ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {/* Name with verification */}
                                                                    <p className="font-semibold text-white text-sm flex items-center gap-1">
                                                                        {t.authorName}
                                                                        <span className="text-yellow-400">⚡</span>
                                                                    </p>
                                                                    {/* Title */}
                                                                    <p className="text-xs text-white/70">
                                                                        {(t as any).company || (t as any).authorTitle}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Content below video */}
                                                            <div className="p-4">
                                                                <ExpandableContent
                                                                    content={t.content}
                                                                    fontFamily={config.fontFamily}
                                                                    textColorClass={cardTheme.textColor === 'text-white' ? 'text-zinc-300' : 'text-zinc-700'}
                                                                    subtitleColorClass={cardTheme.subtitleColor}
                                                                />
                                                                {/* Date */}
                                                                {(t as any).date && (
                                                                    <p className="text-xs text-zinc-400 mt-2">
                                                                        {new Date((t as any).date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        /* Text Testimonial Layout - Original */
                                                        <div className="p-5">
                                                            {/* Author row with Source Icon */}
                                                            <div className="flex items-center justify-between mb-3">
                                                                {/* Author Info */}
                                                                <div className="flex items-center gap-3">
                                                                    {(t as any).authorAvatarUrl ? (
                                                                        <img
                                                                            src={(t as any).authorAvatarUrl}
                                                                            alt={t.authorName}
                                                                            className="w-10 h-10 rounded-full object-cover shrink-0"
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className={cn(
                                                                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
                                                                                (t as any).avatarBg || "bg-gradient-to-br from-indigo-500 to-purple-500"
                                                                            )}
                                                                        >
                                                                            {t.authorName.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p
                                                                            className={cn("font-semibold text-sm", cardTheme.textColor)}
                                                                            style={{ fontFamily: config.fontFamily }}
                                                                        >
                                                                            {t.authorName}
                                                                        </p>
                                                                        <p
                                                                            className={cn("text-xs", cardTheme.subtitleColor)}
                                                                            style={{ fontFamily: config.fontFamily }}
                                                                        >
                                                                            {(t as any).company || (t as any).authorTitle}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Source Icon */}
                                                                {(() => {
                                                                    const sourceInfo = getSourceIcon(t.source)
                                                                    const IconComponent = sourceInfo.icon
                                                                    return (
                                                                        <div className={cn(
                                                                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                                                                            sourceInfo.bg
                                                                        )}>
                                                                            {IconComponent ? (
                                                                                <IconComponent className={cn("w-4 h-4", sourceInfo.color)} />
                                                                            ) : (
                                                                                <span className={cn("text-xs font-bold", sourceInfo.color)}>
                                                                                    {sourceInfo.text}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })()}
                                                            </div>

                                                            <div className="flex gap-0.5 mb-3">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className="w-4 h-4"
                                                                        style={{
                                                                            fill: i < t.rating ? config.accentColor : (config.cardTheme === 'cinematic' ? '#52525b' : '#e4e4e7'),
                                                                            color: i < t.rating ? config.accentColor : (config.cardTheme === 'cinematic' ? '#52525b' : '#e4e4e7'),
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>

                                                            {/* Content */}
                                                            <ExpandableContent
                                                                content={t.content}
                                                                fontFamily={config.fontFamily}
                                                                textColorClass={cardTheme.textColor === 'text-white' ? 'text-zinc-300' : 'text-zinc-700'}
                                                                subtitleColorClass={cardTheme.subtitleColor}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
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
                <WallDesignStudioSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    config={config}
                    updateConfig={updateConfig}
                    templates={TEMPLATES}
                    cardThemes={CARD_THEMES}
                    onSelectTestimonials={() => setIsSelectTestimonialsOpen(true)}
                    selectedTestimonialsCount={selectedTestimonialIds.length}
                />
            </div>

            {/* ===================== EMBED CODE SIDEBAR ===================== */}
            <ShareWallOfLoveSidebar
                isOpen={embedSidebarOpen}
                onClose={() => setEmbedSidebarOpen(false)}
                shareableLink={wallId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/wall/${wallId}` : undefined}
            />

            {/* ===================== SELECT TESTIMONIALS MODAL ===================== */}
            <SelectTestimonialsModal
                isOpen={isSelectTestimonialsOpen}
                onClose={() => setIsSelectTestimonialsOpen(false)}
                testimonials={modalTestimonials}
                selectedIds={selectedTestimonialIds}
                onSelectionChange={setSelectedTestimonialIds}
            />

            {/* ===================== SAVE & EMBED MODAL ===================== */}
            <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
                <DialogContent className="sm:max-w-md bg-white text-zinc-900 border-zinc-200">
                    <DialogHeader>
                        <DialogTitle>Save your Wall of Love</DialogTitle>
                        <DialogDescription>
                            {saveSource === 'embed'
                                ? "Give your wall a name to save it and generate the embed code."
                                : "Please confirm the name of your wall to save it."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="wall-name" className="text-zinc-700">Name</Label>
                            <Input
                                id="wall-name"
                                value={wallName}
                                onChange={(e) => setWallName(e.target.value)}
                                placeholder="My Awesome Wall"
                                className="bg-white border-zinc-300 text-zinc-900 focus-visible:ring-violet-500"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)} className="text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
                            Cancel
                        </Button>
                        <Button onClick={handleModalSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-500 text-white">
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                saveSource === 'embed' ? "Save & Get Code" : "Confirm Save"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toast notifications */}
            <Toaster position="bottom-right" theme="dark" richColors />
        </div>
    )
}
