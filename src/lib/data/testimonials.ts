import { createClient } from "@/lib/supabase/server";

export async function getTestimonialsForProject(projectId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }

    // Transform database shape to UI shape if necessary
    // DB shape: { id, user_id, project_id, status, data: { ...fields }, created_at }
    // UI shape: Testimonial interface in page.tsx
    return data.map((t) => ({
        id: t.id,
        type: t.type, // 'text' or 'video'
        reviewer: t.data.customer_name || "Anonymous",
        email: t.data.customer_email || "",
        profession: t.data.profession || t.data.customer_headline || t.data.company?.job_title || "",
        rating: t.data.rating || 5,
        text: t.data.message || "",
        source: t.data.source || "Manual",
        status: t.status === 'public' ? 'Public' : (t.status === 'hidden' ? 'Hidden' : 'Archived'),
        date: new Date(t.data.testimonial_date || t.created_at).toLocaleDateString(),
        avatar: t.data.customer_avatar_url || t.data.media?.avatar_url || "",
        attachments: [
            t.data.company?.logo_url ? { type: 'image', url: t.data.company.logo_url } : null,
            t.data.media?.video_url ? { type: 'video', url: t.data.media.video_url } : null
        ].filter(Boolean) as { type: 'image' | 'video', url: string }[],
        videoThumbnail: t.data.thumbnails?.[t.data.selected_thumbnail_index || 0] || "",
        // Keep original data handy if needed
        raw: t
    }));
}
export async function getTestimonialById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching testimonial:", error);
        return null;
    }

    // Transform database shape to UI shape
    return {
        id: data.id,
        type: data.type,
        reviewer: data.data.customer_name || "Anonymous",
        email: data.data.customer_email || "",
        profession: data.data.profession || data.data.customer_headline || data.data.company?.job_title || "",
        rating: data.data.rating || 5,
        text: data.data.message || "",
        source: data.data.source || "Manual",
        status: data.status === 'public' ? 'Public' : (data.status === 'hidden' ? 'Hidden' : 'Archived'),
        date: new Date(data.data.testimonial_date || data.created_at).toLocaleDateString(),
        avatar: data.data.customer_avatar_url || data.data.media?.avatar_url || "",
        attachments: [
            data.data.company?.logo_url ? { type: 'image', url: data.data.company.logo_url } : null,
            data.data.media?.video_url ? { type: 'video', url: data.data.media.video_url } : null
        ].filter(Boolean) as { type: 'image' | 'video', url: string }[],
        videoThumbnail: data.data.thumbnails?.[data.data.selected_thumbnail_index || 0] || "",
        raw: data
    };
}
