import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, LayoutGrid, Save, Heart } from "lucide-react"
import { WIDGET_MODELS } from "@/lib/widget-models"
import { cn } from "@/lib/utils"

export default function WidgetsPage() {
  const tabs = [
    { label: "Saved", icon: Save, href: "#", active: false },
    { label: "Widgets", icon: LayoutGrid, href: "/dashboard/widgets", active: true },
    { label: "Walls of Love", icon: Heart, href: "/dashboard/walls-of-love", active: false },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Social Proof Studio</h1>
            <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-zinc-400">What would you like to create?</p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {tabs.map((tab) => (
              <Button
                key={tab.label}
                variant="ghost"
                asChild
                className={cn(
                  "h-10 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 gap-2 rounded-lg px-4",
                  tab.active && "border-zinc-700 bg-zinc-800 text-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]"
                )}
              >
                <Link href={tab.href}>
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Widgets Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Widgets</h2>
            <p className="text-zinc-500 text-sm">
              Embed testimonials on your website without code.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WIDGET_MODELS.map((widget) => (
              <Link key={widget.id} href={`/canvas/${widget.id}`} className="group block h-full">
                <div className="h-full bg-[#111] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:-translate-y-1">

                  {/* Preview Area */}
                  <div className="aspect-[4/3] bg-[#0c0c0e] relative p-6 flex items-center justify-center group-hover:bg-[#151518] transition-colors">
                    <widget.icon className={cn("h-16 w-16 opacity-20 transition-all group-hover:opacity-100 group-hover:scale-110", widget.iconColor)} />

                    {widget.tag && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20">
                        {widget.tag}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 border-t border-zinc-800 bg-[#111]">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-zinc-200">{widget.name}</h3>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-1">{widget.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
