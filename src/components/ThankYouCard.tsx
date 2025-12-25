"use client";

import React, { useEffect, useState } from 'react';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import AppBar from '@/components/ui/app-bar';
import { ThankYouBlockConfig } from '@/types/form-config';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300.251" fill="currentColor" {...props}>
        <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// DECORATIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// Animated confetti particles
const Confetti = () => {
    const colors = ['#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-sm"
                    style={{
                        left: `${particle.x}%`,
                        top: -20,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        rotate: particle.rotation,
                    }}
                    initial={{ y: -20, opacity: 1 }}
                    animate={{
                        y: '100vh',
                        opacity: [1, 1, 0],
                        rotate: particle.rotation + 720,
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                />
            ))}
        </div>
    );
};

// Animated success checkmark - Responsive sizing
const SuccessCheckmark = () => (
    <motion.div
        className="relative w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mx-auto mb-5 lg:mb-6 xl:mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
    >
        {/* Outer glow ring */}
        <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Main circle */}
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30 flex items-center justify-center">
            {/* Checkmark */}
            <motion.svg
                className="w-6 h-6 lg:w-7 lg:h-7 xl:w-9 xl:h-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <motion.path
                    d="M20 6L9 17L4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                />
            </motion.svg>
        </div>
    </motion.div>
);

// Floating hearts/stars decoration
const FloatingElements = () => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        emoji: ['✨', '💚', '⭐', '🎉'][i % 4],
        x: 10 + (i * 12),
        y: 20 + Math.random() * 60,
        delay: i * 0.3,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute text-xl lg:text-2xl xl:text-3xl opacity-60"
                    style={{ left: `${el.x}%`, top: `${el.y}%` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: [0, 0.6, 0],
                        y: [20, -20, 20],
                    }}
                    transition={{
                        duration: 4,
                        delay: el.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    {el.emoji}
                </motion.div>
            ))}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ThankYouCardProps extends FormCardProps {
    config: ThankYouBlockConfig;
    onFieldFocus: (blockId: string, fieldPath: string) => void;
}

