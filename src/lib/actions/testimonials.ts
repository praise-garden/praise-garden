"use server"

import { createClient } from "@/lib/supabase/server"
import {
    Testimonial,
    CreateTestimonialInput,
    UpdateTestimonialInput
} from "@/types/database"

/**
 * Server Actions for Testimonials
 * 
 * These functions run on the server and handle all CRUD operations
 * for testimonials. RLS (Row Level Security) in Supabase ensures
 * users can only access their own data.
 */

// ===================== GET ALL TESTIMONIALS ===================== //

export async function getTestimonials(): Promise<{
    data: Testimonial[] | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { data: null, error: "Not authenticated" }
        }

        // Fetch testimonials - RLS handles filtering by user_id
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching testimonials:", error)
            return { data: null, error: error.message }
        }

        return { data: data as Testimonial[], error: null }
    } catch (err) {
        console.error("Unexpected error in getTestimonials:", err)
        return { data: null, error: "An unexpected error occurred" }
    }
}

// ===================== GET SINGLE TESTIMONIAL ===================== //

export async function getTestimonialById(id: string): Promise<{
    data: Testimonial | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { data: null, error: "Not authenticated" }
        }

        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return { data: null, error: error.message }
        }

        return { data: data as Testimonial, error: null }
    } catch (err) {
        return { data: null, error: "An unexpected error occurred" }
    }
}

// ===================== CREATE TESTIMONIAL ===================== //

export async function createTestimonial(input: CreateTestimonialInput): Promise<{
    data: Testimonial | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { data: null, error: "Not authenticated" }
        }

        const { data, error } = await supabase
            .from('testimonials')
            .insert({
                user_id: user.id,
                author_name: input.author_name,
                author_title: input.author_title || '',
                author_avatar_url: input.author_avatar_url || null,
                rating: input.rating ?? 5,
                content: input.content,
                source: input.source || 'MANUAL',
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating testimonial:", error)
            return { data: null, error: error.message }
        }

        return { data: data as Testimonial, error: null }
    } catch (err) {
        console.error("Unexpected error in createTestimonial:", err)
        return { data: null, error: "An unexpected error occurred" }
    }
}

// ===================== UPDATE TESTIMONIAL ===================== //

export async function updateTestimonial(input: UpdateTestimonialInput): Promise<{
    data: Testimonial | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { data: null, error: "Not authenticated" }
        }

        const { id, ...updateData } = input

        const { data, error } = await supabase
            .from('testimonials')
            .update({
                ...updateData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error("Error updating testimonial:", error)
            return { data: null, error: error.message }
        }

        return { data: data as Testimonial, error: null }
    } catch (err) {
        console.error("Unexpected error in updateTestimonial:", err)
        return { data: null, error: "An unexpected error occurred" }
    }
}

// ===================== DELETE TESTIMONIAL ===================== //

export async function deleteTestimonial(id: string): Promise<{
    success: boolean;
    error: string | null;
}> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: "Not authenticated" }
        }

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Error deleting testimonial:", error)
            return { success: false, error: error.message }
        }

        return { success: true, error: null }
    } catch (err) {
        console.error("Unexpected error in deleteTestimonial:", err)
        return { success: false, error: "An unexpected error occurred" }
    }
}

// ===================== BULK DELETE TESTIMONIALS ===================== //

export async function deleteTestimonials(ids: string[]): Promise<{
    success: boolean;
    error: string | null;
}> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: "Not authenticated" }
        }

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .in('id', ids)

        if (error) {
            console.error("Error deleting testimonials:", error)
            return { success: false, error: error.message }
        }

        return { success: true, error: null }
    } catch (err) {
        console.error("Unexpected error in deleteTestimonials:", err)
        return { success: false, error: "An unexpected error occurred" }
    }
}
