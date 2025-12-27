"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormConfig, FormBlock, FormBlockType, FormTheme } from '@/types/form-config';

// Import all card components
import WelcomeCard from '@/components/WelcomeCard';
import RatingCard from '@/components/RatingCard';
import QuestionCard from '@/components/QuestionCard';
import NegativeFeedbackCard from '@/components/NegativeFeedbackCard';
import PrivateFeedbackCard from '@/components/PrivateFeedbackCard';
import ConsentCard from '@/components/ConsentCard';
import AboutYouCard from '@/components/AboutYouCard';
import AboutCompanyCard from '@/components/AboutCompanyCard';
import ReadyToSendCard from '@/components/ReadyToSendCard';
import ThankYouCard from '@/components/ThankYouCard';

interface FormRendererProps {
    formConfig: FormConfig;
    onComplete?: (responses: FormResponses) => void;
    isPreview?: boolean; // True in form builder preview, false in public form
}

// Type for collecting user responses
export interface FormResponses {
    rating?: number;
    testimonialText?: string;
    testimonialVideo?: Blob;
    privateFeedback?: string;
    userInfo?: {
        name?: string;
        email?: string;
        title?: string;
        company?: string;
        avatar?: string;
    };
    consent?: {
        useTestimonial: boolean;
        useNameAndPhoto: boolean;
    };
}

const FormRenderer: React.FC<FormRendererProps> = ({
    formConfig,
    onComplete,
    isPreview = false,
}) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [responses, setResponses] = useState<FormResponses>({});

    // Get only enabled blocks
    const enabledBlocks = formConfig.blocks.filter(b => b.enabled);
    const totalPages = enabledBlocks.length;
    const currentBlock = enabledBlocks[currentPageIndex];

    // Navigation handlers
    const handleNext = useCallback(() => {
        if (currentPageIndex < totalPages - 1) {
            setCurrentPageIndex(prev => prev + 1);
        } else {
            // Form completed
            onComplete?.(responses);
        }
    }, [currentPageIndex, totalPages, responses, onComplete]);

    const handlePrevious = useCallback(() => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    }, [currentPageIndex]);

    // No-op field focus handler (only used in editor)
    const handleFieldFocus = useCallback(() => { }, []);

    // Update responses (will be connected to individual card callbacks)
    const updateResponses = useCallback((update: Partial<FormResponses>) => {
        setResponses(prev => ({ ...prev, ...update }));
    }, []);

    if (!currentBlock) {
        return null;
    }

    // Common props for all cards
    const cardProps = {
        config: currentBlock,
        currentPage: currentPageIndex + 1,
        totalPages,
        onNext: handleNext,
        onPrevious: handlePrevious,
        onFieldFocus: handleFieldFocus,
        theme: formConfig.theme,
        isPreview: true, // Always true to get full-screen layout
    };

    // Render the appropriate card based on block type
    const renderCard = () => {
        switch (currentBlock.type) {
            case FormBlockType.Welcome:
                return <WelcomeCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.Rating:
                return <RatingCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.Question:
                return <QuestionCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.NegativeFeedback:
                return <NegativeFeedbackCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.PrivateFeedback:
                return <PrivateFeedbackCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.Consent:
                return <ConsentCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.AboutYou:
                return <AboutYouCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.AboutCompany:
                return <AboutCompanyCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.ReadyToSend:
                return <ReadyToSendCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            case FormBlockType.ThankYou:
                return <ThankYouCard key={currentBlock.id} {...cardProps} config={currentBlock as any} />;
            default:
                return null;
        }
    };

    return (
        <div
            className="w-full h-full"
            style={{ backgroundColor: formConfig.theme.backgroundColor }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBlock.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full h-full"
                >
                    {renderCard()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FormRenderer;
