import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server-auth";
import FormsPageClient from "@/components/FormsPageClient";
import type { Form } from "@/types/form-config";

export default async function FormsPage() {
  await requireAuth();
  const supabase = await createClient();

  // Fetch all forms for the user's projects
  const { data: forms, error } = await supabase
    .from('forms')
    .select(`
      *,
      project:projects(id, name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching forms:", error);
    // Render the client component with an empty array to show an error state
    return <FormsPageClient initialForms={[]} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] min-h-screen">
        <Sidebar />
        <div className="flex flex-col">
          <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-gray-800 transition-colors"
                  aria-label="Open navigation"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Menu
                </button>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Forms</h1>
                  <p className="text-sm text-gray-400">Create and manage your testimonial forms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                  <span>Acme Corporation</span>
                  <span>/</span>
                  <span className="text-gray-50">Forms</span>
                </div>
              </div>
            </div>
          </header>
          <FormsPageClient initialForms={forms as Form[]} />
        </div>
      </div>
    </div>
  );
}

