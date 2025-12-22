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

    // 3. Handle Client-Provided Thumbnails
    if (type === 'video' && formData.thumbnails && Array.isArray(formData.thumbnails)) {
        (data as any).thumbnails = formData.thumbnails;
        (data as any).selected_thumbnail_index = 0;
    }

    // 4. Insert Testimonial
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

    // 5. Sync Customer to Customers Table
    if (customer_email) {
        try {
            // Check if customer exists in this project
            const { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('project_id', projectId)
                .eq('email', customer_email)
                .single();

            if (!existingCustomer) {
                // Insert new customer
                await supabase.from('customers').insert({
                    project_id: projectId,
                    email: customer_email,
                    full_name: customer_name || 'Anonymous',
                    headline: customer_headline,
                    avatar_url: customer_avatar_url,
                    company_details: {
                        name: company_name,
                        job_title: company_title,
                        website: company_website,
                        logo_url: company_logo_url
                    },
                    social_profiles: {} // Empty for manual imports usually, or create from source URL if valid
                });
            }
        } catch (customerError) {
            // Don't block testimonial creation just because customer sync failed
            console.error("Failed to sync customer:", customerError);
        }
    }

    // 6. Revalidate
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

    // 1. Fetch data to identify files
    const { data: record } = await supabase
        .from('testimonials')
        .select('data')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (record?.data) {
        const pathsToDelete: string[] = [];
        const d = record.data;

        // Helper to check if a string is a Cloudflare UID (alphanumeric, no slashes, not a URL)
        const isCloudflareUid = (value: string): boolean => {
            if (!value || typeof value !== 'string') return false;
            // Cloudflare UIDs are typically 32 character alphanumeric strings
            // They don't contain slashes, dots, or http
            return !value.includes('/') &&
                !value.includes('.') &&
                !value.startsWith('http') &&
                !value.startsWith('blob:') &&
                value.length > 10; // UIDs are typically 32 chars
        };

        const extractPath = (url: string) => {
            if (!url || typeof url !== 'string') return null;
            try {
                if (url.includes('/storage/v1/object/public/assets/')) {
                    const parts = url.split('/public/assets/');
                    return parts[1];
                }
                return null;
            } catch { return null; }
        };

        // Check for Cloudflare video UID and delete from Cloudflare
        const videoUrl = d.media?.video_url || d.video_url;
        if (videoUrl && isCloudflareUid(videoUrl)) {
            console.log(`Detected Cloudflare video UID: ${videoUrl}, attempting deletion...`);
            try {
                // Dynamically import to avoid circular dependencies
                const { deleteCloudflareVideo } = await import('./cloudflare-stream');
                const result = await deleteCloudflareVideo(videoUrl);
                if (result.success) {
                    console.log(`Successfully deleted Cloudflare video: ${videoUrl}`);
                } else {
                    console.error(`Failed to delete Cloudflare video: ${result.error}`);
                }
            } catch (cfError) {
                console.error("Error deleting Cloudflare video:", cfError);
                // Continue with deletion even if Cloudflare delete fails
            }
        }

        const potentialUrls = [
            d.customer_avatar_url,
            d.media?.avatar_url,
            d.company_logo_url,
            d.company?.logo_url,
            d.media?.video_url,
            ...(Array.isArray(d.thumbnails) ? d.thumbnails.map((t: any) => typeof t === 'string' ? t : t?.url) : [])
        ];

        potentialUrls.forEach(url => {
            const path = extractPath(url);
            if (path) pathsToDelete.push(path);
        });

        if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('assets')
                .remove(pathsToDelete);

            if (storageError) {
                console.error("Failed to delete associated files:", storageError);
            }
        }
    }

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
        ...data // Merge incoming updates
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
