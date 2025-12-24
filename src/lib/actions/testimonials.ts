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

    // Transform raw DB data to the Testimonial interface expected by the app
    // DB structure: { id, type, data: { customer_name, rating, message, ... }, created_at, ... }
    // App structure: { id, author_name, rating, content, type, videoUrl, videoThumbnail, attachments, ... }
    const transformedData = data.map(t => {
        // Build attachments array from available image sources
        const attachments: { type: 'image' | 'video', url: string }[] = [];

        // Add company logo if available
        if (t.data?.company?.logo_url) {
            attachments.push({ type: 'image', url: t.data.company.logo_url });
        } else if (t.data?.company_logo_url) {
            attachments.push({ type: 'image', url: t.data.company_logo_url });
        }

        // For video testimonials, add thumbnail as an attachment too
        if (t.type === 'video') {
            const thumbnail = t.data?.thumbnails?.[t.data?.selected_thumbnail_index || 0];
            if (thumbnail) {
                attachments.push({ type: 'image', url: thumbnail });
            }
        }

        return {
            id: t.id,
            user_id: t.user_id,
            type: t.type || 'text', // 'text' or 'video'
            author_name: t.data?.customer_name || 'Anonymous',
            author_title: t.data?.profession || t.data?.customer_headline || t.data?.company?.job_title || '',
            author_avatar_url: t.data?.customer_avatar_url || t.data?.media?.avatar_url || null,
            rating: t.data?.rating ?? 5,
            content: t.data?.message || '',
            source: t.data?.source || 'MANUAL',
            video_url: t.data?.media?.video_url || null,
            video_thumbnail: t.data?.thumbnails?.[t.data?.selected_thumbnail_index || 0] || null,
            attachments,
            created_at: t.created_at,
            updated_at: t.updated_at || t.created_at,
        };
    });

    return { data: transformedData, error: null };
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

    // 1. Fetch data to identify files and customer email
    const { data: record } = await supabase
        .from('testimonials')
        .select('data, project_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    // Store customer email and project_id for cleanup later
    const customerEmail = record?.data?.customer_email;
    const projectId = record?.project_id;

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

    // 2. Delete the testimonial
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error("Delete error:", error);
        throw new Error("Failed to delete testimonial: " + error.message);
    }

    // 3. Cleanup orphaned customer record
    if (customerEmail && projectId) {
        try {
            // Count remaining testimonials with this email in this project
            const { count, error: countError } = await supabase
                .from('testimonials')
                .select('id', { count: 'exact', head: true })
                .eq('project_id', projectId)
                .eq('user_id', user.id)
                .filter('data->>customer_email', 'eq', customerEmail);

            if (countError) {
                console.error("Error counting testimonials for customer cleanup:", countError);
            } else if (count === 0) {
                // No other testimonials with this email - delete the customer record
                const { error: deleteCustomerError } = await supabase
                    .from('customers')
                    .delete()
                    .eq('project_id', projectId)
                    .eq('email', customerEmail);

                if (deleteCustomerError) {
                    console.error("Failed to delete orphaned customer:", deleteCustomerError);
                } else {
                    console.log(`Deleted orphaned customer record for email: ${customerEmail}`);
                }
            } else {
                console.log(`Customer ${customerEmail} has ${count} remaining testimonials, keeping customer record.`);
            }
        } catch (customerCleanupError) {
            // Don't block deletion success just because customer cleanup failed
            console.error("Customer cleanup failed:", customerCleanupError);
        }
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

    // Fetch existing testimonial with project_id
    const { data: existing, error: fetchError } = await supabase
        .from('testimonials')
        .select('data, project_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !existing) throw new Error("Testimonial not found");

    const projectId = existing.project_id;
    const originalEmail = existing.data?.customer_email;
    const newEmail = data.customer_email;

    // If email is being changed, check if it already exists in customers table
    if (newEmail && newEmail !== originalEmail) {
        const { count, error: checkError } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId)
            .eq('email', newEmail);

        if (checkError) {
            console.error("Error checking customer email:", checkError);
        }

        if (count && count > 0) {
            return { success: false, error: "This email already exists" };
        }
    }

    // Merge incoming updates with existing data
    const newData = {
        ...existing.data,
        ...data // Merge incoming updates
    };

    // If company data is being updated, merge it properly
    if (data.company && existing.data?.company) {
        newData.company = {
            ...existing.data.company,
            ...data.company
        };
    }

    // Update the testimonial
    const { error } = await supabase
        .from('testimonials')
        .update({ data: newData })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error("Update content error:", error);
        throw new Error("Failed to update content: " + error.message);
    }

    // Sync customer record if email was changed
    if (newEmail && newEmail !== originalEmail && projectId) {
        try {
            if (originalEmail) {
                // Update existing customer record's email
                const { error: updateCustomerError } = await supabase
                    .from('customers')
                    .update({
                        email: newEmail,
                        full_name: data.customer_name || newData.customer_name,
                        headline: data.customer_headline || newData.customer_headline,
                    })
                    .eq('project_id', projectId)
                    .eq('email', originalEmail);

                if (updateCustomerError) {
                    console.error("Failed to update customer email:", updateCustomerError);
                } else {
                    console.log(`Updated customer email from ${originalEmail} to ${newEmail}`);
                }
            } else {
                // No original email - insert new customer
                await supabase.from('customers').insert({
                    project_id: projectId,
                    email: newEmail,
                    full_name: data.customer_name || newData.customer_name || 'Anonymous',
                    headline: data.customer_headline || newData.customer_headline,
                    company_details: newData.company || {},
                    social_profiles: {}
                });
                console.log(`Created new customer record for ${newEmail}`);
            }
        } catch (customerSyncError) {
            console.error("Customer sync failed:", customerSyncError);
            // Don't fail the main update
        }
    } else if (originalEmail && projectId) {
        // Email not changed but other customer details might have changed - update customer record
        try {
            const { error: updateCustomerError } = await supabase
                .from('customers')
                .update({
                    full_name: data.customer_name || newData.customer_name,
                    headline: data.customer_headline || newData.customer_headline,
                    company_details: newData.company || existing.data?.company || {}
                })
                .eq('project_id', projectId)
                .eq('email', originalEmail);

            if (updateCustomerError) {
                console.error("Failed to sync customer details:", updateCustomerError);
            }
        } catch (customerSyncError) {
            console.error("Customer details sync failed:", customerSyncError);
        }
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function duplicateTestimonial(id: string | number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Fetch the existing testimonial
    const { data: existing, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !existing) {
        console.error("Error fetching testimonial for duplication:", fetchError);
        throw new Error("Testimonial not found");
    }

    // Create a copy with modified name to indicate it's a duplicate
    const duplicatedData = {
        ...existing.data,
        customer_name: `${existing.data?.customer_name || 'Anonymous'} (Copy)`,
    };

    // Insert the duplicated testimonial
    const { data: newTestimonial, error: insertError } = await supabase
        .from('testimonials')
        .insert({
            type: existing.type,
            user_id: user.id,
            project_id: existing.project_id,
            data: duplicatedData,
            status: existing.status
        })
        .select('id')
        .single();

    if (insertError) {
        console.error("Error duplicating testimonial:", insertError);
        throw new Error("Failed to duplicate testimonial: " + insertError.message);
    }

    revalidatePath("/dashboard");

    return { success: true, newId: newTestimonial?.id };
}
