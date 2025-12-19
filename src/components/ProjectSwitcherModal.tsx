"use client";

import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Check, Folder, LayoutGrid, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProject, switchProject } from "@/lib/actions/projects";

type ProjectSummary = {
    id: string;
    name: string | null;
};

type ProjectSwitcherModalProps = {
    isOpen: boolean;
    onClose: () => void;
    projects: ProjectSummary[];
    activeProjectId: string | null;
};

export default function ProjectSwitcherModal({
    isOpen,
    onClose,
    projects,
    activeProjectId,
}: ProjectSwitcherModalProps) {
    const [mode, setMode] = useState<"switch" | "create">("switch");
    const [selectedId, setSelectedId] = useState<string | null>(activeProjectId);
    const [newProjectName, setNewProjectName] = useState("");
    const [isPending, startTransition] = useTransition();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setMode("switch");
            setSelectedId(activeProjectId);
            setNewProjectName("");
        }
    }, [isOpen, activeProjectId]);

    const handleSwitch = () => {
        if (!selectedId || selectedId === activeProjectId) {
            onClose();
            return;
        }
        startTransition(async () => {
            try {
                await switchProject(selectedId);
                onClose();
            } catch (error) {
                console.error("Failed to switch project:", error);
            }
        });
    };

    const handleCreate = () => {
        if (!newProjectName.trim()) return;
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("name", newProjectName);
                const result = await createProject(formData);

                if (result.project?.id) {
                    await switchProject(result.project.id);
                }

                setMode("switch");
                setNewProjectName("");
                onClose();
            } catch (error) {
                console.error("Failed to create project:", error);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isPending && onClose()}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-50 p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-800/50 bg-zinc-900/50">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        {mode === "create" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -ml-2 mr-1 text-zinc-400 hover:text-white"
                                onClick={() => setMode("switch")}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {mode === "switch" ? "Switch Project" : "Create New Project"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {mode === "switch" ? (
                        <div className="space-y-6">
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedId(project.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left group",
                                            selectedId === project.id
                                                ? "bg-violet-600/10 border-violet-600/50 shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]"
                                                : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex-shrink-0 size-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                                            selectedId === project.id
                                                ? "bg-violet-600 text-white"
                                                : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200"
                                        )}>
                                            {project.name?.slice(0, 2).toUpperCase() || "P"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium truncate",
                                                selectedId === project.id ? "text-violet-100" : "text-zinc-300 group-hover:text-zinc-50"
                                            )}>
                                                {project.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate mt-0.5">
                                                {selectedId === project.id ? "Selected" : "Click to select"}
                                            </p>
                                        </div>
                                        {selectedId === project.id && (
                                            <div className="flex-shrink-0 text-violet-500">
                                                <Check className="h-5 w-5" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setMode("create")}
                                    className="flex-1 border-dashed border-zinc-700 bg-transparent hover:bg-zinc-900 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 h-11"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Project
                                </Button>
                                <Button
                                    onClick={handleSwitch}
                                    disabled={isPending || !selectedId}
                                    className="flex-1 bg-violet-600 hover:bg-violet-500 text-white h-11"
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {selectedId === activeProjectId ? "Close" : "Switch Project"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="projectName" className="text-zinc-400">Project Name</Label>
                                    <Input
                                        id="projectName"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="e.g. My Awesome Startup"
                                        className="bg-zinc-900/50 border-zinc-800 text-white focus:border-violet-500/50 focus:ring-violet-500/20 h-11"
                                        autoFocus
                                    />
                                    <p className="text-xs text-zinc-500">Pick a unique name for your project.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setMode("switch")}
                                    className="flex-1 text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={isPending || !newProjectName.trim()}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white h-11"
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Create & Switch
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
