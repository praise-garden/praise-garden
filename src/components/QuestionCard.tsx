import React, { useState, useEffect } from 'react';
import { FormCardProps, FormCard } from '@/app/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { QuestionBlockConfig } from '@/types/form-config';
import VideoRecorder from './VideoRecorder';
import MobileVideoCapture from './MobileVideoCapture';
import { DEFAULT_TESTIMONIAL_TIPS } from '@/lib/default-form-config';

// ═══════════════════════════════════════════════════════════════════════════
// ICONS - Feature/option icons (w-6 h-6 → lg:w-7 lg:h-7)
// ═══════════════════════════════════════════════════════════════════════════

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m22 8-6 4 6 4V8Z" />
        <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
    </svg>
);

const TypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// HELPER HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface QuestionCardProps extends Omit<FormCardProps, 'onFieldFocus'> {
    config: QuestionBlockConfig;
    onFieldFocus?: (blockId: string, fieldPath: string) => void;
}

const QuestionCard = ({
    config,
    onFieldFocus,
    theme,
    ...cardProps
}: QuestionCardProps) => {

    // Determine initial mode based on what's enabled
    const enableVideo = config.props.enableVideoTestimonial ?? true;
    const enableText = config.props.enableTextTestimonial ?? true;
    const tips = config.props.tips || DEFAULT_TESTIMONIAL_TIPS;

    // If only one option is enabled, start in that mode
    const initialMode = (enableVideo && enableText) ? 'options' :
        (enableText && !enableVideo) ? 'text' : 'options';

    const [mode, setMode] = useState<'options' | 'text' | 'video'>(initialMode);
    const [lightMode, setLightMode] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus?.(config.id, fieldPath);
    };

    // Animation variants for right panel transitions
    const rightPanelVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
    };

    const panelMotionProps = {
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    // Handle video button click - switches to inline video mode
    const handleVideoClick = () => {
        setMode('video');
    };

    const handleVideoComplete = (blob: Blob) => {
        console.log('Video recorded:', blob);
        cardProps.onNext();
    };

    const handleVideoCancel = () => {
        setMode('options');
    };

    const handleTextClick = () => {
        setMode('text');
    };

    return (
        <FormCard
            {...cardProps}
            theme={theme}
        >
            {/* 
              SPLIT LAYOUT STRUCTURE:
              - Mobile: Stacked (full width each)
              - Desktop: Side-by-side (50/50 or 33/67 based on mode)
              
              Mode affects panel widths:
              - options: 50% / 50%
              - text: 33% / 67%
              - video: 33% / 67%
            */}
            <div className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative custom-scrollbar">

                {/* 
                  LEFT PANEL: "The Ask" - Question, Description, Tips
                  
                  RESPONSIVE:
                  - Padding: px-6 sm:px-8 lg:px-12
                  - Width animates based on mode (desktop only)
                  - Background changes with lightMode (for video recording)
                */}
                <motion.div
                    animate={{
                        width: isDesktop
                            ? (mode === 'options' ? '50%' : '33.3333%')
                            : '100%'
                    }}
                    transition={panelMotionProps}
                    className={`w-full cq-lg:w-1/2 flex flex-col shrink-0 cq-lg:overflow-hidden transition-colors duration-500 
                        ${lightMode ? 'bg-white' : 'bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A]'}`}
                >
                    {/* App Bar with Logo and Back Button on right */}
                    <div className="flex-shrink-0">
                        <AppBar
                            maxWidthClass="max-w-md cq-lg:max-w-lg"
                            paddingXClass="px-6 sm:px-8 cq-lg:px-12"
                            logoUrl={theme?.logoUrl}
                            showBackButton={
                                mode === 'video' ||
                                (mode === 'text' && enableVideo) ||
                                !!cardProps.onPrevious
                            }
                            onBack={
                                mode === 'video' ? () => setMode('options') :
                                    mode === 'text' && enableVideo ? () => setMode('options') :
                                        cardProps.onPrevious || undefined
                            }
                        />
                    </div>

                    {/* Left Panel Content */}
                    <div className="flex-grow cq-lg:overflow-y-auto px-6 sm:px-8 cq-lg:px-12 pb-8 cq-lg:pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full max-w-md cq-lg:max-w-lg mx-auto pt-8 cq-lg:pt-10"
                        >
                            {/* 
                              Question Section
                              RESPONSIVE TITLE: text-xl → sm:text-2xl → lg:text-3xl
                              RESPONSIVE DESC: text-sm → lg:text-base
                              Gap: space-y-3 → lg:space-y-4
                            */}
                            <div className="mb-6 cq-lg:mb-8 space-y-3 cq-lg:space-y-4">
                                <h1
                                    className={`text-xl sm:text-2xl cq-lg:text-3xl font-bold leading-tight tracking-tight transition-colors duration-500 
                                        ${lightMode ? 'text-gray-900' : 'text-white'}`}
                                    style={{ color: lightMode ? undefined : config.props.questionColor }}
                                    onClick={() => handleFieldClick('props.question')}
                                    data-field="props.question"
                                >
                                    {config.props.question}
                                </h1>
                                <p
                                    className={`text-sm cq-lg:text-base leading-relaxed transition-colors duration-500 
                                        ${lightMode ? 'text-gray-600' : 'text-gray-400'}`}
                                    style={{ color: lightMode ? undefined : config.props.descriptionColor }}
                                    onClick={() => handleFieldClick('props.description')}
                                    data-field="props.description"
                                >
                                    {config.props.description}
                                </p>
                            </div>

                            {/* 
                              Guidance Section - Tips
                              RESPONSIVE HEADER: text-xs → lg:text-xs (uppercase, stays small)
                              RESPONSIVE TIPS: text-xs → lg:text-sm
                              RESPONSIVE ICONS: w-4 h-4 → lg:w-5 lg:h-5
                            */}
                            {tips.length > 0 && (
                                <div className="space-y-3 cq-lg:space-y-4">
                                    <h3 className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-500 
                                        ${lightMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Tips for great testimonials:
                                    </h3>
                                    <motion.div
                                        className="space-y-2 cq-lg:space-y-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    >
                                        {tips.map((tip, index) => (
                                            <div key={index} className="flex items-start gap-2 cq-lg:gap-3 group">
                                                <div className="mt-0.5">
                                                    <CheckCircleIcon className="text-emerald-500 w-4 h-4 cq-lg:w-5 cq-lg:h-5 flex-shrink-0" />
                                                </div>
                                                <p className={`text-xs cq-lg:text-sm leading-relaxed transition-colors duration-500 
                                                    ${lightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                                                    <span className={`font-medium transition-colors duration-500 
                                                        ${lightMode ? 'text-gray-800' : 'text-white'}`}>
                                                        {tip}
                                                    </span>
                                                </p>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}

                            {/* Decorative Divider */}
                            <div className="mt-6 cq-lg:mt-8 flex justify-center">
                                <div className={`h-px w-16 cq-lg:w-20 bg-gradient-to-r from-transparent to-transparent transition-colors duration-500 
                                    ${lightMode ? 'via-gray-300' : 'via-gray-600'}`} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Visual Divider between sections on mobile */}
                <div className="cq-lg:hidden w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                {/* 
                  RIGHT PANEL: "The Answer" - Options, Text Input, or Video
                  
                  RESPONSIVE:
                  - Width animates based on mode (desktop only)
                  - Contains three possible views: options, text, video
                */}
                <motion.div
                    animate={{
                        width: isDesktop
                            ? (mode === 'options' ? '50%' : '66.6667%')
                            : '100%'
                    }}
                    transition={panelMotionProps}
                    className={`w-full cq-lg:w-1/2 flex flex-col justify-center items-center shrink-0 relative cq-lg:overflow-hidden transition-colors duration-500 
                        min-h-[400px] cq-lg:min-h-0 py-6 cq-lg:py-0 
                        ${lightMode ? 'bg-white' : 'bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F]'}`}
                >
                    {/* Subtle background pattern (not in video mode) */}
                    {mode !== 'video' && (
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]" />
                    )}

                    <AnimatePresence mode="wait">
                        {/* 
                          OPTIONS MODE - Video and Text option cards
                          
                          RESPONSIVE:
                          - Option cards: p-5 lg:p-6
                          - Icon containers: w-12 h-12 lg:w-14 lg:h-14
                          - Icons: w-6 h-6 lg:w-7 lg:h-7
                          - Option title: text-base lg:text-lg
                          - Option description: text-xs lg:text-sm
                        */}
                        {mode === 'options' && (
                            <motion.div
                                key="options"
                                variants={rightPanelVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full max-w-sm cq-lg:max-w-md mx-auto space-y-3 cq-lg:space-y-4 relative z-10 px-6 pb-6 cq-lg:pb-0"
                            >
                                {/* Section Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center mb-3 cq-lg:mb-4"
                                >
                                    <h3 className="text-xs cq-lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {enableVideo && enableText ? 'Choose how to share' : 'Share your experience'}
                                    </h3>
                                </motion.div>

                                {/* Video Option Card */}
                                {enableVideo && (
                                    <div
                                        className="group relative p-5 cq-lg:p-6 bg-gradient-to-br from-purple-600/5 via-purple-500/10 to-purple-600/5 
                                            border border-purple-500/20 rounded-xl text-center cursor-pointer transition-all duration-300 
                                            hover:border-purple-400/40 hover:from-purple-600/10 hover:via-purple-500/20 hover:to-purple-600/10 
                                            hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                                        onClick={handleVideoClick}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-purple-600/20 via-purple-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

                                        <div className="relative">
                                            <div className="mx-auto w-12 h-12 cq-lg:w-14 cq-lg:h-14 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                                                <VideoIcon className="text-purple-400 group-hover:text-purple-300 transition-colors w-6 h-6 cq-lg:w-7 cq-lg:h-7" />
                                            </div>
                                            <h3 className="text-base cq-lg:text-lg font-semibold text-white group-hover:text-purple-100 transition-colors">
                                                {config.props.videoOptionTitle || 'Record a video'}
                                            </h3>
                                            <p className="mt-1.5 text-xs cq-lg:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                {config.props.videoOptionDescription || '2-minute video testimonial'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* OR Divider */}
                                {enableVideo && enableText && (
                                    <div className="relative py-1">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-700" />
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-3 bg-gradient-to-r from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] text-gray-500">OR</span>
                                        </div>
                                    </div>
                                )}

                                {/* Text Option Card */}
                                {enableText && (
                                    <div
                                        className="group relative p-5 cq-lg:p-6 bg-gradient-to-br from-lime-600/5 via-lime-500/10 to-lime-600/5 
                                            border border-lime-500/20 rounded-xl text-center cursor-pointer transition-all duration-300 
                                            hover:border-lime-400/40 hover:from-lime-600/10 hover:via-lime-500/20 hover:to-lime-600/10 
                                            hover:scale-[1.02] hover:shadow-2xl hover:shadow-lime-500/20"
                                        onClick={handleTextClick}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-lime-600/20 via-lime-500/30 to-lime-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

                                        <div className="relative">
                                            <div className="mx-auto w-12 h-12 cq-lg:w-14 cq-lg:h-14 bg-lime-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-lime-500/20 transition-colors">
                                                <TypeIcon className="text-lime-400 group-hover:text-lime-300 transition-colors w-6 h-6 cq-lg:w-7 cq-lg:h-7" />
                                            </div>
                                            <h3 className="text-base cq-lg:text-lg font-semibold text-white group-hover:text-lime-100 transition-colors">
                                                {config.props.textOptionTitle || 'Write your story'}
                                            </h3>
                                            <p className="mt-1.5 text-xs cq-lg:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                {config.props.textOptionDescription || 'Text testimonial'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* 
                          TEXT MODE - Textarea for written testimonial
                          
                          RESPONSIVE:
                          - Textarea: h-40 lg:h-48, text-base (16px prevents iOS zoom)
                          - Button: h-11 lg:h-12, text-sm lg:text-base
                          - Padding: px-6 sm:px-8 lg:px-12
                        */}
                        {mode === 'text' && (
                            <motion.div
                                key="text"
                                variants={rightPanelVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full h-full flex flex-col"
                            >
                                <AppBar logoUrl={theme?.logoUrl} paddingXClass="px-6 sm:px-8 cq-lg:px-12" />
                                <div className="flex-grow flex flex-col px-6 sm:px-8 cq-lg:px-12 py-6 cq-lg:py-8 justify-center max-w-xl cq-lg:max-w-2xl mx-auto w-full">
                                    <textarea
                                        placeholder="Share your experience..."
                                        className="w-full h-40 cq-lg:h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 
                                            text-base text-white placeholder-gray-500 
                                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
                                            resize-none transition-all"
                                    />
                                    {/* 
                                      Continue Button
                                      STANDARD HEIGHT: h-11 lg:h-12
                                      STANDARD TEXT: text-sm lg:text-base font-semibold
                                    */}
                                    <div className="mt-5 cq-lg:mt-6 flex-shrink-0">
                                        <button
                                            onClick={cardProps.onNext}
                                            className="w-full h-11 cq-lg:h-12 bg-purple-600 hover:bg-purple-700 
                                                text-white text-sm cq-lg:text-base font-semibold rounded-xl 
                                                transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 
                          VIDEO MODE - Video recorder (desktop) or native camera (mobile)
                        */}
                        {mode === 'video' && (
                            <motion.div
                                key="video"
                                variants={rightPanelVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full h-full flex flex-col"
                            >
                                {isDesktop ? (
                                    <VideoRecorder
                                        onCancel={handleVideoCancel}
                                        onComplete={handleVideoComplete}
                                        onLightModeChange={setLightMode}
                                    />
                                ) : (
                                    <MobileVideoCapture
                                        onCancel={handleVideoCancel}
                                        onComplete={handleVideoComplete}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </FormCard>
    );
};

export default QuestionCard;