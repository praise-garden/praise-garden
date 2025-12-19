"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getTestimonials() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: null, error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching testimonials:", error);
        return { data: null, error: error.message };
    }

    return { data, error: null };
}

export async function createTestimonial(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // 1. Get Project ID (MVP: Use first existing project or create 'Default Project')
    let { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

    if (!project) {
        // Create default project if none exists
        const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name: 'My First Project'
            })
            .select('id')
            .single();

        if (createError) {
            console.error("Failed to create default project:", createError);
            throw new Error("Could not find or create a project.");
        }
        project = newProject;
    }

    const projectId = project.id;

    // 2. Prepare Data
    // We assume formData handles the structure. 
    // In a real app, validating with Zod here is recommended.
    const {
        type,
        rating,
        tags,
        customer_name,
        customer_email,
        customer_headline,
        customer_avatar_url,
        company_name,
        company_title,
        company_website,
        company_logo_url,
        testimonial_title,
        testimonial_message,
        testimonial_date,
        original_post_url,
        source
    } = formData;

    const data = {
        type,
        rating,
        title: testimonial_title,
        message: testimonial_message,
        source: source || 'manual',
        customer_name,
        customer_email,
        profession: customer_headline,
        testimonial_date,
        original_post_url,
        tags: tags || [],
        company: {
            name: company_name,
            job_title: company_title,
            website: company_website,
            logo_url: company_logo_url
        },
        media: {
            avatar_url: customer_avatar_url,
            video_url: formData.video_url
        }
    };

    // 3. Insert Testimonial
    const { error } = await supabase
        .from('testimonials')
        .insert({
            type: type, // Insert top-level type column
            user_id: user.id,
            project_id: projectId,
            data: data,
            status: 'hidden' // Default to hidden
        });

    if (error) {
        console.error("Insert error:", error);
        throw new Error("Failed to save testimonial: " + error.message);
    }

    // 4. Revalidate
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/import/manual");

    // Optional: Return success
    return { success: true };
}

export async function updateTestimonialStatus(id: string | number, status: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error("Update status error:", error);
        throw new Error("Failed to update status: " + error.message);
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteTestimonial(id: string | number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error("Delete error:", error);
        throw new Error("Failed to delete testimonial: " + error.message);
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateTestimonialContent(id: string | number, data: any) {
    // This is a bit more complex because 'data' is a JSONB column.
    // We first need to fetch the existing data, merge it, and save it back.
    // OR if we are sure we are sending the FULL data structure, we can just overwrite 'data'.

    // For this MVP, let's assume we are updating specific top-level fields in the JSON
    // or we can implement a shallow merge at SQL level if needed, but fetching+merging in JS is safer for deep objects.

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Fetch existing
    const { data: existing, error: fetchError } = await supabase
        .from('testimonials')
        .select('data')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !existing) throw new Error("Testimonial not found");

    const newData = {
        ...existing.data,
        ...data // Merge incoming updates (e.g., customer_name, message, etc.)
    };

    const { error } = await supabase
        .from('testimonials')
        .update({ data: newData })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error("Update content error:", error);
        throw new Error("Failed to update content: " + error.message);
    }

    revalidatePath("/dashboard");
    return { success: true };
}
