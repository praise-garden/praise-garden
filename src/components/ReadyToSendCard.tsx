"use client";

import React, { useState } from 'react';
import { FormCardProps, FormCard } from '@/app/form-builder/page';
import AppBar from '@/components/ui/app-bar';
import { ReadyToSendBlockConfig } from '@/types/form-config';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadyToSendCardProps extends FormCardProps {
    config: ReadyToSendBlockConfig;
    onFieldFocus: (blockId: string, fieldPath: string) => void;
}

// Navigation arrow buttons
const ArrowButton = ({ direction, onClick, disabled }: { direction: 'left' | 'right'; onClick: () => void; disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-full border transition-all duration-200 ${disabled
            ? 'border-gray-800 bg-gray-900/30 text-gray-700 cursor-not-allowed'
            : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400'
            }`}
        aria-label={direction === 'left' ? 'Previous testimonial' : 'Next testimonial'}
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {direction === 'left' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
        </svg>
    </button>
);

// Decorative sparkle elements
const FloatingSparkles = () => {
    const sparkles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 15 + (i * 14),
        y: 15 + Math.random() * 70,
        delay: i * 0.4,
        size: 12 + Math.random() * 8,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {sparkles.map((sparkle) => (
                <motion.div
                    key={sparkle.id}
                    className="absolute"
                    style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        delay: sparkle.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2L13.09 8.26L19 7L14.74 11.5L19 16L13.09 15.26L12 22L10.91 15.26L5 16L9.26 11.5L5 7L10.91 8.26L12 2Z"
                            fill="url(#sparkle-gradient)"
                        />
                        <defs>
                            <linearGradient id="sparkle-gradient" x1="5" y1="2" x2="19" y2="22">
                                <stop stopColor="#22c55e" />
                                <stop offset="1" stopColor="#10b981" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

// Star rating display
const StarRating = ({ rating = 5 }: { rating?: number }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
            <motion.svg
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </motion.svg>
        ))}
    </div>
);

// Video thumbnail with play button - COMPACT SIZE
const VideoThumbnail = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative w-48 h-28 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden group cursor-pointer"
    >
        {/* Placeholder pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] text-white font-medium">
            1:24
        </div>

        {/* Video label */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/90 backdrop-blur-sm rounded-full text-[10px] text-white font-medium">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="m22 8-6 4 6 4V8Z" />
                <rect x="2" y="6" width="14" height="12" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>Video</span>
        </div>
    </motion.div>
);

// Single testimonial preview card
const TestimonialPreviewCard = ({ isVideo = false, index = 0 }: { isVideo?: boolean; index?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm mx-auto h-48" // Fixed height for consistent look
    >
        <div className={`relative w-full h-full overflow-hidden rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group ${isVideo ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/80 backdrop-blur-md'}`}>

            {/* Content */}
            {isVideo ? (
                // Video Mode: Full bleed background
                <div className="absolute inset-0 w-full h-full group cursor-pointer">
                    {/* Background Gradient/Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                        {/* Placeholder pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>

                    {/* Dark Overlay for better text contrast */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                    {/* Play Button - Centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Stars Overlay - Top Right */}
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                        <StarRating rating={5} />
                    </div>

                    {/* Video Badge - Top Left */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 text-[10px] text-white/90 font-medium">
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="m22 8-6 4 6 4V8Z" />
                            <rect x="2" y="6" width="14" height="12" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>Video</span>
                    </div>
                </div>
            ) : (
                // Text Mode: Padded content
                <div className="relative p-6 h-full flex flex-col">
                    {/* Decorative glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col h-full justify-between"
                    >
                        <div className="relative">
                            {/* Decorative Quote Mark */}
                            <div className="absolute -top-1 -left-1 text-5xl text-emerald-500/10 font-serif leading-none select-none pointer-events-none">"</div>

                            <p className="text-gray-200 leading-relaxed relative z-10 italic text-[15px] pt-2 pl-2">
                                "This product completely transformed how our team collaborates. The intuitive design and powerful features have made us significantly more productive."
                            </p>
                        </div>

                        <div className="flex justify-end items-center pt-4">
                            <StarRating rating={5} />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    </motion.div>
);

const ReadyToSendCard: React.FC<ReadyToSendCardProps> = ({ config, onFieldFocus, ...props }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Mock data - in real app, this would come from form state
    // Showing 3 different testimonials (mix of text and video)
    const testimonials = [
        { id: 1, isVideo: false },
        { id: 2, isVideo: true },
        { id: 3, isVideo: false },
    ];

    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus(config.id, fieldPath);
    };

    const handlePrevious = () => {
        setCurrentTestimonial((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentTestimonial((prev) => Math.min(testimonials.length - 1, prev + 1));
    };

    return (
        <FormCard {...props}>
            <div className="flex-grow flex flex-col overflow-hidden relative">
                {/* Floating decorative elements */}
                <FloatingSparkles />

                {/* App bar */}
                <div className="flex-shrink-0">
                    <AppBar onBack={props.onPrevious} maxWidthClass="max-w-2xl" paddingXClass="px-8 sm:px-14" />
                </div>

                {/* Main scrollable content - scrollbar hidden */}
                <div className="flex-1 overflow-y-auto px-8 sm:px-14 py-6 relative z-10 scrollbar-hide">
                    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-6">
                        {/* Header with animated gradient text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1
                                className="text-2xl sm:text-3xl font-bold leading-tight bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent"
                                style={{ color: config.props.titleColor }}
                                onClick={() => handleFieldClick('props.title')}
                                data-field="props.title"
                            >
                                {config.props.title}
                            </h1>
                            <p
                                className="mt-3 text-sm sm:text-base text-gray-400 max-w-sm mx-auto"
                                style={{ color: config.props.descriptionColor }}
                                onClick={() => handleFieldClick('props.description')}
                                data-field="props.description"
                            >
                                {config.props.description}
                            </p>
                        </motion.div>

                        {/* Testimonial preview with navigation */}
                        <div className="w-full flex items-center justify-center gap-4">
                            {/* Left arrow */}
                            {testimonials.length > 1 && (
                                <div className="flex-shrink-0">
                                    <ArrowButton
                                        direction="left"
                                        onClick={handlePrevious}
                                        disabled={currentTestimonial === 0}
                                    />
                                </div>
                            )}

                            {/* Testimonial card with AnimatePresence for smooth transitions */}
                            <div className="flex-1 max-w-md">
                                <AnimatePresence mode="wait">
                                    <TestimonialPreviewCard
                                        key={currentTestimonial}
                                        isVideo={testimonials[currentTestimonial]?.isVideo}
                                        index={currentTestimonial}
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Right arrow */}
                            {testimonials.length > 1 && (
                                <div className="flex-shrink-0">
                                    <ArrowButton
                                        direction="right"
                                        onClick={handleNext}
                                        disabled={currentTestimonial === testimonials.length - 1}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Testimonial counter */}
                        {testimonials.length > 1 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xs text-gray-500"
                            >
                                Testimonial {currentTestimonial + 1} of {testimonials.length}
                            </motion.p>
                        )}

                        {/* Submit button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="w-full"
                        >
                            <button
                                type="button"
                                onClick={props.onNext}
                                className="group relative w-full overflow-hidden rounded-xl p-0.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
                                onClickCapture={() => handleFieldClick('props.buttonText')}
                                data-field="props.buttonText"
                            >
                                {/* Gradient border */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-xl" />

                                {/* Button content */}
                                <div className="relative bg-gray-950 rounded-[10px] px-6 py-3 group-hover:bg-gray-900/90 transition-colors">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="font-semibold text-white tracking-wide">
                                            {config.props.buttonText}
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </motion.div>

                        {/* Trust message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center justify-center gap-2 text-xs text-gray-500 pb-4"
                        >
                            <svg className="w-4 h-4 text-emerald-500/70" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>You control what's shared publicly</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </FormCard>
    );
};

export default ReadyToSendCard;
