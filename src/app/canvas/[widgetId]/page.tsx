import { RequireAuth } from "@/components/auth/RequireAuth"
import { WidgetEditorClient } from "./WidgetEditorClient"
import { Toaster } from "sonner"

interface PageProps {
    params: {
        widgetId: string
    }
}

export default function WidgetEditorPage({ params }: PageProps) {
    return (
        <RequireAuth>
            <WidgetEditorClient widgetId={params.widgetId} />
            <Toaster position="bottom-right" theme="dark" richColors />
        </RequireAuth>
    )
}
