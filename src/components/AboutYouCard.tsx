import React from 'react';
import Image from 'next/image';
import { PageItem, FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import { motion } from 'framer-motion';
import AppBar from '@/components/ui/app-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AboutYouCardProps extends FormCardProps {}

const AboutYouCard: React.FC<AboutYouCardProps> = (props) => {
  return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col items-center justify-start overflow-y-auto">
        <AppBar onBack={props.onPrevious} maxWidthClass="max-w-2xl" paddingXClass="px-6 sm:px-12" />
        <div className="w-full px-6 sm:px-12 pb-8 pt-10 sm:pt-12">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold leading-normal text-white mb-2">About you</h1>
                  <div className="content text-sm text-gray-400 sm:text-base mb-6">
                    <p>Share a little more about yourself.</p>
                  </div>
                </motion.div>
    
                <form className="flex w-full flex-col gap-4 text-white">
                  {/* Form Fields Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full flex flex-col gap-2"
                  >
                    <label htmlFor="name" className="font-medium text-xs text-gray-400 mb-1 block text-left">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      placeholder="e.g. Tony Stark"
                      className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                    />
                  </motion.div>
                  
                  <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                  >
                      <div>
                          <label htmlFor="title" className="font-medium text-xs text-gray-400 mb-1 block">
                              Your title <span className="text-red-500">*</span>
                          </label>
                          <input
                              id="title"
                              name="title"
                              required
                              type="text"
                              placeholder="e.g. CEO"
                              className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                          />
                      </div>
                      <div>
                          <label htmlFor="company" className="font-medium text-xs text-gray-400 mb-1 block">
                              Company (optional)
                          </label>
                          <input
                              id="company"
                              name="company"
                              type="text"
                              placeholder="e.g. Stark Industries"
                              className="bg-[#1E1E1E] rounded-md border border-gray-700 text-white text-sm px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none transition-all w-full"
                          />
                      </div>
                  </motion.div>
    
                  {/* Photo Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col gap-2 pt-2"
                  >
                    <label className="text-xs font-medium text-gray-400">Your photo</label>
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
    
                  {/* Continue Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-4"
                  >
                    <button
                      type="button"
                      onClick={props.onNext}
                      className="w-full block rounded-lg border border-white/10 p-1 shadow-md duration-200 bg-purple-600 hover:bg-purple-700 active:scale-[.98]"
                    >
                      <div className="relative overflow-hidden rounded-md px-6 py-2.5 text-sm text-white">
                        <div className="relative flex items-center justify-center w-full">
                          <span className="pointer-events-auto font-medium tracking-wide">Continue</span>
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
