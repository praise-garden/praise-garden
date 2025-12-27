import { uploadImageToStorage } from "./storage";
import { getCloudflareUploadUrl } from "./actions/cloudflare-stream";
import { createClient } from "./supabase/client";

export type VideoUploadResult = {
    type: 'supabase' | 'cloudflare';
    url?: string;
    uid?: string;
    preview?: string;
};

export async function uploadVideo(file: File): Promise<VideoUploadResult> {
    const provider = process.env.NEXT_PUBLIC_VIDEO_PROVIDER;

    if (provider === 'cloudflare-stream') {
        const { id, uploadUrl } = await getCloudflareUploadUrl();

        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error("Cloudflare upload failed");
        }

        return {
            type: 'cloudflare',
            uid: id,
            preview: `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_SUBDOMAIN}.cloudflarestream.com/${id}/iframe`
        };
    } else {
        // Fallback to Supabase
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Basic fallback purely for local testing if auth fails, relying on public buckets if configured
            // But ideally we want to force auth. 
            // Since uploadImageToStorage handles this, we can just call it.
            // We pass a dummy user ID to satisfy types if needed, but normally uploadImageToStorage calls getSession
        }

        // We re-use logic from storage.ts but need to construct the context properly.
        // Since uploadImageToStorage expects a user ID in context usually:
        let userId = user?.id;
        if (!userId) {
            const { data } = await supabase.auth.getSession();
            userId = data.session?.user?.id;
        }

        if (!userId) throw new Error("User must be logged in to upload video");

        const result = await uploadImageToStorage({
            file,
            context: { type: 'user', userId: userId },
            bucket: 'assets'
        });

        return {
            type: 'supabase',
            url: result.url
        };
    }
}
