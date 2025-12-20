"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./AuthContext"
import {
    Testimonial,
    CreateTestimonialInput,
    UpdateTestimonialInput,
    UserData
} from "@/types/database"
import {
    getTestimonials,
    createTestimonial as createTestimonialAction,
    updateTestimonialContent as updateTestimonialAction,
    deleteTestimonial as deleteTestimonialAction,
} from "@/lib/actions/testimonials"

/**
 * User Data Context
 * 
 * This context provides user-specific application data to all client components.
 * Data is fetched ONCE when the user logs in and cached in memory.
 * 
 * Features:
 * - Single fetch on login (not per-page)
 * - Optimistic updates for instant UI feedback
 * - Auto-sync with database in background
 * - Shared state across all components
 * 
 * Usage:
 *   const { testimonials, addTestimonial, loading } = useUserData()
 */

// ===================== CONTEXT TYPE ===================== //

interface UserDataContextType {
    // Data
    testimonials: Testimonial[]

    // Loading states
    loading: boolean
    testimonialsLoading: boolean

    // Error states
    error: string | null

    // Testimonial actions
    refreshTestimonials: () => Promise<void>
    addTestimonial: (input: CreateTestimonialInput) => Promise<{ success: boolean; error?: string }>
    updateTestimonial: (input: UpdateTestimonialInput) => Promise<{ success: boolean; error?: string }>
    removeTestimonial: (id: string) => Promise<{ success: boolean; error?: string }>

    // Utility
    clearData: () => void
}

const defaultContext: UserDataContextType = {
    testimonials: [],
    loading: true,
    testimonialsLoading: false,
    error: null,
    refreshTestimonials: async () => { },
    addTestimonial: async () => ({ success: false }),
    updateTestimonial: async () => ({ success: false }),
    removeTestimonial: async () => ({ success: false }),
    clearData: () => { },
}

const UserDataContext = createContext<UserDataContextType>(defaultContext)

// ===================== HOOK ===================== //

export const useUserData = () => {
    const context = useContext(UserDataContext)
    if (!context) {
        throw new Error("useUserData must be used within a UserDataProvider")
    }
    return context
}

