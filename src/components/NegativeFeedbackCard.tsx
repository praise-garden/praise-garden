
import React, { useState } from 'react';
import { FormCard, FormCardProps } from '@/app/dashboard/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';

// A simple icon placeholder for an illustration.
const MessageCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const NegativeFeedbackCard: React.FC<FormCardProps> = (props) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const feedbackCategories = ["Speed", "Features", "Support", "Pricing", "Other"];

    return (
        <FormCard {...props}>
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                {/* Left Side: Compassionate Message */}
                <div className="w-full md:w-2/5 bg-[#2a2a2a] flex flex-col overflow-hidden">
                    <div className="flex-shrink-0">
                        <AppBar
                            onBack={props.onPrevious}
                            showBackButton={Boolean(props.onPrevious)}
                            maxWidthClass="max-w-sm"
                            paddingXClass="px-6"
                        />
                    </div>
                    <div className="flex-grow flex items-center justify-center px-6 pb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 inline-block">
                               <MessageCircleIcon className="text-amber-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">We're sorry</h2>
                            <p className="text-gray-300 text-sm max-w-xs mx-auto">
                                We're genuinely sorry you had a less-than-perfect experience. Your honest feedback is essential for us to learn, improve, and grow.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Feedback Form */}
                <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                    <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.5, delay: 0.4 }}
                         className="w-full max-w-md mx-auto"
                    >
                        <label htmlFor="feedback-textarea" className="text-lg font-medium text-white mb-3 block text-left">Could you please tell us more?</label>
                        <textarea
                            id="feedback-textarea"
                            placeholder="Please share as much detail as possible..."
                            className="w-full h-36 bg-[#1E1E1E] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
                        ></textarea>
                        
                        {/* Simplified Promise */}
                        <p className="text-center text-xs text-gray-500 mt-4">
                            We value your feedback and review every submission carefully.
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center gap-3 mt-6">
                            <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-4 rounded-lg transition-all text-sm">
                                Submit Feedback
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </FormCard>
    );
};

export default NegativeFeedbackCard;


