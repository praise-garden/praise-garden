import React from 'react';
import Image from 'next/image';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AboutYouBlockConfig } from '@/types/form-config';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface AboutYouCardProps extends Omit<FormCardProps, 'config' | 'onFieldFocus'> {
  config: AboutYouBlockConfig;
  onFieldFocus: (blockId: string, fieldPath: string) => void;
}

const AboutYouCard: React.FC<AboutYouCardProps> = ({ config, onFieldFocus, theme, ...props }) => {

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
            maxWidthClass="max-w-xl cq-lg:max-w-2xl"
            paddingXClass="px-6 sm:px-8 cq-lg:px-12"
            logoUrl={theme?.logoUrl}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full scrollbar-hide">
          <div className="w-full px-6 sm:px-8 cq-lg:px-12 pb-6 cq-lg:pb-10 pt-2 cq-lg:pt-4">
            <div className="mx-auto flex w-full max-w-xl cq-lg:max-w-2xl flex-col items-stretch">

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
                  {config.props.description || 'Share a little more about yourself.'}
                </p>
              </motion.div>

              {/* 
                Form Fields
                STANDARD INPUT HEIGHT: h-11 (44px)
                STANDARD INPUT TEXT: text-base sm:text-sm (16px on mobile prevents iOS zoom)
                STANDARD LABEL: text-xs lg:text-sm
                Gap between fields: gap-4 lg:gap-5
              */}
              <form className="flex w-full flex-col gap-3 cq-lg:gap-4 text-white">

                {/* Name Field */}
                {config.props.fields.name.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full flex flex-col gap-1 cq-lg:gap-1.5"
                  >
                    <label
                      htmlFor="name"
                      className="font-medium text-xs cq-lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.name.label')}
                      data-field="props.fields.name.label"
                    >
                      {config.props.fields.name.label}
                      {config.props.fields.name.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      placeholder={config.props.fields.name.placeholder}
                      className="h-10 cq-lg:h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                        focus:ring-2 focus:outline-none 
                        transition-all w-full placeholder-gray-500"
                      style={{
                        '--tw-ring-color': `${theme?.primaryColor || '#A855F7'}80`
                      } as React.CSSProperties}
                      onClick={() => handleFieldClick('props.fields.name.placeholder')}
                      data-field="props.fields.name.placeholder"
                    />
                  </motion.div>
                )}

                {/* Email Field */}
                {config.props.fields.email.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="w-full flex flex-col gap-1 cq-lg:gap-1.5"
                  >
                    <label
                      htmlFor="email"
                      className="font-medium text-xs cq-lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.email.label')}
                      data-field="props.fields.email.label"
                    >
                      {config.props.fields.email.label}
                      {config.props.fields.email.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <input
                      id="email"
                      name="email"
                      required={config.props.fields.email.required}
                      type="email"
                      placeholder={config.props.fields.email.placeholder}
                      className="h-10 cq-lg:h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                        focus:ring-2 focus:outline-none 
                        transition-all w-full placeholder-gray-500"
                      style={{
                        '--tw-ring-color': `${theme?.primaryColor || '#A855F7'}80`
                      } as React.CSSProperties}
                      onClick={() => handleFieldClick('props.fields.email.placeholder')}
                      data-field="props.fields.email.placeholder"
                    />
                  </motion.div>
                )}

                {/* Company Field */}
                {config.props.fields.company.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full flex flex-col gap-1 cq-lg:gap-1.5"
                  >
                    <label
                      htmlFor="company"
                      className="font-medium text-xs cq-lg:text-sm text-gray-400 block text-left"
                      onClick={() => handleFieldClick('props.fields.company.label')}
                      data-field="props.fields.company.label"
                    >
                      {config.props.fields.company.label}
                      {config.props.fields.company.required
                        ? <span className="text-red-500 ml-0.5">*</span>
                        : <span className="text-gray-500 ml-1">(optional)</span>}
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder={config.props.fields.company.placeholder}
                      className="h-10 cq-lg:h-11 bg-gray-900 rounded-lg border border-gray-700 text-base sm:text-sm text-white px-4 
                        focus:ring-2 focus:outline-none 
                        transition-all w-full placeholder-gray-500"
                      style={{
                        '--tw-ring-color': `${theme?.primaryColor || '#A855F7'}80`
                      } as React.CSSProperties}
                      onClick={() => handleFieldClick('props.fields.company.placeholder')}
                      data-field="props.fields.company.placeholder"
                    />
                  </motion.div>
                )}

                {/* 
                  Avatar/Photo Section
                  RESPONSIVE AVATAR: w-12 h-12 → lg:w-14 lg:h-14
                  RESPONSIVE BUTTON: h-10 (secondary button height)
                */}
                {config.props.fields.avatar.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col gap-1 cq-lg:gap-1.5 pt-1 cq-lg:pt-2"
                  >
                    <label
                      className="font-medium text-xs cq-lg:text-sm text-gray-400"
                      onClick={() => handleFieldClick('props.fields.avatar.label')}
                      data-field="props.fields.avatar.label"
                    >
                      {config.props.fields.avatar.label}
                      {config.props.fields.avatar.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <div className="flex items-center gap-2 cq-lg:gap-3">
                      <Avatar
                        className="w-10 h-10 cq-lg:w-12 cq-lg:h-12 border-2 shadow-sm"
                        style={{ borderColor: `${theme?.primaryColor || '#A855F7'}33` }}
                      >
                        <AvatarImage src="https://ui-avatars.com/api/Tony+Stark/200/dcfce7/166534/2/0.34" alt="Profile" />
                        <AvatarFallback>TS</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        aria-label="Pick an image"
                        className="h-9 cq-lg:h-10 px-3 cq-lg:px-4 rounded-lg bg-gray-800 border border-gray-700 
                          text-xs cq-lg:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-600 
                          transition-colors"
                      >
                        Pick an image
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
                  transition={{ duration: 0.5, delay: 0.4 }}
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

export default AboutYouCard;

