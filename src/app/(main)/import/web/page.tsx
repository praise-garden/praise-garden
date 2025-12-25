import { createClient } from "@/lib/supabase/server";
import ImportWebClient from "./ImportWebClient";

export default async function ImportWebPage() {
    const supabase = await createClient();

    const { data: files, error } = await supabase
        .storage
        .from('assets')
        .list('Brands', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });

    if (error) {
        console.error("Error fetching brands:", error);
        return (
            <div className="text-red-500">
                Error loading brands. Please try again later.
            </div>
        );
    }

    const sources = (files || [])
        .filter(file => {
            const name = file.name.toLowerCase();
            const isHidden = name === '.emptyfolderplaceholder' || name.startsWith('.');
            const isExcluded = ['sourceforge', 'realtor', 'homestars', 'home-stars'].some(ex => name.includes(ex));
            return !isHidden && !isExcluded;
        })
        .map(file => {
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

            // Format label: transform "app-store" to "App Store", "twitter-x" to "Twitter X"
            let label = nameWithoutExt
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Special cases fix (optional, but nice)
            if (label === "G2") label = "G2"; // Already correct but checks logic
            if (label === "Url") label = "URL";

            const { data } = supabase
                .storage
                .from('assets')
                .getPublicUrl(`Brands/${file.name}`);

            return {
                id: nameWithoutExt,
                label: label,
                image: data.publicUrl
            };
        });

    return <ImportWebClient sources={sources} />;
}
