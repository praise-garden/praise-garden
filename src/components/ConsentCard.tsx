"use client";

import React, { useState } from 'react';
import { FormCard, FormCardProps } from '@/app/form-builder/page';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsentBlockConfig } from '@/types/form-config';
import BackButton from '@/components/ui/back-button';
import AppBar from '@/components/ui/app-bar';

interface ConsentCardProps extends Omit<FormCardProps, 'config'> {
    config: ConsentBlockConfig;
}

// Icon Components
const GlobeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

type UsageMode = 'public' | 'private' | null;

interface UsageOptionProps {
    mode: 'public' | 'private';
    selected: boolean;
    onSelect: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const UsageOption: React.FC<UsageOptionProps> = ({
    mode,
    selected,
    onSelect,
    icon,
    title,
    description,
}) => {
    return (
        <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative w-full p-4 sm:p-5 rounded-xl border transition-all duration-300 text-left overflow-hidden group
                ${selected
                    ? 'bg-white/10 border-white/40 shadow-lg shadow-white/5'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            {/* Selection checkmark */}
            <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${selected
                    ? 'bg-white border-white'
                    : 'border-white/20 bg-transparent group-hover:border-white/40'
                }`}
            >
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <CheckIcon className="w-3 h-3 text-black" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300
                    ${selected
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-gray-400 border border-white/5 group-hover:text-gray-300 group-hover:bg-white/10'
                    }`}
                >
                    {icon}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 pr-6">
                    <h3 className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${selected ? 'text-white' : 'text-gray-200'}`}>
                        {title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed mt-0.5 transition-colors duration-300 ${selected ? 'text-white/80' : 'text-gray-400'}`}>
                        {description}
                    </p>
                </div>
            </div>

            {/* Passive glass shimmer on hover/select */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-opacity duration-500 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
        </motion.button>
    );
};

const ConsentCard: React.FC<ConsentCardProps> = ({ config, onFieldFocus, theme, ...props }) => {
    const [selectedMode, setSelectedMode] = useState<UsageMode>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus?.(config.id, fieldPath);
    };

    const handleModeSelect = (mode: UsageMode) => {
        if (isSubmitting) return;
        setSelectedMode(mode);
    };

    const handleContinue = () => {
        if (!selectedMode || isSubmitting) return;
        setIsSubmitting(true);

        setTimeout(() => {
            props.onNext();
        }, 250);
    };

    return (
        <FormCard {...props} theme={theme}>
            <div className="flex-grow flex flex-col overflow-hidden relative">
                {/* Subtle background gradient - very neutral */}
                <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent blur-3xl opacity-50"></div>

                {/* Back Button */}
                {props.onPrevious && <BackButton onClick={props.onPrevious} />}

                {/* AppBar */}
                <div className="flex-shrink-0">
                    <AppBar maxWidthClass="max-w-2xl" paddingXClass="px-8 sm:px-16" logoUrl={theme?.logoUrl} />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16 pb-10 pt-4 text-center overflow-y-auto relative z-10">
                    <div className="w-full max-w-xl mx-auto space-y-6">

                        {/* Main Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="space-y-2"
                        >
                            <h2
                                className="text-xl sm:text-2xl font-bold text-white leading-tight"
                                style={{ color: config.props.titleColor }}
                                onClick={() => handleFieldClick('props.title')}
                                data-field="props.title"
                            >
                                {config.props.title || "How can we share your testimonial?"}
                            </h2>

                            <p
                                className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
                                style={{ color: config.props.descriptionColor }}
                                onClick={() => handleFieldClick('props.description')}
                                data-field="props.description"
                            >
                                {config.props.description || "Your feedback means the world to us. Please select how you'd like us to use your testimonial."}
                            </p>
                        </motion.div>

                        {/* Usage Options */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-3"
                        >
                            {/* Public Option */}
                            <UsageOption
                                mode="public"
                                selected={selectedMode === 'public'}
                                onSelect={() => handleModeSelect('public')}
                                icon={<GlobeIcon className="w-5 h-5" />}
                                title={config.props.publicOptionTitle || "Share it publicly"}
                                description={config.props.publicOptionDescription || "Display on our website, social media, and marketing materials."}
                            />

                            {/* Private Option */}
                            <UsageOption
                                mode="private"
                                selected={selectedMode === 'private'}
                                onSelect={() => handleModeSelect('private')}
                                icon={<LockIcon className="w-5 h-5" />}
                                title={config.props.privateOptionTitle || "Keep it private"}
                                description={config.props.privateOptionDescription || "Only for internal use. We won't share it publicly."}
                            />
                        </motion.div>

                        {/* Continue Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.button
                                onClick={handleContinue}
                                disabled={!selectedMode || isSubmitting}
                                whileHover={selectedMode ? { scale: 1.02 } : {}}
                                whileTap={selectedMode ? { scale: 0.98 } : {}}
                                className={`w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden
                                ${selectedMode
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35'
                                        : 'bg-gray-800/80 text-gray-500 cursor-not-allowed'
                                    }`}
                                data-field="props.buttonText"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {config.props.buttonText || "Continue"}
                                    {selectedMode && (
                                        <motion.svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            initial={{ x: 0 }}
                                            animate={{ x: [0, 3, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </motion.svg>
                                    )}
                                </span>
                            </motion.button>
                        </motion.div>

                        {/* Trust Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex items-center justify-center gap-1.5"
                            onClick={() => handleFieldClick('props.trustNote')}
                            data-field="props.trustNote"
                        >
                            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] text-gray-500">{config.props.trustNote || "Your privacy is important to us. We'll always respect your choice."}</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </FormCard>
    );
};

export default ConsentCard;
