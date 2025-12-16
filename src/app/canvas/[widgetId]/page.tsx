import { RequireAuth } from "@/components/auth/RequireAuth"
import { WidgetEditorClient } from "./WidgetEditorClient"

interface PageProps {
    params: {
        widgetId: string
    }
}

export default function WidgetEditorPage({ params }: PageProps) {
    return (
        <RequireAuth>
            <WidgetEditorClient widgetId={params.widgetId} />
        </RequireAuth>
    )
}
