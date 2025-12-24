import { getTestimonialById, getTestimonialsByEmail } from "@/lib/data/testimonials";
import { notFound } from "next/navigation";
import { TestimonialContentWrapper } from "./TestimonialContentWrapper";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
        notFound();
    }

    // Fetch other testimonials from the same user (by email)
    const relatedTestimonials = await getTestimonialsByEmail(testimonial.email, testimonial.id);

    return <TestimonialContentWrapper testimonial={testimonial} relatedTestimonials={relatedTestimonials} />;
}
