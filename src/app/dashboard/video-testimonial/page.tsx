import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function VideoTestimonialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] min-h-screen">
        <Sidebar />
        <main className="p-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight">Video Testimonial</h1>
            <p className="text-sm text-gray-400 mt-2">This page is empty for now. We will build the UI next.</p>
          </div>
        </main>
      </div>
    </div>
  );
}


