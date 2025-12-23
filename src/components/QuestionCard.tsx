import React, { useState } from 'react';
import { FormCardProps, FormCard } from '@/app/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { QuestionBlockConfig } from '@/types/form-config';
import { DEFAULT_TESTIMONIAL_TIPS } from '@/lib/default-form-config';

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m22 8-6 4 6 4V8Z"></path>
        <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
    </svg>
);

const TypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

interface QuestionCardProps extends FormCardProps {
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

    const [mode, setMode] = useState<'options' | 'text'>(initialMode);

    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus?.(config.id, fieldPath);
    };

    const rightPanelVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
    };

    const panelMotionProps = {
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    // Handle video button click - if only video is enabled, go to next page
    const handleVideoClick = () => {
        cardProps.onNext();
    };

    // Handle text button click - if only text is enabled, this is already shown
    const handleTextClick = () => {
        setMode('text');
    };

    return (
        <FormCard
            {...cardProps}
            theme={theme}
        >
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: The "Ask" - Animate width */}
                <motion.div
                    animate={{ width: mode === 'text' ? '33.3333%' : '50%' }}
                    transition={panelMotionProps}
                    className="w-full md:w-1/2 bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] flex flex-col overflow-hidden"
                >
                    <div className="flex-shrink-0">
                        <AppBar
                            onBack={cardProps.onPrevious}
                            showBackButton={Boolean(cardProps.onPrevious)}
                            maxWidthClass="max-w-lg"
                            paddingXClass="px-8 md:px-14"
                            logoUrl={theme?.logoUrl}
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto px-8 md:px-14 pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full max-w-lg mx-auto pt-10 md:pt-12"
                        >
                            {/* Question Section */}
                            <div className="mb-8 space-y-3">
                                <h1
                                    className="text-xl md:text-2xl font-semibold text-white break-words leading-tight tracking-tight"
                                    style={{ color: config.props.questionColor }}
                                    onClick={() => handleFieldClick('props.question')}
                                    data-field="props.question"
                                >
                                    {config.props.question}
                                </h1>
                                <p
                                    className="text-xs md:text-sm text-gray-400 break-words leading-relaxed"
                                    style={{ color: config.props.descriptionColor }}
                                    onClick={() => handleFieldClick('props.description')}
                                    data-field="props.description"
                                >
                                    {config.props.description}
                                </p>
                            </div>

                            {/* Guidance Section - Only show if there are tips */}
                            {tips.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tips for great testimonials:</h3>

                                    <motion.div
                                        className="space-y-2.5"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    >
                                        {tips.map((tip, index) => (
                                            <div key={index} className="flex items-start gap-2.5 group">
                                                <div className="mt-0.5">
                                                    <CheckCircleIcon className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-300 leading-relaxed">
                                                        <span className="font-medium text-white">{tip}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}

                            {/* Optional: Add a subtle decorative element */}
                            <div className="mt-6 flex justify-center">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Panel: The "Answer" - Animate width */}
                <motion.div
                    animate={{ width: mode === 'text' ? '66.6667%' : '50%' }}
                    transition={panelMotionProps}
                    className="w-full md:w-1/2 bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] flex flex-col justify-center items-center relative overflow-hidden"
                >
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]"></div>

                    <AnimatePresence mode="wait">
                        {mode === 'options' && (
                            <motion.div
                                key="options"
                                variants={rightPanelVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full max-w-lg mx-auto space-y-3 relative z-10 px-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center mb-4"
                                >
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {enableVideo && enableText ? 'Choose how to share' : 'Share your experience'}
                                    </h3>
                                </motion.div>

                                {/* Video Option - only show if enabled */}
                                {enableVideo && (
                                    <div
                                        className="group relative p-6 bg-gradient-to-br from-purple-600/5 via-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl text-center cursor-pointer transition-all duration-300 hover:border-purple-400/40 hover:from-purple-600/10 hover:via-purple-500/20 hover:to-purple-600/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                                        onClick={handleVideoClick}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {/* Enhanced Glow Effect */}
                                        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-purple-600/20 via-purple-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

                                        <div className="relative">
                                            <div className="mx-auto w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                                                <VideoIcon className="text-purple-400 group-hover:text-purple-300 transition-colors w-7 h-7" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-100 transition-colors">{config.props.videoOptionTitle || 'Record a video'}</h3>
                                            <p className="mt-1.5 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{config.props.videoOptionDescription || '2-minute video testimonial'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* OR Divider - only show if both options are enabled */}
                                {enableVideo && enableText && (
                                    <div className="relative py-1.5">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-700"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2.5 bg-gradient-to-r from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] text-gray-500">OR</span>
                                        </div>
                                    </div>
                                )}

                                {/* Text Option - only show if enabled */}
                                {enableText && (
                                    <div
                                        className="group relative p-6 bg-gradient-to-br from-lime-600/5 via-lime-500/10 to-lime-600/5 border border-lime-500/20 rounded-xl text-center cursor-pointer transition-all duration-300 hover:border-lime-400/40 hover:from-lime-600/10 hover:via-lime-500/20 hover:to-lime-600/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-lime-500/20"
                                        onClick={handleTextClick}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {/* Enhanced Glow Effect */}
                                        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-lime-600/20 via-lime-500/30 to-lime-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

                                        <div className="relative">
                                            <div className="mx-auto w-14 h-14 bg-lime-500/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-lime-500/20 transition-colors">
                                                <TypeIcon className="text-lime-400 group-hover:text-lime-300 transition-colors w-7 h-7" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-lime-100 transition-colors">{config.props.textOptionTitle || 'Write your story'}</h3>
                                            <p className="mt-1.5 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{config.props.textOptionDescription || 'Text testimonial'}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {mode === 'text' && (
                            <motion.div
                                key="text"
                                variants={rightPanelVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full h-full flex flex-col"
                            >
                                <AppBar onBack={enableVideo ? () => setMode('options') : undefined} showBackButton={enableVideo} logoUrl={theme?.logoUrl} />
                                <div className="flex-grow flex flex-col px-8 md:px-14 py-8 justify-center">
                                    <textarea
                                        placeholder="Share your experience..."
                                        className="w-full h-48 md:h-56 bg-[#232325] rounded-lg p-4 text-white text-base placeholder-gray-500 focus:outline-none resize-none transition-all focus:ring-2 focus:ring-purple-500/50"
                                    ></textarea>
                                    <div className="mt-5 flex-shrink-0">
                                        <button
                                            onClick={cardProps.onNext}
                                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </FormCard>
    );
};

export default QuestionCard;