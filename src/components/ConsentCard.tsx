import React, { useState } from 'react';
import { PageItem, FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';
import { motion } from 'framer-motion';

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface ConsentCardProps extends FormCardProps {}

const ConsentCard: React.FC<ConsentCardProps> = (props) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleContinue = () => {
    if (selectedOption) {
      props.onNext();
    }
  };

  return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col overflow-hidden">
        <AppBar onBack={props.onPrevious} />
        
        <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto"
          >
            {/* Header Section */}
            <div className="text-center mb-6">
              <h1 className="text-lg md:text-xl font-semibold text-white mb-3">
                Where can we use your testimonial?
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your testimonial helps others discover our product. Choose how you'd like us to use it.
              </p>
            </div>

            {/* Consent Options */}
            <div className="space-y-3 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`group relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedOption === 'public' 
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600 hover:bg-[#222222]'
                }`}
                onClick={() => setSelectedOption('public')}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedOption === 'public' 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-600 group-hover:border-gray-500'
                  }`}>
                    {selectedOption === 'public' && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <GlobeIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Public testimonial</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We'll share your testimonial on our website, social media, and marketing materials. 
                      Help others discover the value you've experienced.
                    </p>

                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`group relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedOption === 'private' 
                    ? 'border-lime-500 bg-lime-500/10 shadow-lg shadow-lime-500/20' 
                    : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600 hover:bg-[#222222]'
                }`}
                onClick={() => setSelectedOption('private')}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedOption === 'private' 
                      ? 'border-lime-500 bg-lime-500' 
                      : 'border-gray-600 group-hover:border-gray-500'
                  }`}>
                    {selectedOption === 'private' && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-lime-500/10">
                        <ShieldIcon className="w-5 h-5 text-lime-400" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Private testimonial</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We'll keep your testimonial private for internal use only. We'll use it to improve our product 
                      and share with potential customers in private conversations.
                    </p>
             
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button 
                onClick={handleContinue}
                disabled={!selectedOption}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedOption 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02]' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </motion.div>

            {/* Trust Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500">
                Your privacy is important to us. We'll always respect your choice.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </FormCard>
  );
};

export default ConsentCard;