// ===================== PROVIDER ===================== //

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, loading: authLoading } = useAuth()

    // Data state
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])

    // Loading states
    const [loading, setLoading] = useState(true)
    const [testimonialsLoading, setTestimonialsLoading] = useState(false)

    // Error state
    const [error, setError] = useState<string | null>(null)

    // Track if initial fetch is done
    const [hasFetched, setHasFetched] = useState(false)

    // ===================== FETCH ALL DATA ===================== //

    const fetchAllData = useCallback(async () => {
        if (!user) {
            setTestimonials([])
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Fetch testimonials
            const { data, error: fetchError } = await getTestimonials()

            if (fetchError) {
                setError(fetchError)
                console.error("Error fetching testimonials:", fetchError)
            } else {
                setTestimonials(data || [])
            }
        } catch (err) {
            setError("Failed to fetch user data")
            console.error("Unexpected error fetching data:", err)
        } finally {
            setLoading(false)
            setHasFetched(true)
        }
    }, [user])

    // ===================== REFRESH TESTIMONIALS ===================== //

    const refreshTestimonials = useCallback(async () => {
        if (!user) return

        setTestimonialsLoading(true)

        try {
            const { data, error: fetchError } = await getTestimonials()

            if (fetchError) {
                console.error("Error refreshing testimonials:", fetchError)
            } else {
                setTestimonials(data || [])
            }
        } catch (err) {
            console.error("Unexpected error refreshing testimonials:", err)
        } finally {
            setTestimonialsLoading(false)
        }
    }, [user])

    // ===================== ADD TESTIMONIAL ===================== //

    const addTestimonial = useCallback(async (input: CreateTestimonialInput) => {
        if (!user) return { success: false, error: "Not authenticated" }

        // Create optimistic entry
        const optimisticId = `temp-${Date.now()}`
        const optimisticTestimonial: Testimonial = {
            id: optimisticId,
            user_id: user.id,
            author_name: input.author_name,
            author_title: input.author_title || '',
            author_avatar_url: input.author_avatar_url,
            rating: input.rating ?? 5,
            content: input.content,
            source: input.source || 'MANUAL',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        // Optimistic update - add to state immediately
        setTestimonials(prev => [optimisticTestimonial, ...prev])

        try {
            const { data, error } = await createTestimonialAction(input)

            if (error || !data) {
                // Rollback on error
                setTestimonials(prev => prev.filter(t => t.id !== optimisticId))
                return { success: false, error: error || "Failed to create testimonial" }
            }

            // Replace optimistic entry with real data
            setTestimonials(prev =>
                prev.map(t => t.id === optimisticId ? data : t)
            )

            return { success: true }
        } catch (err) {
            // Rollback on error
            setTestimonials(prev => prev.filter(t => t.id !== optimisticId))
            return { success: false, error: "An unexpected error occurred" }
        }
    }, [user])

    // ===================== UPDATE TESTIMONIAL ===================== //

    const updateTestimonialHandler = useCallback(async (input: UpdateTestimonialInput) => {
        if (!user) return { success: false, error: "Not authenticated" }

        // Store original for rollback
        const original = testimonials.find(t => t.id === input.id)
        if (!original) return { success: false, error: "Testimonial not found" }

        // Optimistic update
        setTestimonials(prev =>
            prev.map(t => t.id === input.id ? { ...t, ...input, updated_at: new Date().toISOString() } : t)
        )

        try {
            const { id, ...data } = input
            const result = await updateTestimonialAction(id, data)

            if (!result.success) {
                // Rollback on error
                setTestimonials(prev => prev.map(t => t.id === input.id ? original : t))
                return { success: false, error: "Failed to update testimonial" }
            }

            // Update successful - keep optimistic state or fetch fresh if needed
            // For now, optimistic state is fine as it matches input
            return { success: true }
        } catch (err: any) {
            // Rollback on error
            setTestimonials(prev => prev.map(t => t.id === input.id ? original : t))
            return { success: false, error: err.message || "An unexpected error occurred" }
        }
    }, [user, testimonials])

    // ===================== REMOVE TESTIMONIAL ===================== //

    const removeTestimonial = useCallback(async (id: string) => {
        if (!user) return { success: false, error: "Not authenticated" }

        // Store original for rollback
        const original = testimonials.find(t => t.id === id)
        if (!original) return { success: false, error: "Testimonial not found" }

        // Optimistic delete
        setTestimonials(prev => prev.filter(t => t.id !== id))

        try {
            const { success, error } = await deleteTestimonialAction(id)

            if (!success) {
                // Rollback on error
                setTestimonials(prev => [...prev, original].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                ))
                return { success: false, error: error || "Failed to delete testimonial" }
            }

            return { success: true }
        } catch (err) {
            // Rollback on error
            setTestimonials(prev => [...prev, original].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ))
            return { success: false, error: "An unexpected error occurred" }
        }
    }, [user, testimonials])

    // ===================== CLEAR DATA ===================== //

    const clearData = useCallback(() => {
        setTestimonials([])
        setHasFetched(false)
        setError(null)
    }, [])

    // ===================== EFFECTS ===================== //

    // Fetch data when user authenticates
    useEffect(() => {
        if (!authLoading && user && !hasFetched) {
            fetchAllData()
        }
    }, [user, authLoading, hasFetched, fetchAllData])

    // Clear data when user logs out
    useEffect(() => {
        if (!authLoading && !user) {
            clearData()
            setLoading(false)
        }
    }, [user, authLoading, clearData])

    // ===================== RENDER ===================== //

    const value: UserDataContextType = {
        testimonials,
        loading: loading || authLoading,
        testimonialsLoading,
        error,
        refreshTestimonials,
        addTestimonial,
        updateTestimonial: updateTestimonialHandler,
        removeTestimonial,
        clearData,
    }

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    )
}
