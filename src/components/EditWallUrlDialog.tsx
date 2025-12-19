"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditWallUrlDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    initialUrl: string
}

export function EditWallUrlDialog({ isOpen, onOpenChange, initialUrl }: EditWallUrlDialogProps) {
    // Parse URL to separate slug and base
    const getUrlParts = (url: string) => {
        try {
            const lastSlashIndex = url.lastIndexOf('/')
            if (lastSlashIndex !== -1) {
                return {
                    base: url.substring(0, lastSlashIndex + 1),
                    slug: url.substring(lastSlashIndex + 1)
                }
            }
            return { base: 'https://senja.io/p/tc/', slug: '67' }
        } catch (e) {
            return { base: 'https://senja.io/p/tc/', slug: '67' }
        }
    }

    const urlParts = React.useMemo(() => getUrlParts(initialUrl), [initialUrl])
    const [slug, setSlug] = React.useState(urlParts.slug)

    // Reset slug when URL changes or dialog opens
    React.useEffect(() => {
        setSlug(urlParts.slug)
    }, [urlParts.slug, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] p-0 flex flex-col gap-0 overflow-hidden">
                <DialogHeader className="px-8 pt-8 pb-4 space-y-2">
                    <DialogTitle className="text-xl font-bold tracking-tight">Edit Wall of Love URL</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[15px] leading-normal pt-1">
                        Edit the display URL of your Wall of Love. Changing this will break any links you&apos;ve already shared.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 pb-8 space-y-6">
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        To edit the first part of this URL, <button className="text-violet-600 font-medium hover:underline focus:outline-none">change your project&apos;s slug</button> or <button className="text-violet-600 font-medium hover:underline focus:outline-none">add a custom domain</button>.
                    </p>

                    <div className="space-y-2.5">
                        <Label className="text-sm font-medium text-zinc-700">Edit Slug</Label>
                        <div className="flex rounded-lg shadow-sm">
                            <div className="flex items-center px-4 bg-zinc-50 border border-r-0 border-zinc-200 rounded-l-lg text-zinc-500 text-[15px] select-none">
                                {urlParts.base}
                            </div>
                            <div className="flex-1 relative">
                                <Input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="rounded-l-none h-11 border-l-0 text-[15px] focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-black hover:bg-zinc-800 text-white font-semibold h-11 rounded-lg text-[15px] shadow-sm mt-2"
                        onClick={() => onOpenChange(false)}
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