const ThankYouCard: React.FC<ThankYouCardProps> = ({ config, onFieldFocus, theme, ...props }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus(config.id, fieldPath);
    };

    // Stop confetti after a few seconds for performance
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <FormCard {...props} theme={theme}>
            {/* 
              Layout: Celebration screen with optional social sharing panel
              
              RESPONSIVE STRATEGY:
              - Form Builder (~800-1000px container): Uses base/sm styles
              - Preview/Public (full viewport): lg: breakpoints trigger for larger sizing
              
              Padding scales: px-6 → sm:px-8 → lg:px-12
            */}
            <div className="flex-grow flex overflow-hidden relative bg-black">

                {/* Confetti (only for a few seconds, when animations enabled) */}
                <AnimatePresence>
                    {showConfetti && (config.props.showAnimations ?? true) && <Confetti />}
                </AnimatePresence>

                {/* Floating decorative elements (when animations enabled) */}
                {(config.props.showAnimations ?? true) && <FloatingElements />}

                {/* 
                  Main Content Area
                  Left side when socials shown, Centered when alone
                  Structure: flex-col -> AppBar (top) + Content (flex-grow + centered)
                */}
                <div className={`flex-grow flex flex-col items-center overflow-hidden relative z-10 
                    ${config.props.showSocials ? 'lg:items-stretch' : 'justify-center'}`}>

                    {/* AppBar only when socials are shown */}
                    {config.props.showSocials && (
                        <AppBar
                            maxWidthClass="max-w-xl lg:max-w-2xl"
                            paddingXClass="px-6 sm:px-8 lg:px-12"
                            logoUrl={theme?.logoUrl}
                        />
                    )}

                    {/* Content Container - Flex grow to take available space and center content */}
                    <div className={`w-full flex-grow flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 
                        ${config.props.showSocials ? 'py-6 lg:py-8' : 'py-8 lg:py-12'}`}>
                        <div className="mx-auto flex w-full max-w-xl lg:max-w-2xl xl:max-w-3xl flex-col items-center text-center">

                            {/* Success Checkmark Animation */}
                            <SuccessCheckmark />

                            {/* 
                              Title with Gradient
                              RESPONSIVE: text-xl → sm:text-2xl → lg:text-3xl
                            */}
                            <motion.h1
                                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent"
                                style={{ color: config.props.titleColor }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => handleFieldClick('props.title')}
                                data-field="props.title"
                            >
                                {config.props.title}
                            </motion.h1>

                            {/* 
                              Description
                              RESPONSIVE: text-sm → lg:text-base
                            */}
                            <motion.p
                                className="mt-2 lg:mt-3 xl:mt-4 text-sm lg:text-base xl:text-lg text-gray-300 leading-relaxed max-w-sm lg:max-w-md xl:max-w-lg"
                                style={{ color: config.props.descriptionColor }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => handleFieldClick('props.description')}
                                data-field="props.description"
                            >
                                {config.props.description}
                            </motion.p>

                            {/* 
                              Promo Code Button
                              RESPONSIVE: h-11 → lg:h-12 for the button
                            */}
                            <motion.div
                                className="my-5 lg:my-6 w-full max-w-xs lg:max-w-sm"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <button className="group w-full h-11 lg:h-12 flex items-center justify-center gap-2 
                                    rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm 
                                    text-sm lg:text-base xl:text-lg tracking-wider text-gray-300 font-mono 
                                    hover:border-green-500/30 hover:bg-gray-800/70 transition-all duration-300">
                                    <span className="text-green-400 font-semibold">THANKYOU20</span>
                                    <CopyIcon className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-gray-500 group-hover:text-green-400 transition-colors" />
                                </button>
                                <p className="text-[11px] lg:text-xs xl:text-sm text-gray-500 mt-1.5 lg:mt-2">
                                    Use this code for 20% off your next purchase
                                </p>
                            </motion.div>

                            {/* Celebration message when no socials */}
                            {!config.props.showSocials && (
                                <motion.div
                                    className="mt-2 lg:mt-4 flex flex-col items-center gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="w-10 lg:w-12 h-px bg-gradient-to-r from-transparent to-gray-600" />
                                        <span className="text-xs lg:text-sm xl:text-base">You're awesome!</span>
                                        <span className="w-10 lg:w-12 h-px bg-gradient-to-l from-transparent to-gray-600" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 
                  Social Sharing Panel (when enabled)
                  RESPONSIVE: Full width on mobile, 50% on lg
                */}
                {config.props.showSocials && (
                    <motion.div
                        className="flex-none lg:w-1/2 bg-gray-900/80 backdrop-blur-md border-l border-gray-800 overflow-hidden flex flex-col justify-center"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex w-full flex-col p-5 lg:p-6 xl:p-8">
                            <div className="mx-auto my-2 flex max-w-sm lg:max-w-md xl:max-w-lg flex-col items-center gap-4 xl:gap-6 text-center">

                                {/* Share header */}
                                <div className="font-sans mb-2 flex items-center gap-3 lg:gap-4 xl:gap-5 text-center text-[11px] lg:text-xs xl:text-sm font-medium text-gray-500 w-full">
                                    <hr className="w-full border-gray-700" />
                                    <div
                                        className="flex flex-none items-center gap-2 whitespace-nowrap"
                                        onClick={() => handleFieldClick('props.showSocials')}
                                        data-field="props.showSocials"
                                    >
                                        Share Your Story
                                    </div>
                                    <hr className="w-full border-gray-700" />
                                </div>

                                {/* X Post Preview */}
                                <div className="group relative mx-auto flex w-full items-start gap-3 lg:gap-4 xl:gap-5 rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 xl:p-6 text-left text-sm text-white shadow-lg hover:border-gray-600 transition-colors">
                                    <div className="flex flex-1 flex-wrap items-start justify-start">
                                        <div className="flex flex-1 items-center">
                                            <div className="flex w-full flex-col">
                                                <div className="flex flex-1 items-center gap-2 lg:gap-3 xl:gap-4">
                                                    <img
                                                        alt=""
                                                        src="https://ui-avatars.com/api/Tony%20Stark/200/dcfce7/166534/2/0.34"
                                                        className="h-9 w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12 rounded-full object-cover ring-2 ring-green-500/20"
                                                    />
                                                    <div>
                                                        <div className="mr-2 flex items-center gap-2 font-bold text-gray-200 text-sm">
                                                            Tony Stark
                                                        </div>
                                                        <div className="-mt-0.5 text-[11px] lg:text-xs xl:text-sm text-gray-500">CEO at Stark Industries</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <p className="content mt-3 whitespace-pre-line text-xs lg:text-sm text-gray-300 leading-relaxed">
                                                Just shared my experience with @company - they're doing amazing things! 🌟
                                            </p>
                                        </div>

                                        {/* Post Button - Standard height */}
                                        <button className="mt-4 w-full h-10 lg:h-11 xl:h-12 rounded-lg overflow-hidden shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-shadow">
                                            <span className="flex h-full w-full items-center justify-center gap-2 text-sm xl:text-base font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-colors">
                                                <XIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                                                Post in one click
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="font-sans flex items-center gap-3 lg:gap-4 xl:gap-5 text-center text-[11px] lg:text-xs xl:text-sm font-medium text-gray-500 w-full">
                                    <hr className="w-full border-gray-700" />
                                    <div className="flex-none">OR</div>
                                    <hr className="w-full border-gray-700" />
                                </div>

                                {/* Share buttons */}
                                <div className="flex flex-col items-center gap-3 lg:gap-4 xl:gap-5 rounded-xl border border-gray-700/50 bg-gray-800/30 px-4 lg:px-5 xl:px-6 py-4 xl:py-6 w-full">
                                    <p className="text-sm xl:text-base font-medium text-gray-300">Share your testimonial</p>

                                    {/* Social icons - Responsive sizing */}
                                    <div className="flex w-full justify-center gap-2 lg:gap-3 xl:gap-4">
                                        <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full text-white bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Share on X">
                                            <XIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                                        </a>
                                        <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-colors" aria-label="Share on Facebook">
                                            <FacebookIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                                        </a>
                                        <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full text-white bg-sky-600 hover:bg-sky-500 transition-colors" aria-label="Share on LinkedIn">
                                            <LinkedInIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                                        </a>
                                        <a href="#" className="w-9 h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full text-white bg-green-600 hover:bg-green-500 transition-colors" aria-label="Share on WhatsApp">
                                            <img
                                                alt="whatsapp"
                                                width="16"
                                                height="16"
                                                src="https://ik.imagekit.io/senja/tr:w-32,f-png/Logos/whatsapp-logo_Xt5raTHb3.webp"
                                                style={{ filter: 'brightness(0) invert(1)' }}
                                            />
                                        </a>
                                    </div>

                                    {/* Copy link button */}
                                    <button className="w-full h-9 lg:h-10 xl:h-12 rounded-full border border-gray-600 bg-gray-800/50 px-4 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center gap-2 justify-center">
                                            <span className="truncate text-[11px] lg:text-xs xl:text-sm font-mono">trustimonials.io/t/abc123</span>
                                            <CopyIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 flex-shrink-0" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </FormCard>
    );
};

export default ThankYouCard;

