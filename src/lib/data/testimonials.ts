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
        reviewer: t.data.customer_name || "Anonymous",
        email: t.data.customer_email || "",
        profession: t.data.profession || t.data.customer_headline || t.data.company?.job_title || "",
        rating: t.data.rating || 5,
        text: t.data.message || "",
        source: t.data.source || "Manual",
        status: t.status === 'approved' ? 'Public' : (t.status === 'pending' ? 'Pending' : 'Hidden'),
        date: new Date(t.data.testimonial_date || t.created_at).toLocaleDateString(),
        avatar: (t.data.customer_name?.[0] || "A").toUpperCase(),
        // Keep original data handy if needed
        raw: t
    }));
}
