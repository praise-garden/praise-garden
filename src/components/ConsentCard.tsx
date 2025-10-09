import React, { useState } from 'react';
import { FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';
import { motion } from 'framer-motion';
import { ConsentBlockConfig } from '@/types/form-config';

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

interface ConsentCardProps extends FormCardProps {
    config: ConsentBlockConfig;
    onFieldFocus?: (blockId: string, fieldPath: string) => void;
}

const ConsentCard: React.FC<ConsentCardProps> = ({ config, onFieldFocus, ...props }) => {
  const [consented, setConsented] = useState<boolean>(false);

  const handleFieldClick = (fieldPath: string) => {
    onFieldFocus?.(config.id, fieldPath);
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
              <h1 
                className="text-lg md:text-xl font-semibold text-white mb-3"
                style={{ color: config.props.titleColor }}
                onClick={() => handleFieldClick('props.title')}
                data-field="props.title"
              >
                {config.props.title}
              </h1>
              <p 
                className="text-sm text-gray-400 leading-relaxed"
                style={{ color: config.props.descriptionColor }}
                onClick={() => handleFieldClick('props.description')}
                data-field="props.description"
              >
                {config.props.description}
              </p>
            </div>

            {/* Consent Checkbox */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`group relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                consented
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                  : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600 hover:bg-[#222222]'
              }`}
              onClick={() => setConsented(!consented)}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  consented 
                    ? 'border-purple-500 bg-purple-500' 
                    : 'border-gray-600 group-hover:border-gray-500'
                }`}>
                  {consented && (
                    <CheckIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p 
                    className="text-sm text-white leading-relaxed"
                    onClick={(e) => { e.stopPropagation(); handleFieldClick('props.checkboxLabel'); }}
                    data-field="props.checkboxLabel"
                  >
                    {config.props.checkboxLabel}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button 
                onClick={props.onNext}
                className={`w-full py-3 px-4 mt-6 rounded-lg font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02]`}
                onClickCapture={() => handleFieldClick('props.buttonText')}
                data-field="props.buttonText"
              >
                {config.props.buttonText}
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
