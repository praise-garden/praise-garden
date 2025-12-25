import React from 'react';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AboutCompanyBlockConfig } from '@/types/form-config';

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

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
        Matches the AboutYouCard layout for consistency
        
        STRUCTURE:
        - Row 1: Company Name + Job Title (side-by-side on sm+)
        - Row 2: Company Website (full width with globe icon)
        - Row 3: Company Logo (avatar + upload button, like AboutYouCard avatar)
      */}
      <div className="flex-grow flex flex-col overflow-hidden relative">

        {/* Back Button */}
        {props.onPrevious && <BackButton onClick={props.onPrevious} />}

        {/* AppBar with Logo */}
        <div className="flex-shrink-0">
          <AppBar
            maxWidthClass="max-w-xl cq-lg:max-w-2xl"
            paddingXClass="px-6 sm:px-8 cq-lg:px-12"
            logoUrl={theme?.logoUrl}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full scrollbar-hide">
          <div className="w-full px-6 sm:px-8 cq-lg:px-12 pb-6 cq-lg:pb-10 pt-2 cq-lg:pt-4">
            <div className="mx-auto flex w-full max-w-xl cq-lg:max-w-2xl flex-col items-stretch">

              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 cq-lg:mb-6"
              >
                <h1
                  className="text-xl sm:text-2xl cq-lg:text-3xl font-bold leading-tight tracking-tight text-white mb-2 cq-lg:mb-3"
                  style={{ color: config.props.titleColor }}
                  onClick={() => handleFieldClick('props.title')}
                  data-field="props.title"
                >
                  {config.props.title}
                </h1>
                <p
                  className="text-sm cq-lg:text-base text-gray-400 leading-relaxed"
                  onClick={() => handleFieldClick('props.description')}
                  data-field="props.description"
                >
                  {config.props.description || 'Help us understand your business better.'}
                </p>
              </motion.div>

              {/* Form Fields */}
              <form className="flex w-full flex-col gap-3 cq-lg:gap-4 text-white">

                {/* Row 1: Company Name + Job Title (Side by Side) */}
                <div className="flex flex-col sm:flex-row gap-3 cq-lg:gap-4">
                  {/* Company Name Field */}
                  {config.props.fields.companyName.enabled && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex-1 flex flex-col gap-1 cq-lg:gap-1.5"
                    >
                      <label
                        htmlFor="companyName"
                        className="font-medium text-xs cq-lg:text-sm text-gray-400 block text-left"
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
                        className="h-10 cq-lg:h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                          focus:ring-2 focus:outline-none 
                          transition-all w-full placeholder-gray-500"
                        style={{
                          '--tw-ring-color': `${theme?.primaryColor || '#A855F7'}80`
                        } as React.CSSProperties}
                        onClick={() => handleFieldClick('props.fields.companyName.placeholder')}
                        data-field="props.fields.companyName.placeholder"
                      />
                    </motion.div>
                  )}

                  {/* Job Title Field */}
                  {config.props.fields.jobTitle.enabled && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="flex-1 flex flex-col gap-1 cq-lg:gap-1.5"
                    >
                      <label
                        htmlFor="jobTitle"
                        className="font-medium text-xs cq-lg:text-sm text-gray-400 block text-left"
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
                        className="h-10 cq-lg:h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                          focus:ring-2 focus:outline-none 
                          transition-all w-full placeholder-gray-500"
                        style={{
                          '--tw-ring-color': `${theme?.primaryColor || '#A855F7'}80`
                        } as React.CSSProperties}
                        onClick={() => handleFieldClick('props.fields.jobTitle.placeholder')}
                        data-field="props.fields.jobTitle.placeholder"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Row 2: Company Website (Full Width with Icon) */}
                {config.props.fields.companyWebsite.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full flex flex-col gap-1 cq-lg:gap-1.5"
                  >
                    <label
                      htmlFor="companyWebsite"
                      className="font-medium text-xs cq-lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.companyWebsite.label')}
                      data-field="props.fields.companyWebsite.label"
                    >
                      {config.props.fields.companyWebsite.label}
                      {config.props.fields.companyWebsite.required
                        ? <span className="text-red-500 ml-0.5">*</span>
                        : <span className="text-gray-500 ml-1">(optional)</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <GlobeIcon className="w-4 h-4 cq-lg:w-5 cq-lg:h-5 text-gray-500" />
                      </div>
                      <input
                        id="companyWebsite"
                        name="companyWebsite"
                        required={config.props.fields.companyWebsite.required}
                        type="url"
                        placeholder={config.props.fields.companyWebsite.placeholder}
                        className="h-10 cq-lg:h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white pl-10 cq-lg:pl-11 pr-4 
                          focus:ring-2 focus:outline-none 
                          transition-all w-full placeholder-gray-500"
                        style={{
                          '--tw-ring-color': `${theme?.primaryColor || '#A855F7'}80`
                        } as React.CSSProperties}
                        onClick={() => handleFieldClick('props.fields.companyWebsite.placeholder')}
                        data-field="props.fields.companyWebsite.placeholder"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Row 3: Company Logo (Avatar + Upload Button - Same as AboutYouCard) */}
                {config.props.fields.companyLogo.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="flex flex-col gap-1 cq-lg:gap-1.5 pt-1 cq-lg:pt-2"
                  >
                    <label
                      className="font-medium text-xs cq-lg:text-sm text-gray-400"
                      onClick={() => handleFieldClick('props.fields.companyLogo.label')}
                      data-field="props.fields.companyLogo.label"
                    >
                      {config.props.fields.companyLogo.label}
                      {config.props.fields.companyLogo.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <div className="flex items-center gap-2 cq-lg:gap-3">
                      <Avatar
                        className="w-10 h-10 cq-lg:w-12 cq-lg:h-12 border-2 shadow-sm rounded-lg"
                        style={{ borderColor: `${theme?.primaryColor || '#A855F7'}33` }}
                      >
                        <AvatarImage src="https://ui-avatars.com/api/?name=Company&background=3b82f6&color=fff&size=200" alt="Company Logo" />
                        <AvatarFallback className="rounded-lg">CO</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        aria-label="Upload logo"
                        className="h-9 cq-lg:h-10 px-3 cq-lg:px-4 rounded-lg bg-gray-800 border border-gray-700 
                          text-xs cq-lg:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-600 
                          transition-colors"
                      >
                        Upload logo
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Continue Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-3 cq-lg:mt-5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldClick('props.buttonText');
                      props.onNext();
                    }}
                    className="w-full h-10 cq-lg:h-11 rounded-xl 
                      text-sm cq-lg:text-base font-semibold text-white 
                      shadow-lg transition-all active:scale-[0.98]"
                    style={{
                      backgroundColor: theme?.primaryColor || '#A855F7',
                      boxShadow: `0 10px 15px -3px ${theme?.primaryColor || '#A855F7'}33`
                    }}
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
