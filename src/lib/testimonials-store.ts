// Shared testimonial types and default demo data
// This module provides type definitions and default testimonials for widget previews

// ==================== TYPE DEFINITIONS ====================

/**
 * Testimonial as stored in the dashboard (from database/user input)
 */
export interface DashboardTestimonial {
    id: number;
    name: string;
    email: string;
    title: string;
    rating: number;
    text: string;
    source: string;
    status: string;
    date: string;
    avatar: string;
}

/**
 * Testimonial in the format expected by widgets (normalized format)
 */
export interface WidgetTestimonial {
    id: string;
    authorName: string;
    authorTitle: string;
    authorAvatarUrl?: string;
    rating: number;
    content: string;
    source: string;
    date: string;
}

// ==================== CONVERSION UTILITIES ====================

/**
 * Convert a dashboard testimonial to widget format
 */
export function convertToWidgetFormat(testimonial: DashboardTestimonial): WidgetTestimonial {
    return {
        id: testimonial.id.toString(),
        authorName: testimonial.name,
        authorTitle: testimonial.title,
        authorAvatarUrl: undefined, // Dashboard doesn't store avatar URLs by default
        rating: testimonial.rating,
        content: testimonial.text,
        source: testimonial.source.toUpperCase(),
        date: testimonial.date,
    };
}

/**
 * Convert multiple dashboard testimonials to widget format
 */
export function convertManyToWidgetFormat(testimonials: DashboardTestimonial[]): WidgetTestimonial[] {
    return testimonials.map(convertToWidgetFormat);
}

// ==================== DEFAULT DEMO DATA ====================

/**
 * Default demo testimonials shown when user has no testimonials or no selections
 * These provide a nice preview experience in the widget editor
 */
export const DEFAULT_DEMO_TESTIMONIALS: WidgetTestimonial[] = [
    {
        id: "demo-1",
        authorName: "Sarah Chen",
        authorTitle: "Senior FE Engineer",
        authorAvatarUrl: "/avatars/sarah.jpg",
        rating: 5,
        content: "This widget builder is an absolute game-changer. I used to spend hours custom-coding testimonials for every landing page. Now I just tweak a few sliders and copy the embed code. The design quality is top-notch right out of the box.",
        source: "TWITTER",
        date: "Oct 15, 2023"
    },
    {
        id: "demo-2",
        authorName: "Mike Ross",
        authorTitle: "Product Designer",
        authorAvatarUrl: "/avatars/mike.jpg",
        rating: 5,
        content: "The widget builder is an absolute game-changer. I used to spend hours custom-coding testimonials for every landing page. Now I just tweak a few sliders and copy the embed code.",
        source: "TWITTER",
        date: "Oct 14, 2023"
    },
    {
        id: "demo-3",
        authorName: "Amanda Lee",
        authorTitle: "Startup Founder",
        authorAvatarUrl: "/avatars/amanda.jpg",
        rating: 4,
        content: "This widget builder is an absolute game-changer. I used to spend custom-coding testimonials for evening pages. Now I just tweak a few sliders and copy the embed code.",
        source: "LINKEDIN",
        date: "Oct 13, 2023"
    },
    {
        id: "demo-4",
        authorName: "David Park",
        authorTitle: "Marketing Lead",
        authorAvatarUrl: "/avatars/david.jpg",
        rating: 5,
        content: "This widget builder is an absolute game-changer. I used to spend custom-coding testimonials for evening pages. Now I just tweak a few sliders and more.",
        source: "FACEBOOK",
        date: "Oct 12, 2023"
    },
];

// ==================== SAMPLE USER DATA ====================

/**
 * Sample user testimonials (simulates data from dashboard)
 * In production, this would come from your database via API or server component
 */
export const SAMPLE_USER_TESTIMONIALS: DashboardTestimonial[] = [
    {
        id: 1,
        name: "Bert",
        email: "h@gmail.com",
        title: "Co-Founder of Startups",
        rating: 5,
        text: "This is a fantastic product! It has completely changed my workflow.",
        source: "Web Form",
        status: "Public",
        date: "Sep 23, 2025",
        avatar: "B"
    },
    {
        id: 2,
        name: "Alice",
        email: "alice@example.com",
        title: "Lead Designer",
        rating: 4,
        text: "Great design and easy to use. I would recommend it to my colleagues.",
        source: "Import",
        status: "Public",
        date: "Sep 22, 2025",
        avatar: "A"
    },
    {
        id: 3,
        name: "Charlie",
        email: "charlie@startup.io",
        title: "CEO",
        rating: 5,
        text: "A game-changer for our company. We've seen a huge increase in engagement.",
        source: "Web Form",
        status: "Hidden",
        date: "Sep 21, 2025",
        avatar: "C"
    },
    {
        id: 4,
        name: "Diana",
        email: "diana@service.com",
        title: "Marketing Manager",
        rating: 5,
        text: "Incredible tool that has helped us gather valuable feedback.",
        source: "Email",
        status: "Public",
        date: "Sep 20, 2025",
        avatar: "D"
    },
    {
        id: 5,
        name: "Ethan",
        email: "ethan@e-corp.com",
        title: "Software Engineer",
        rating: 3,
        text: "It's a good tool, but there are a few features I'd like to see added.",
        source: "Import",
        status: "Hidden",
        date: "Sep 19, 2025",
        avatar: "E"
    }
];

/**
 * Get sample user testimonials in widget format
 * This is what you'd call in a page component to pass to WidgetEditorClient
 */
export function getSampleUserTestimonials(): WidgetTestimonial[] {
    return convertManyToWidgetFormat(SAMPLE_USER_TESTIMONIALS);
}
