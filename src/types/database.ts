/**
 * Database Types for User Data
 * 
 * These types represent the structure of data stored in Supabase
 * and used throughout the application.
 */

// ===================== TESTIMONIAL TYPES ===================== //

export interface Testimonial {
    id: string;
    user_id: string;
    author_name: string;
    author_title: string;
    author_avatar_url?: string;
    rating: number;
    content: string;
    source: 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'PLAYSTORE' | 'APPSTORE' | 'GOOGLE' | 'MANUAL' | string;
    created_at: string;
    updated_at: string;
}

export interface CreateTestimonialInput {
    author_name: string;
    author_title?: string;
    author_avatar_url?: string;
    rating?: number;
    content: string;
    source?: string;
}

export interface UpdateTestimonialInput {
    id: string;
    author_name?: string;
    author_title?: string;
    author_avatar_url?: string;
    rating?: number;
    content?: string;
    source?: string;
}

// ===================== PROJECT TYPES ===================== //

export interface Project {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    logo_url?: string;
    website_url?: string;
    created_at: string;
    updated_at: string;
}

// ===================== WIDGET TYPES ===================== //

export interface Widget {
    id: string;
    user_id: string;
    project_id?: string;
    name: string;
    type: string;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
}

// ===================== WALL TYPES ===================== //

export interface Wall {
    id: string;
    user_id: string;
    project_id?: string;
    name: string;
    slug: string;
    style: 'glassmorphism' | 'brutalist' | 'cinematic' | 'classic';
    config: Record<string, any>;
    testimonial_ids: string[];
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// ===================== USER DATA AGGREGATE ===================== //

export interface UserData {
    testimonials: Testimonial[];
    projects: Project[];
    widgets: Widget[];
    walls: Wall[];
}
