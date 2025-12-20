"use client";

import React, { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProjectBrand } from "@/lib/actions/projects";
import { uploadImageToStorage } from "@/lib/storage";
import { toast, Toaster } from "sonner";
import { Loader2, Palette, Globe, Type, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernFontPicker } from "@/components/ui/modern-font-picker";

interface BrandSettings {
    logoUrl: string;
    brandName: string;
    websiteUrl: string;
    primaryColor: string;
    textColor: string;
    ratingColor: string;
    headingFont: string;
    bodyFont: string;
}

const DEFAULT_SETTINGS: BrandSettings = {
    logoUrl: "",
    brandName: "",
    websiteUrl: "",
    primaryColor: "#7c3aed", // violet-600
    textColor: "#f3f4f6",    // gray-100
    ratingColor: "#fbbf24",  // amber-400
    headingFont: "Inter",
    bodyFont: "Inter",
};

const MAX_LOGO_SIZE_MB = 2;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;

export default function BrandPageClient({ project }: { project: any }) {
    const [settings, setSettings] = useState<BrandSettings>({
        ...DEFAULT_SETTINGS,
        ...(project.brand_settings || {}),
    });
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateProjectBrand(project.id, settings);
                toast.success("Brand settings saved successfully");
            } catch (error) {
                toast.error("Failed to save brand settings");
                console.error(error);
            }
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > MAX_LOGO_SIZE_BYTES) {
            toast.error(`Logo must be less than ${MAX_LOGO_SIZE_MB}MB`);
            return;
        }

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a valid image (PNG, JPG, WebP, GIF, or SVG)");
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadImageToStorage({
                file,
                context: {
                    type: 'project',
                    projectId: project.id,
                    namespace: 'brand/logos',
                },
            });
            setSettings(prev => ({ ...prev, logoUrl: result.url }));
            toast.success("Logo uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload logo");
            console.error(error);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveLogo = () => {
        setSettings(prev => ({ ...prev, logoUrl: '' }));
    };

    const ColorInput = ({
        label,
        value,
        onChange
    }: {
        label: string;
        value: string;
        onChange: (val: string) => void;
    }) => (
        <div className="space-y-3">
            <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</Label>
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <div
                        className="size-10 rounded-lg border border-zinc-700 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: value }}
                    />
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="font-mono text-sm w-32 bg-zinc-900/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <Toaster theme="dark" position="top-center" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Brand Kit</h1>
                    <p className="text-zinc-400 text-sm">
                        Manage your brand identity across all your forms and widgets.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="bg-white text-black hover:bg-zinc-200 transition-all font-medium px-6 shadow-lg shadow-zinc-900/20"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 size-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20">
                            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                                <Globe className="size-5 text-indigo-400" />
                                General Information
                            </CardTitle>
                            <CardDescription>Basic details about your brand.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Brand Name</Label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                    <Input
                                        value={settings.brandName}
                                        onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                                        placeholder="Acme Inc."
                                        className="pl-9 bg-zinc-950/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-zinc-300">Website URL</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                    <Input
                                        value={settings.websiteUrl}
                                        onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                                        placeholder="https://acme.com"
                                        className="pl-9 bg-zinc-950/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Logo Upload Section */}
                            <div className="space-y-3">
                                <Label className="text-zinc-300">Brand Logo</Label>

                                {settings.logoUrl ? (
                                    // Logo Preview
                                    <div className="flex items-center gap-4">
                                        <div className="relative group">
                                            <div className="size-20 rounded-xl border border-zinc-700 bg-zinc-900 p-2 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={settings.logoUrl}
                                                    alt="Brand Logo"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <button
                                                onClick={handleRemoveLogo}
                                                className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-lg"
                                            >
                                                <X className="size-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-400">Logo uploaded successfully</p>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
                                            >
                                                Replace logo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Upload Zone
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative border-2 border-dashed border-zinc-700 hover:border-zinc-600 rounded-xl p-8 transition-all cursor-pointer group bg-zinc-900/30 hover:bg-zinc-900/50"
                                    >
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="size-10 text-indigo-400 animate-spin" />
                                                    <p className="text-sm text-zinc-400">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="size-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                                                        <Upload className="size-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-300">
                                                            Click to upload your logo
                                                        </p>
                                                        <p className="text-xs text-zinc-500 mt-1">
                                                            PNG, JPG, SVG or WebP (max {MAX_LOGO_SIZE_MB}MB)
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <p className="text-xs text-zinc-500">Use a transparent PNG or SVG for best results.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-sm overflow-visible">
                        <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20">
                            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                                <Palette className="size-5 text-pink-400" />
                                Style & Theme
                            </CardTitle>
                            <CardDescription>Customize colors and typography.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Colors First */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <ColorInput
                                    label="Primary Color"
                                    value={settings.primaryColor}
                                    onChange={(c) => setSettings({ ...settings, primaryColor: c })}
                                />
                                <ColorInput
                                    label="Text Color"
                                    value={settings.textColor}
                                    onChange={(c) => setSettings({ ...settings, textColor: c })}
                                />
                                <ColorInput
                                    label="Rating Color"
                                    value={settings.ratingColor}
                                    onChange={(c) => setSettings({ ...settings, ratingColor: c })}
                                />
                            </div>

                            {/* Fonts Below */}
                            <div className="pt-6 border-t border-zinc-800/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Heading Font</Label>
                                        <ModernFontPicker
                                            value={settings.headingFont}
                                            onChange={(font) => setSettings({ ...settings, headingFont: font })}
                                            placeholder="Select heading font"
                                        />
                                        <p className="text-xs text-zinc-500">Used for titles and headings</p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Body Font</Label>
                                        <ModernFontPicker
                                            value={settings.bodyFont}
                                            onChange={(font) => setSettings({ ...settings, bodyFont: font })}
                                            placeholder="Select body font"
                                        />
                                        <p className="text-xs text-zinc-500">Used for body text and paragraphs</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider pl-1">Live Preview</h3>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden relative">
                            {/* Fake Browser UI */}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 flex items-center px-4 gap-1.5 border-b border-zinc-800">
                                <div className="size-2.5 rounded-full bg-red-500/20" />
                                <div className="size-2.5 rounded-full bg-yellow-500/20" />
                                <div className="size-2.5 rounded-full bg-green-500/20" />
                            </div>

                            <div className="mt-8 space-y-6">
                                {/* Header preview */}
                                <div className="flex items-center gap-3">
                                    {settings.logoUrl ? (
                                        <img src={settings.logoUrl} className="size-10 object-contain" alt="Logo" />
                                    ) : (
                                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <ImageIcon className="size-5 text-zinc-600" />
                                        </div>
                                    )}
                                    <div>
                                        <h4
                                            className="font-bold text-lg"
                                            style={{
                                                color: settings.textColor,
                                                fontFamily: settings.headingFont
                                            }}
                                        >
                                            {settings.brandName || "Brand Name"}
                                        </h4>
                                        <div className="h-3 w-20 bg-zinc-800 rounded mt-1 opacity-50" />
                                    </div>
                                </div>

                                {/* Sample Body Text */}
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-zinc-800/50 rounded" />
                                    <div className="h-2 w-3/4 bg-zinc-800/50 rounded" />
                                    <p style={{
                                        color: settings.textColor,
                                        fontFamily: settings.bodyFont,
                                        opacity: 0.7,
                                        fontSize: '0.8rem'
                                    }}>
                                        This is how your body text will look.
                                    </p>
                                </div>

                                {/* Button Preview */}
                                <button
                                    className="w-full py-2.5 rounded-lg font-medium text-sm text-white transition-opacity hover:opacity-90"
                                    style={{
                                        backgroundColor: settings.primaryColor,
                                        fontFamily: settings.bodyFont
                                    }}
                                >
                                    Submit Testimonial
                                </button>

                                {/* Rating Preview */}
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="size-5" fill={settings.ratingColor} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 text-center">
                            Preview of how your brand elements appear in widgets.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
