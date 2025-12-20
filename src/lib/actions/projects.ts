"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;

    if (!name || name.trim().length === 0) {
        throw new Error("Project name is required");
    }

    const { data: project, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            name: name.trim()
        })
        .select()
        .single();

    if (error) {
        console.error("Failed to create project:", error);
        throw new Error("Failed to create project: " + error.message);
    }

    // Set as active project
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ active_project_id: project.id })
        .eq('id', user.id);

    if (profileError) {
        console.error("Failed to set active project:", profileError);
        // Don't throw here, as project was created successfully.
        // The user might just need to manually switch or refresh.
    }

    revalidatePath("/dashboard");
    return { success: true, project };
}

export async function switchProject(projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Verify project belongs to user
    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (!project) {
        throw new Error("Project not found or unauthorized");
    }

    // Update active project in profile
    const { error } = await supabase
        .from('profiles')
        .update({ active_project_id: projectId })
        .eq('id', user.id);

    if (error) {
        console.error("Failed to switch project:", error);
        throw new Error("Failed to switch project");
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateProjectBrand(projectId: string, brandSettings: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('id', projectId)
        .eq('user_id', user.id);

    if (count === 0) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('projects')
        .update({ brand_settings: brandSettings })
        .eq('id', projectId);

    if (error) {
        throw new Error("Failed to update brand settings: " + error.message);
    }

    revalidatePath("/brand");
    revalidatePath("/form-builder");
    return { success: true };
}
