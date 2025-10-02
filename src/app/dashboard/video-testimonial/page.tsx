import Sidebar from "@/components/Sidebar";

export default function VideoTestimonialPage() {
  return (
    <div className="min-h-screen bg-gray-50/30 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] min-h-screen">
        <Sidebar />
        <main className="p-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight">Video Testimonial</h1>
            <p className="text-sm text-gray-500 mt-2">This page is empty for now. We will build the UI next.</p>
          </div>
        </main>
      </div>
    </div>
  );
}


