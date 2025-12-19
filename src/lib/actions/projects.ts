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

    const { error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            name: name.trim()
        });

    if (error) {
        console.error("Failed to create project:", error);
        throw new Error("Failed to create project: " + error.message);
    }

    revalidatePath("/dashboard");
    return { success: true };
}
