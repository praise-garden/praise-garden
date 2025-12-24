import React from 'react';
import Image from 'next/image';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AboutYouBlockConfig } from '@/types/form-config';

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
      <div className="flex-grow flex flex-col items-center justify-start overflow-y-auto relative">
        {props.onPrevious && <BackButton onClick={props.onPrevious} />}
        <AppBar maxWidthClass="max-w-2xl" paddingXClass="px-8 sm:px-14" logoUrl={theme?.logoUrl} />
        <div className="w-full px-8 sm:px-14 pb-8 pt-8 sm:pt-10">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-xl sm:text-2xl font-bold leading-normal text-white mb-2"
                style={{ color: config.props.titleColor }}
                onClick={() => handleFieldClick('props.title')}
                data-field="props.title"
              >
                {config.props.title}
              </h1>
              <div
                className="content text-xs text-gray-400 sm:text-sm mb-5 leading-relaxed"
                onClickCapture={() => handleFieldClick('props.description')}
                data-field="props.description"
              >
                <p>{config.props.description || 'Share a little more about yourself.'}</p>
              </div>
            </motion.div>

            <form className="flex w-full flex-col gap-4 text-white">
              {/* Form Fields Section */}
              {config.props.fields.name.enabled && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full flex flex-col gap-2"
                >
                  <label
                    htmlFor="name"
                    className="font-medium text-xs text-gray-400 mb-1 block text-left"
                    onClick={() => handleFieldClick('props.fields.name.label')}
                    data-field="props.fields.name.label"
                  >
                    {config.props.fields.name.label} {config.props.fields.name.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    type="text"
                    placeholder={config.props.fields.name.placeholder}
                    className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                    onClick={() => handleFieldClick('props.fields.name.placeholder')}
                    data-field="props.fields.name.placeholder"
                  />
                </motion.div>
              )}

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {config.props.fields.title.enabled && (
                  <div>
                    <label
                      htmlFor="title"
                      className="font-medium text-xs text-gray-400 mb-1 block"
                      onClick={() => handleFieldClick('props.fields.title.label')}
                      data-field="props.fields.title.label"
                    >
                      {config.props.fields.title.label} {config.props.fields.title.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id="title"
                      name="title"
                      required
                      type="text"
                      placeholder={config.props.fields.title.placeholder}
                      className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                      onClick={() => handleFieldClick('props.fields.title.placeholder')}
                      data-field="props.fields.title.placeholder"
                    />
                  </div>
                )}
                {config.props.fields.company.enabled && (
                  <div>
                    <label
                      htmlFor="company"
                      className="font-medium text-xs text-gray-400 mb-1 block"
                      onClick={() => handleFieldClick('props.fields.company.label')}
                      data-field="props.fields.company.label"
                    >
                      {config.props.fields.company.label} {config.props.fields.company.required ? <span className="text-red-500">*</span> : <span className="text-gray-500">(optional)</span>}
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder={config.props.fields.company.placeholder}
                      className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                      onClick={() => handleFieldClick('props.fields.company.placeholder')}
                      data-field="props.fields.company.placeholder"
                    />
                  </div>
                )}
              </motion.div>

              {/* Photo Section */}
              {config.props.fields.avatar.enabled && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col gap-2 pt-2"
                >
                  <label
                    className="text-xs font-medium text-gray-400"
                    onClick={() => handleFieldClick('props.fields.avatar.label')}
                    data-field="props.fields.avatar.label"
                  >
                    {config.props.fields.avatar.label} {config.props.fields.avatar.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-purple-400/20 shadow-sm">
                      <AvatarImage src="https://ui-avatars.com/api/Tony+Stark/200/dcfce7/166534/2/0.34" alt="Profile" />
                      <AvatarFallback>TS</AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      aria-label="Pick an image"
                      className="rounded-md bg-[#282828] border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Pick an image
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-3"
              >
                <button
                  type="button"
                  onClick={props.onNext}
                  className="w-full block rounded-lg border border-white/10 p-0.5 shadow-md duration-200 bg-purple-600 hover:bg-purple-700 active:scale-[.98]"
                  onClickCapture={() => handleFieldClick('props.buttonText')}
                  data-field="props.buttonText"
                >
                  <div className="relative overflow-hidden rounded-md px-6 py-2 text-sm text-white">
                    <div className="relative flex items-center justify-center w-full">
                      <span className="pointer-events-auto font-semibold tracking-wide">{config.props.buttonText}</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default AboutYouCard;
