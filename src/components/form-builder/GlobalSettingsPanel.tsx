import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModernFontPicker } from '@/components/ui/modern-font-picker';
import { uploadImageToStorage } from '@/lib/storage';
import { toast } from 'sonner';
import { FormConfig, FormTheme } from '@/types/form-config';

// --- Icons ---
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const BoldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
    </svg>
);

const ItalicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="4" x2="10" y2="4"></line>
        <line x1="14" y1="20" x2="5" y2="20"></line>
        <line x1="15" y1="4" x2="9" y2="20"></line>
    </svg>
);

const UnderlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
        <line x1="4" y1="20" x2="20" y2="20"></line>
    </svg>
);

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

const TypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" y1="20" x2="15" y2="20"></line>
        <line x1="12" y1="4" x2="12" y2="20"></line>
    </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

// --- Constants & Helpers ---
const PRIMARY_COLOR_PRESETS = ['#A855F7', '#6366F1', '#22C55E', '#F97316', '#EC4899', '#0EA5E9', '#FACC15', '#111827'];
const SECONDARY_COLOR_PRESETS = ['#22C55E', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#0EA5E9', '#F59E0B', '#1F2937'];
const FONT_SIZE_PRESETS = [16, 20, 24, 32];

const clampColorValue = (value: number) => Math.min(255, Math.max(0, value));

const adjustColor = (hex: string, amount: number) => {
    if (!hex) return hex;
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
        clean = clean.split('').map((char) => `${char}${char}`).join('');
    }
    if (clean.length !== 6) {
        return hex;
    }
    const numeric = parseInt(clean, 16);
    const r = clampColorValue((numeric >> 16) + amount);
    const g = clampColorValue(((numeric >> 8) & 0xff) + amount);
    const b = clampColorValue((numeric & 0xff) + amount);
    const toHex = (value: number) => value.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const createGradient = (color: string) => {
    const light = adjustColor(color, 35);
    return `linear-gradient(135deg, ${light}, ${color})`;
};

// --- Component ---

interface GlobalSettingsPanelProps {
    formConfig: FormConfig;
    setFormConfig: React.Dispatch<React.SetStateAction<FormConfig | null>>;
    defaultTheme: FormTheme;
}

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({ formConfig, setFormConfig, defaultTheme }) => {
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [showAdvancedBrand, setShowAdvancedBrand] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const updateTheme = (updater: (theme: FormTheme) => FormTheme) => {
        setFormConfig((prev) => {
            if (!prev) return prev;
            const currentTheme = { ...defaultTheme, ...(prev.theme ?? {}) };
            return { ...prev, theme: updater(currentTheme) };
        });
    };

    const currentTheme = { ...defaultTheme, ...(formConfig.theme ?? {}) };

    const handleCopyColor = async (value: string) => {
        if (!value) return;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
                toast.success('Color copied to clipboard');
            }
        } catch {
            toast.error('Unable to copy color');
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!formConfig.projectId) {
            toast.error('Unable to upload logo: missing project context.');
            return;
        }

        setIsUploadingLogo(true);
        try {
            const uploadResult = await uploadImageToStorage({
                file,
                context: {
                    type: 'project',
                    projectId: formConfig.projectId,
                    namespace: 'form-assets/logos',
                },
            });

            updateTheme((theme) => ({ ...theme, logoUrl: uploadResult.url }));
            toast.success('Logo uploaded successfully');
        } catch (uploadError: any) {
            toast.error(uploadError.message || 'Failed to upload logo');
        } finally {
            setIsUploadingLogo(false);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };



    return (
        <div className="w-full max-w-3xl space-y-6">
            {/* Header */}
            <div className="pt-4 pb-2">
                <h2 className="text-3xl font-bold text-white mb-3">Global Settings</h2>
                <p className="text-gray-400">Configure branding and styling for your entire form</p>
            </div>

            {/* Brand Identity Section */}
            <section className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 border border-gray-800/50 rounded-2xl overflow-visible backdrop-blur-sm">
                <div className="p-5 border-b border-gray-800/40">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-600/20 flex items-center justify-center">
                            <TypeIcon className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        Brand Logo
                    </h3>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center justify-center gap-6">
                        {/* Logo Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-xl bg-gray-900/80 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden transition-all hover:border-purple-500/50 cursor-pointer">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleLogoUpload}
                                    />
                                    {currentTheme.logoUrl ? (
                                        <img src={currentTheme.logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-600" />
                                    )}
                                    {isUploadingLogo && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                            <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-medium text-gray-500 whitespace-nowrap group-hover:text-purple-400 transition-colors">
                                    Upload Logo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Colors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Primary Color */}
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 block">Primary Color</label>
                            <p className="text-xs text-gray-500 mt-1">Brand accents & CTAs</p>
                        </div>
                        <button
                            onClick={() => handleCopyColor(currentTheme.primaryColor)}
                            className="p-1.5 rounded-lg border border-gray-700/60 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                            aria-label="Copy primary color"
                        >
                            <CopyIcon />
                        </button>
                    </div>
                    <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
                        <label className="relative w-12 h-12 rounded-xl shadow-inner overflow-hidden">
                            <input
                                type="color"
                                value={currentTheme.primaryColor}
                                onChange={(e) => updateTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <span
                                className="absolute inset-0 rounded-xl border border-gray-700/60"
                                style={{ background: createGradient(currentTheme.primaryColor) }}
                            ></span>
                        </label>
                        <input
                            type="text"
                            value={currentTheme.primaryColor}
                            onChange={(e) => updateTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                            className="bg-gray-950 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                    <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                            {PRIMARY_COLOR_PRESETS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => updateTheme((t) => ({ ...t, primaryColor: color }))}
                                    className={`w-7 h-7 rounded-full border transition-all duration-200 ${currentTheme.primaryColor === color
                                        ? 'border-white ring-2 ring-purple-500/50'
                                        : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{ background: createGradient(color) }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Secondary Color */}
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 block">Secondary Color</label>
                            <p className="text-xs text-gray-500 mt-1">Status chips & highlights</p>
                        </div>
                        <button
                            onClick={() => handleCopyColor(currentTheme.secondaryColor)}
                            className="p-1.5 rounded-lg border border-gray-700/60 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                        >
                            <CopyIcon />
                        </button>
                    </div>
                    <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
                        <label className="relative w-12 h-12 rounded-xl shadow-inner overflow-hidden">
                            <input
                                type="color"
                                value={currentTheme.secondaryColor}
                                onChange={(e) => updateTheme((t) => ({ ...t, secondaryColor: e.target.value }))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <span
                                className="absolute inset-0 rounded-xl border border-gray-700/60"
                                style={{ background: createGradient(currentTheme.secondaryColor) }}
                            ></span>
                        </label>
                        <input
                            type="text"
                            value={currentTheme.secondaryColor}
                            onChange={(e) => updateTheme((t) => ({ ...t, secondaryColor: e.target.value }))}
                            className="bg-gray-950 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                    <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                            {SECONDARY_COLOR_PRESETS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => updateTheme((t) => ({ ...t, secondaryColor: color }))}
                                    className={`w-7 h-7 rounded-full border transition-all duration-200 ${currentTheme.secondaryColor === color
                                        ? 'border-white ring-2 ring-purple-500/50'
                                        : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{ background: createGradient(color) }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fonts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Heading Font */}
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200 overflow-visible relative z-40">
                    <label className="text-sm font-medium text-gray-300 mb-3 block">Heading Font</label>
                    <ModernFontPicker
                        value={currentTheme.headingFont}
                        onChange={(value) => updateTheme((t) => ({ ...t, headingFont: value }))}
                        compact
                    />
                </div>

                {/* Body Font */}
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200 overflow-visible relative z-30">
                    <label className="text-sm font-medium text-gray-300 mb-3 block">Body Font</label>
                    <ModernFontPicker
                        value={currentTheme.bodyFont}
                        onChange={(value) => updateTheme((t) => ({ ...t, bodyFont: value }))}
                        compact
                    />
                </div>
            </div>
        </div>
    );
};

export default GlobalSettingsPanel;
