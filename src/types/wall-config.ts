// ================================================================= //
//                       WALL OF LOVE CONFIGURATION                  //
// ================================================================= //
// This file defines the configuration structure for Wall of Love.
// All wall settings are stored in a single config object for:
// - Easy save/load to database (JSONB)
// - Clean code with fewer state variables
// - Type-safe configuration management
// ================================================================= //

/**
 * WallConfig Interface
 * 
 * Contains all customizable properties for a Wall of Love.
 * This object is stored as JSONB in the database.
 */
export interface WallConfig {
    // Layout & Theme
    style: 'glassmorphism' | 'brutalist' | 'cinematic' | 'classic'
    cardTheme: 'glassmorphism' | 'cinematic' | 'brutalist'

    // Colors
    backgroundColor: string
    accentColor: string
    textColor: string

    // Typography
    fontFamily: string

    // Branding
    logoUrl: string | null
    logoSize: number

    // Effects
    shadowIntensity: number

    // Display Options
    showRating: boolean
    showDate: boolean
    showSourceIcon: boolean
    showHeader: boolean

    // Header Content
    headerTitle: string
    headerSubtitle: string
}

/**
 * Default configuration for new Walls of Love
 */
export const DEFAULT_WALL_CONFIG: WallConfig = {
    // Layout
    style: 'classic',
    cardTheme: 'glassmorphism',

    // Colors
    backgroundColor: '#f0f4ff',
    accentColor: '#8b5cf6',
    textColor: '#18181b',

    // Typography
    fontFamily: 'Inter',

    // Branding
    logoUrl: null,
    logoSize: 60,

    // Effects
    shadowIntensity: 50,

    // Display Options
    showRating: true,
    showDate: true,
    showSourceIcon: true,
    showHeader: true,

    // Header Content
    headerTitle: 'Wall of Love',
    headerSubtitle: "We're loved by entrepreneurs, creators, freelancers and agencies from all over the world.",
}

/**
 * Type for config update function
 */
export type UpdateConfigFn = <K extends keyof WallConfig>(
    key: K,
    value: WallConfig[K]
) => void

/**
 * Helper to create a config updater function
 */
export const createConfigUpdater = (
    setConfig: React.Dispatch<React.SetStateAction<WallConfig>>
): UpdateConfigFn => {
    return (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }
}
