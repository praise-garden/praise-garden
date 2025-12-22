import { getTestimonialById } from "@/lib/data/testimonials";
import { notFound } from "next/navigation";
import { TrimVideoClient } from "./TrimVideoClient";

export default async function TrimVideoPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonialById(params.id);

    if (!testimonial) {
        notFound();
    }

    return <TrimVideoClient testimonial={testimonial} />;
}
