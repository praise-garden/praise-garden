import { WIDGET_MODELS } from "@/lib/widget-models"
import { WidgetEditorClient, WidgetTestimonial } from "./WidgetEditorClient"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return WIDGET_MODELS.map((widget) => ({
    widgetId: widget.id,
  }))
}

// ============================================================
// SAMPLE USER TESTIMONIALS (Replace with Supabase query later)
// ============================================================
// This simulates what would come from your database
const SAMPLE_USER_TESTIMONIALS: WidgetTestimonial[] = [
  {
    id: "1",
    authorName: "Bert",
    authorTitle: "Co-Founder of Startups",
    rating: 5,
    content: "This is a fantastic product! It has completely changed my workflow.",
    source: "WEB FORM",
    date: "Sep 23, 2025"
  },
  {
    id: "2",
    authorName: "Alice",
    authorTitle: "Lead Designer",
    rating: 4,
    content: "Great design and easy to use. I would recommend it to my colleagues.",
    source: "IMPORT",
    date: "Sep 22, 2025"
  },
  {
    id: "3",
    authorName: "Charlie",
    authorTitle: "CEO",
    rating: 5,
    content: "A game-changer for our company. We've seen a huge increase in engagement.",
    source: "WEB FORM",
    date: "Sep 21, 2025"
  },
  {
    id: "4",
    authorName: "Diana",
    authorTitle: "Marketing Manager",
    rating: 5,
    content: "Incredible tool that has helped us gather valuable feedback.",
    source: "EMAIL",
    date: "Sep 20, 2025"
  },
  {
    id: "5",
    authorName: "Ethan",
    authorTitle: "Software Engineer",
    rating: 3,
    content: "It's a good tool, but there are a few features I'd like to see added.",
    source: "IMPORT",
    date: "Sep 19, 2025"
  }
]

export default function WidgetEditorPage({ params }: { params: { widgetId: string } }) {
  const widget = WIDGET_MODELS.find((w) => w.id === params.widgetId)

  if (!widget) {
    notFound()
  }

  // ============================================================
  // DATA FETCHING: Get user's testimonials
  // ============================================================
  // In the future, replace this with actual data fetching from Supabase:
  // const userTestimonials = await fetchUserTestimonialsFromDB(userId)
  //
  // For now, we use the sample data defined above:
  const userTestimonials = SAMPLE_USER_TESTIMONIALS

  // Pass testimonials as a prop to the client component
  return (
    <WidgetEditorClient
      widgetId={params.widgetId}
      userTestimonials={userTestimonials}
    />
  )
}
