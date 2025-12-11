import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { WIDGET_MODELS } from "@/lib/widget-models"

export default function WidgetsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Widgets</h1>
        <p className="text-muted-foreground">
          Embed testimonials on your website without code. Choose a model to get started.
        </p>
      </div>

      {/* Filter Chips - Visual only for now */}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" className="rounded-full">All</Button>
        <Button variant="ghost" size="sm" className="rounded-full">Pro</Button>
        <Button variant="ghost" size="sm" className="rounded-full">Supports images</Button>
        <Button variant="ghost" size="sm" className="rounded-full">Supports video</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WIDGET_MODELS.map((widget) => (
          <Link key={widget.id} href={`/canvas/${widget.id}`} className="group block h-full">
            <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
              <div className="aspect-video bg-muted/30 flex items-center justify-center border-b p-6 group-hover:bg-muted/50 transition-colors">
                {/* Placeholder for visual preview */}
                <widget.icon className="h-12 w-12 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{widget.name}</CardTitle>
                  {widget.tag && (
                    <Badge variant={widget.tag === "New" ? "default" : "secondary"} className="text-xs">
                      {widget.tag}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {widget.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Customize <ArrowRight className="ml-1 h-4 w-4" />
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
