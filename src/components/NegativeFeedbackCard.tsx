import React, { useState } from 'react';
import { FormCard, FormCardProps } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { NegativeFeedbackBlockConfig } from '@/types/form-config';

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const MessageCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface NegativeFeedbackCardProps extends FormCardProps {
    config: NegativeFeedbackBlockConfig;
    onFieldFocus: (blockId: string, fieldPath: string) => void;
}

const NegativeFeedbackCard: React.FC<NegativeFeedbackCardProps> = ({ config, onFieldFocus, theme, ...props }) => {

    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus(config.id, fieldPath);
    };

    return (
        <FormCard {...props} theme={theme}>
            {/* 
              SPLIT LAYOUT STRUCTURE:
              - Mobile: Stacked (full width each)
              - Desktop (lg:): Side-by-side (40% / 60%)
              
              Uses lg: instead of md: to match our responsive strategy
            */}
            <div className="flex-grow flex flex-col cq-lg:flex-row overflow-hidden relative">

                {/* Back Button */}
                {props.onPrevious && <BackButton onClick={props.onPrevious} />}

                {/* 
                  LEFT PANEL: Compassionate Message
                  
                  RESPONSIVE:
                  - Width: 100% mobile → 40% desktop
                  - Padding: px-6 → sm:px-8 → lg:px-12
                  - Typography scales with lg: breakpoints
                */}
                <div className="w-full cq-lg:w-2/5 bg-[#2a2a2a] flex flex-col overflow-hidden">

                    {/* AppBar with Logo */}
                    <div className="flex-shrink-0">
                        <AppBar
                            maxWidthClass="max-w-md cq-lg:max-w-lg"
                            paddingXClass="px-6 sm:px-8 cq-lg:px-12"
                            logoUrl={theme?.logoUrl}
                        />
                    </div>

                    {/* Message Content */}
                    <div className="flex-grow flex items-center justify-center px-6 sm:px-8 cq-lg:px-12 pb-8 cq-lg:pb-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center max-w-xs cq-lg:max-w-sm"
                        >
                            {/* Icon - Responsive sizing */}
                            <div className="p-3 cq-lg:p-4 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 cq-lg:mb-5 inline-block">
                                <MessageCircleIcon className="text-amber-400 w-8 h-8 cq-lg:w-10 cq-lg:h-10" />
                            </div>

                            {/* Title - Responsive: text-xl → sm:text-2xl → cq-lg:text-3xl (Standard) */}
                            <h1
                                className="text-xl sm:text-2xl cq-lg:text-3xl font-bold text-white mb-2 cq-lg:mb-3 leading-tight"
                                style={{ color: config.props.titleColor }}
                                onClick={() => handleFieldClick('props.title')}
                                data-field="props.title"
                            >
                                {config.props.title}
                            </h1>

                            {/* Description - Responsive: text-xs → cq-lg:text-sm */}
                            <p
                                className="text-xs cq-lg:text-sm text-gray-300 leading-relaxed"
                                style={{ color: config.props.descriptionColor }}
                                onClick={() => handleFieldClick('props.description')}
                                data-field="props.description"
                            >
                                {config.props.description}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* 
                  RIGHT PANEL: Feedback Form
                  
                  RESPONSIVE:
                  - Width: 100% mobile → 60% desktop
                  - Padding: px-6 → sm:px-8 → lg:px-12
                  - Textarea and button follow design specs
                */}
                <div className="w-full cq-lg:w-3/5 px-6 sm:px-8 cq-lg:px-12 py-8 cq-lg:py-0 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-full max-w-md cq-lg:max-w-lg mx-auto"
                    >
                        {/* 
                          Feedback Question Label
                          RESPONSIVE: text-sm → lg:text-base font-medium
                        */}
                        <label
                            htmlFor="feedback-textarea"
                            className="text-sm cq-lg:text-base font-medium text-white mb-2 cq-lg:mb-3 block text-left"
                            onClick={() => handleFieldClick('props.feedbackQuestion')}
                            data-field="props.feedbackQuestion"
                        >
                            {config.props.feedbackQuestion || 'Could you please tell us more?'}
                        </label>

                        {/* 
                          Textarea
                          STANDARD HEIGHT: h-32 → lg:h-40
                          STANDARD TEXT: text-base (16px prevents iOS zoom)
                        */}
                        <textarea
                            id="feedback-textarea"
                            placeholder={config.props.feedbackPlaceholder || 'Please share as much detail as possible...'}
                            className="w-full h-32 cq-lg:h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 
                                text-base text-white placeholder-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 
                                transition-all resize-none"
                            onClick={() => handleFieldClick('props.feedbackPlaceholder')}
                            data-field="props.feedbackPlaceholder"
                        />

                        {/* Helper Text - Responsive: text-[11px] → cq-lg:text-xs */}
                        <p
                            className="text-center text-[11px] cq-lg:text-xs text-gray-500 mt-3 cq-lg:mt-4"
                            onClick={() => handleFieldClick('props.feedbackHelperText')}
                            data-field="props.feedbackHelperText"
                        >
                            {config.props.feedbackHelperText || 'We value your feedback and review every submission carefully.'}
                        </p>

                        {/* 
                          Submit Button
                          STANDARD HEIGHT: h-11 → lg:h-12
                          STANDARD TEXT: text-sm → lg:text-base font-semibold
                          Note: Using amber color to match the card's theme
                        */}
                        <div className="mt-5 cq-lg:mt-6">
                            <button
                                className="w-full h-11 cq-lg:h-12 rounded-xl bg-amber-500 hover:bg-amber-600 
                                    text-sm cq-lg:text-base font-semibold text-black 
                                    shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 
                                    transition-all active:scale-[0.98]"
                                onClick={() => {
                                    handleFieldClick('props.buttonText');
                                    props.onNext();
                                }}
                                data-field="props.buttonText"
                            >
                                {config.props.buttonText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </FormCard>
    );
};

export default NegativeFeedbackCard;
