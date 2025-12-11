import { WIDGET_MODELS } from "@/lib/widget-models"
import { WidgetEditorClient } from "./WidgetEditorClient"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return WIDGET_MODELS.map((widget) => ({
    widgetId: widget.id,
  }))
}

export default function WidgetEditorPage({ params }: { params: { widgetId: string } }) {
  const widget = WIDGET_MODELS.find((w) => w.id === params.widgetId)

  if (!widget) {
    notFound()
  }

  return <WidgetEditorClient widgetId={params.widgetId} />
}

