import React from 'react';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { PrivateFeedbackBlockConfig } from '@/types/form-config';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface PrivateFeedbackCardProps extends FormCardProps {
  config: PrivateFeedbackBlockConfig;
  onFieldFocus: (blockId: string, fieldPath: string) => void;
}

const PrivateFeedbackCard: React.FC<PrivateFeedbackCardProps> = ({ config, onFieldFocus, theme, ...props }) => {

  const handleFieldClick = (fieldPath: string) => {
    onFieldFocus(config.id, fieldPath);
  };

  return (
    <FormCard {...props} theme={theme}>
      {/* 
        Layout: Centered content with responsive padding
        
        RESPONSIVE STRATEGY:
        - Form Builder (~800-1000px container): Uses base/sm styles
        - Preview/Public (full viewport): lg: breakpoints trigger for larger sizing
        
        Padding scales: px-6 → sm:px-8 → lg:px-12
      */}
      <div className="flex-grow flex flex-col overflow-hidden relative">

        {/* Back Button */}
        {props.onPrevious && <BackButton onClick={props.onPrevious} />}

        {/* 
          AppBar with Logo
          RESPONSIVE PADDING: px-6 → sm:px-8 → lg:px-12
        */}
        <div className="flex-shrink-0">
          <AppBar
            maxWidthClass="max-w-xl lg:max-w-2xl"
            paddingXClass="px-6 sm:px-8 lg:px-12"
            logoUrl={theme?.logoUrl}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full">
          <div className="w-full px-6 sm:px-8 lg:px-12 pb-8 lg:pb-12 pt-6 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-full max-w-xl lg:max-w-2xl"
            >
              {/* 
                Header Section
                RESPONSIVE TITLE: text-lg → sm:text-xl → lg:text-2xl
                RESPONSIVE DESC: text-sm → lg:text-base
              */}
              <h1
                className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight tracking-tight text-white"
                style={{ color: config.props.titleColor }}
                onClick={() => handleFieldClick('props.title')}
                data-field="props.title"
              >
                {config.props.title}
              </h1>
              <p
                className="text-sm lg:text-base text-gray-400 mt-2 lg:mt-3 leading-relaxed"
                onClick={() => handleFieldClick('props.description')}
                data-field="props.description"
              >
                {config.props.description || "This stays between us and helps us improve. It will never appear on your public testimonial."}
              </p>

              {/* 
                Form Section
                STANDARD TEXTAREA: text-base (16px prevents iOS zoom)
                STANDARD BUTTON: h-11 → lg:h-12
              */}
              <form className="mt-6 lg:mt-8 flex flex-col gap-4 lg:gap-5">
                {/* 
                  Textarea
                  STANDARD TEXT: text-base (16px on mobile prevents iOS zoom)
                  Height uses rows for natural sizing
                */}
                <textarea
                  name="testimonial"
                  id="testimonial-input"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 
                    text-base text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 
                    transition-all resize-none"
                  placeholder={config.props.placeholder}
                  rows={4}
                  onClick={() => handleFieldClick('props.placeholder')}
                  data-field="props.placeholder"
                />

                {/* 
                  Submit Button
                  STANDARD HEIGHT: h-11 → lg:h-12
                  STANDARD TEXT: text-sm → lg:text-base font-semibold
                */}
                <button
                  type="button"
                  className="w-full h-11 lg:h-12 rounded-xl bg-purple-600 hover:bg-purple-700 
                    text-sm lg:text-base font-semibold text-white 
                    shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 
                    transition-all active:scale-[0.98]"
                  onClick={() => {
                    handleFieldClick('props.buttonText');
                    props.onNext();
                  }}
                  data-field="props.buttonText"
                >
                  {config.props.buttonText}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default PrivateFeedbackCard;

