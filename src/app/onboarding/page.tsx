"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/Logo";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const [projectName, setProjectName] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!projectName.trim()) {
            setError("Project name is required");
            return;
        }

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("name", projectName);
                const result = await createProject(formData);

                // Project created successfully, redirect to dashboard
                router.push("/dashboard");
                router.refresh();
            } catch (err: any) {
                setError(err.message || "Failed to create project");
            }
        });
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle gradient background - very light */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

            {/* Subtle grid pattern for depth */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                    backgroundSize: '64px 64px'
                }}
            />

            <div className="relative w-full max-w-md">
                {/* Logo and Welcome */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 mb-6 transition-transform hover:scale-105">
                        <Logo size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-semibold text-slate-900 mb-3 tracking-tight">
                        Welcome to Trustimonials
                    </h1>
                    <p className="text-slate-600 text-base leading-relaxed">
                        Let's create your first project to get started
                    </p>
                </div>

                {/* Onboarding Card */}
                <div className="bg-white border border-slate-200/60 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label
                                htmlFor="projectName"
                                className="text-sm font-medium text-slate-700"
                            >
                                Project name
                            </Label>
                            <div className="relative">
                                <Input
                                    id="projectName"
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder="Acme Inc"
                                    className={`h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 transition-all duration-200 ${isFocused
                                            ? 'border-blue-500 ring-4 ring-blue-500/10'
                                            : 'hover:border-slate-400'
                                        }`}
                                    disabled={isPending}
                                    autoFocus
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Choose a name for your workspace. You can always change this later.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending || !projectName.trim()}
                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all duration-200 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating workspace...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-slate-500 mt-8">
                    Need help?{" "}
                    <a
                        href="mailto:support@testerscommunity.com"
                        className="text-slate-700 hover:text-slate-900 underline underline-offset-2 transition-colors"
                    >
                        Get in touch
                    </a>
                </p>
            </div>
        </div>
    );
}
