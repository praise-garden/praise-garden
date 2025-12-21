import { getTestimonialById } from "@/lib/data/testimonials";
import { notFound } from "next/navigation";
import { TestimonialContentWrapper } from "./TestimonialContentWrapper";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonialById(params.id);

    if (!testimonial) {
        notFound();
    }

    return <TestimonialContentWrapper testimonial={testimonial} />;
}
