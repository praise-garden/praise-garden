import React from 'react';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AboutCompanyBlockConfig } from '@/types/form-config';

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
      <div className="flex-grow flex flex-col overflow-hidden relative">
        {props.onPrevious && <BackButton onClick={props.onPrevious} />}
        <div className="flex-shrink-0">
          <AppBar maxWidthClass="max-w-2xl" paddingXClass="px-8 sm:px-14" logoUrl={theme?.logoUrl} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full scrollbar-hide">
          <div className="w-full px-8 sm:px-14 pb-8 pt-4">
            <div className="mx-auto flex w-full max-w-xl flex-col items-stretch">
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
                  <p>{config.props.description || 'Help us understand your business better.'}</p>
                </div>
              </motion.div>

              <form className="flex w-full flex-col gap-4 text-white">
                {/* Job Title Field */}
                {config.props.fields.jobTitle.enabled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full flex flex-col gap-2"
                  >
                    <label
                      htmlFor="jobTitle"
                      className="font-medium text-xs text-gray-400 mb-1 block text-left"
                      onClick={() => handleFieldClick('props.fields.jobTitle.label')}
                      data-field="props.fields.jobTitle.label"
                    >
                      {config.props.fields.jobTitle.label} {config.props.fields.jobTitle.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      required={config.props.fields.jobTitle.required}
                      type="text"
                      placeholder={config.props.fields.jobTitle.placeholder}
                      className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
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
                    className="w-full flex flex-col gap-2"
                  >
                    <label
                      htmlFor="companyName"
                      className="font-medium text-xs text-gray-400 mb-1 block text-left"
                      onClick={() => handleFieldClick('props.fields.companyName.label')}
                      data-field="props.fields.companyName.label"
                    >
                      {config.props.fields.companyName.label} {config.props.fields.companyName.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      required={config.props.fields.companyName.required}
                      type="text"
                      placeholder={config.props.fields.companyName.placeholder}
                      className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
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
                    className="w-full flex flex-col gap-2"
                  >
                    <label
                      htmlFor="role"
                      className="font-medium text-xs text-gray-400 mb-1 block text-left"
                      onClick={() => handleFieldClick('props.fields.role.label')}
                      data-field="props.fields.role.label"
                    >
                      {config.props.fields.role.label} {config.props.fields.role.required ? <span className="text-red-500">*</span> : <span className="text-gray-500">(optional)</span>}
                    </label>
                    <input
                      id="role"
                      name="role"
                      required={config.props.fields.role.required}
                      type="text"
                      placeholder={config.props.fields.role.placeholder}
                      className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                      onClick={() => handleFieldClick('props.fields.role.placeholder')}
                      data-field="props.fields.role.placeholder"
                    />
                  </motion.div>
                )}

                {/* Company Logo Section */}
                {config.props.fields.companyLogo.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="flex flex-col gap-2 pt-2"
                  >
                    <label
                      className="text-xs font-medium text-gray-400"
                      onClick={() => handleFieldClick('props.fields.companyLogo.label')}
                      data-field="props.fields.companyLogo.label"
                    >
                      {config.props.fields.companyLogo.label} {config.props.fields.companyLogo.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-blue-400/20 shadow-sm rounded-lg">
                        <AvatarImage src="https://ui-avatars.com/api/?name=Company&background=3b82f6&color=fff&size=200" alt="Company Logo" />
                        <AvatarFallback className="rounded-lg">CO</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        aria-label="Upload logo"
                        className="rounded-md bg-[#282828] border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
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
      </div>
    </FormCard>
  );
};

export default AboutCompanyCard;
