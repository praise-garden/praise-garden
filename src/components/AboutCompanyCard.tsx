import React from 'react';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AboutCompanyBlockConfig } from '@/types/form-config';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface AboutCompanyCardProps extends Omit<FormCardProps, 'config' | 'onFieldFocus'> {
  config: AboutCompanyBlockConfig;
  onFieldFocus: (blockId: string, fieldPath: string) => void;
}

const AboutCompanyCard: React.FC<AboutCompanyCardProps> = ({ config, onFieldFocus, theme, ...props }) => {

  const handleFieldClick = (fieldPath: string) => {
    onFieldFocus(config.id, fieldPath);
  };

  return (
    <FormCard {...props} theme={theme}>
      {/* 
        Layout: Centered form with responsive padding
        
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
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full scrollbar-hide">
          <div className="w-full px-6 sm:px-8 lg:px-12 pb-8 lg:pb-12 pt-4">
            <div className="mx-auto flex w-full max-w-xl lg:max-w-2xl flex-col items-stretch">

              {/* 
                Header Section
                RESPONSIVE TITLE: text-xl → sm:text-2xl → lg:text-3xl
                RESPONSIVE DESC: text-sm → lg:text-base
                Spacing: mb-6 → lg:mb-8
              */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 lg:mb-8"
              >
                <h1
                  className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-white mb-2 lg:mb-3"
                  style={{ color: config.props.titleColor }}
                  onClick={() => handleFieldClick('props.title')}
                  data-field="props.title"
                >
                  {config.props.title}
                </h1>
                <p
                  className="text-sm lg:text-base text-gray-400 leading-relaxed"
                  onClick={() => handleFieldClick('props.description')}
                  data-field="props.description"
                >
                  {config.props.description || 'Help us understand your business better.'}
                </p>
              </motion.div>

              {/* 
                Form Fields
                STANDARD INPUT HEIGHT: h-11 (44px)
                STANDARD INPUT TEXT: text-base sm:text-sm (16px on mobile prevents iOS zoom)
                STANDARD LABEL: text-xs lg:text-sm
                Gap between fields: gap-4 lg:gap-5
              */}
              <form className="flex w-full flex-col gap-4 lg:gap-5 text-white">

                {/* Job Title Field */}
                {config.props.fields.jobTitle.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full flex flex-col gap-1.5 lg:gap-2"
                  >
                    <label
                      htmlFor="jobTitle"
                      className="font-medium text-xs lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.jobTitle.label')}
                      data-field="props.fields.jobTitle.label"
                    >
                      {config.props.fields.jobTitle.label}
                      {config.props.fields.jobTitle.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      required={config.props.fields.jobTitle.required}
                      type="text"
                      placeholder={config.props.fields.jobTitle.placeholder}
                      className="h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                        focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none 
                        transition-all w-full placeholder-gray-500"
                      onClick={() => handleFieldClick('props.fields.jobTitle.placeholder')}
                      data-field="props.fields.jobTitle.placeholder"
                    />
                  </motion.div>
                )}

                {/* Company Name Field */}
                {config.props.fields.companyName.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="w-full flex flex-col gap-1.5 lg:gap-2"
                  >
                    <label
                      htmlFor="companyName"
                      className="font-medium text-xs lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.companyName.label')}
                      data-field="props.fields.companyName.label"
                    >
                      {config.props.fields.companyName.label}
                      {config.props.fields.companyName.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      required={config.props.fields.companyName.required}
                      type="text"
                      placeholder={config.props.fields.companyName.placeholder}
                      className="h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                        focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none 
                        transition-all w-full placeholder-gray-500"
                      onClick={() => handleFieldClick('props.fields.companyName.placeholder')}
                      data-field="props.fields.companyName.placeholder"
                    />
                  </motion.div>
                )}

                {/* Role Field */}
                {config.props.fields.role.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full flex flex-col gap-1.5 lg:gap-2"
                  >
                    <label
                      htmlFor="role"
                      className="font-medium text-xs lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.role.label')}
                      data-field="props.fields.role.label"
                    >
                      {config.props.fields.role.label}
                      {config.props.fields.role.required
                        ? <span className="text-red-500 ml-0.5">*</span>
                        : <span className="text-gray-500 ml-1">(optional)</span>}
                    </label>
                    <input
                      id="role"
                      name="role"
                      required={config.props.fields.role.required}
                      type="text"
                      placeholder={config.props.fields.role.placeholder}
                      className="h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                        focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none 
                        transition-all w-full placeholder-gray-500"
                      onClick={() => handleFieldClick('props.fields.role.placeholder')}
                      data-field="props.fields.role.placeholder"
                    />
                  </motion.div>
                )}

                {/* 
                  Company Logo Section
                  RESPONSIVE LOGO: w-12 h-12 → lg:w-14 lg:h-14
                  RESPONSIVE BUTTON: h-10 (secondary button height)
                */}
                {config.props.fields.companyLogo.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="flex flex-col gap-1.5 lg:gap-2 pt-2"
                  >
                    <label
                      className="font-medium text-xs lg:text-sm text-gray-400"
                      onClick={() => handleFieldClick('props.fields.companyLogo.label')}
                      data-field="props.fields.companyLogo.label"
                    >
                      {config.props.fields.companyLogo.label}
                      {config.props.fields.companyLogo.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <Avatar className="w-12 h-12 lg:w-14 lg:h-14 border-2 border-blue-400/20 shadow-sm rounded-lg">
                        <AvatarImage src="https://ui-avatars.com/api/?name=Company&background=3b82f6&color=fff&size=200" alt="Company Logo" />
                        <AvatarFallback className="rounded-lg">CO</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        aria-label="Upload logo"
                        className="h-10 px-4 rounded-lg bg-gray-800 border border-gray-700 
                          text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-600 
                          transition-colors"
                      >
                        Upload logo
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 
                  Continue Button
                  STANDARD HEIGHT: h-11 → lg:h-12
                  STANDARD TEXT: text-sm → lg:text-base font-semibold
                  Spacing: mt-4 → lg:mt-6
                */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-4 lg:mt-6"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldClick('props.buttonText');
                      props.onNext();
                    }}
                    className="w-full h-11 lg:h-12 rounded-xl bg-purple-600 hover:bg-purple-700 
                      text-sm lg:text-base font-semibold text-white 
                      shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 
                      transition-all active:scale-[0.98]"
                    data-field="props.buttonText"
                  >
                    {config.props.buttonText}
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default AboutCompanyCard;

