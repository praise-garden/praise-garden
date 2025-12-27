"use client";

interface Attachment {
    type: string;
    url: string;
}

interface TextTestimonialComponentProps {
    testimonial: any;
    attachments?: Attachment[];
}

export function TextTestimonialComponent({
    testimonial,
    attachments,
}: TextTestimonialComponentProps) {
    // Filter image attachments
    const imageAttachments = attachments?.filter((a) => a.type === 'image') || [];

    return (
        <div className="flex flex-col min-h-[150px] h-full">
            {/* Main Content */}
            <div className="space-y-4 flex-1">
                {/* Testimonial Title - Show if present */}
                {testimonial.title && (
                    <h3 className="text-lg font-semibold text-white">{testimonial.title}</h3>
                )}

                {/* Testimonial Text Content - Simple display */}
                <p className="text-zinc-200 text-base leading-relaxed">
                    <span className="text-zinc-500 text-lg">"</span>
                    {testimonial.text}
                    <span className="text-zinc-500 text-lg">"</span>
                </p>

                {/* Attachments - Compact display, only if present */}
                {imageAttachments.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                        {imageAttachments.map((attachment, index) => (
                            <div
                                key={index}
                                className="size-10 rounded-md bg-zinc-800 overflow-hidden flex items-center justify-center ring-1 ring-zinc-700"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={attachment.url}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                        {testimonial.raw?.data?.company?.name && (
                            <span className="text-xs text-zinc-500">{testimonial.raw.data.company.name}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Source and Date - Just above divider */}
            {(testimonial.source || testimonial.date) && (
                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-4">
                    {testimonial.source && (
                        <span className="flex items-center gap-1.5">
                            <span className="text-zinc-600">Source:</span>
                            <span className="text-zinc-400">{testimonial.source}</span>
                        </span>
                    )}
                    {testimonial.date && (
                        <span className="text-zinc-600">• {testimonial.date}</span>
                    )}
                </div>
            )}
        </div>
    );
}
