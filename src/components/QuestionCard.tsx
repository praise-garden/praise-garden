import React, { useState } from 'react';
import { PageItem, FormCardProps, FormCard } from '@/app/dashboard/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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
    onUpdate: (id:string, content: PageItem['content']) => void;
}

const QuestionCard = ({ 
    page, 
    onUpdate,
    ...cardProps 
}: QuestionCardProps) => {
  
    const [mode, setMode] = useState<'options' | 'text'>('options');

    const handleContentChange = (field: 'question' | 'description' | 'testimonial', value: string) => {
        onUpdate(page.id, {
            ...page.content,
            [field]: value,
        });
    };

    const rightPanelVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
    };

    const panelMotionProps = {
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <FormCard 
            page={page} 
            {...cardProps}
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
                            paddingXClass="px-6 md:px-12"
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto px-6 md:px-12 pb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full max-w-lg mx-auto pt-12 md:pt-16"
                        >
                            {/* Question Section - Compact & Original */}
                            <div className="mb-6">
                               
                                <h1 className="mt-4 text-2xl md:text-3xl font-semibold text-white break-words leading-tight tracking-tight">
                                    {page.content?.question || "Share your success story with us"}
                                </h1>
                                <p className="mt-2 text-sm text-gray-400 break-words leading-relaxed">
                                    {page.content?.description || "Help others discover the value you've experienced"}
                                </p>
                            </div>

                            {/* Guidance Section with Better Layout */}
                            <div className="space-y-4 px-2">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tips for great testimonials:</h3>
                                
                                <motion.div 
                                    className="space-y-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <div className="flex items-start gap-3 group">
                                        <div className="mt-0.5">
                                            <CheckCircleIcon className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                <span className="font-medium text-white">Share specific results</span>
                                                <br />
                                                <span className="text-gray-400">e.g. "Our conversion rate increased by 30%"</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 group">
                                        <div className="mt-0.5">
                                            <CheckCircleIcon className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                <span className="font-medium text-white">Mention your timeline</span>
                                                <br />
                                                <span className="text-gray-400">e.g. "In just 2 months of using this..."</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 group">
                                        <div className="mt-0.5">
                                            <CheckCircleIcon className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                <span className="font-medium text-white">Highlight a favorite feature</span>
                                                <br />
                                                <span className="text-gray-400">e.g. "The automation saved us 10 hours/week"</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Optional: Add a subtle decorative element */}
                            <div className="mt-8 flex justify-center">
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
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
                                className="w-full max-w-md mx-auto space-y-4 relative z-10"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center mb-6"
                                >
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Choose how to share</h3>
                                </motion.div>

                                <div 
                                    className="group relative p-8 bg-gradient-to-br from-purple-600/5 via-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:border-purple-400/40 hover:from-purple-600/10 hover:via-purple-500/20 hover:to-purple-600/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                                    onClick={cardProps.onNext}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {/* Enhanced Glow Effect */}
                                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-600/20 via-purple-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                                    
                                    <div className="relative">
                                        <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                            <VideoIcon className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-100 transition-colors">Record a video</h3>
                                        <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">2-minute video testimonial</p>
                                    </div>
                                </div>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-gradient-to-r from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] text-gray-500">OR</span>
                                    </div>
                                </div>

                                <div 
                                    className="group relative p-8 bg-gradient-to-br from-lime-600/5 via-lime-500/10 to-lime-600/5 border border-lime-500/20 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:border-lime-400/40 hover:from-lime-600/10 hover:via-lime-500/20 hover:to-lime-600/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-lime-500/20"
                                    onClick={() => setMode('text')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {/* Enhanced Glow Effect */}
                                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-lime-600/20 via-lime-500/30 to-lime-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                                    
                                    <div className="relative">
                                        <div className="mx-auto w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-lime-500/20 transition-colors">
                                            <TypeIcon className="text-lime-400 group-hover:text-lime-300 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white group-hover:text-lime-100 transition-colors">Write your story</h3>
                                        <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Text testimonial</p>
                                    </div>
                                </div>
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
                                <AppBar onBack={() => setMode('options')} showBackArrow={true} />
                                <div className="flex-grow flex flex-col p-6 md:p-12 justify-center">
                                    <textarea
                                        placeholder="Write your testimonial..."
                                        className="w-full h-56 md:h-64 bg-[#232325] rounded-lg p-4 text-white text-lg placeholder-gray-500 focus:outline-none resize-none transition-all focus:ring-2 focus:ring-purple-500/50"
                                        onChange={(e) => handleContentChange('testimonial', e.target.value)}
                                    ></textarea>
                                    <div className="mt-6 flex-shrink-0">
                                        <button 
                                            onClick={cardProps.onNext}
                                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all text-base shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
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