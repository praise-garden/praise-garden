import React from 'react';
import Image from 'next/image';
import { PageItem, FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';

interface AboutCompanyCardProps extends FormCardProps {}

const AboutCompanyCard: React.FC<AboutCompanyCardProps> = (props) => {
  return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col items-center justify-center p-10 text-center overflow-y-auto">
        <div className="flex justify-center items-center mb-4 flex-none">
          <Image src="/icon.png" alt="PraiseGarden Logo" width={28} height={28} className="mr-2" />
          <span className="text-white text-2xl font-bold">PraiseGarden</span>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col items-stretch px-4 sm:px-12">
          <h1 className="text-xl sm:text-2xl font-bold leading-normal text-white">About your company</h1>
          <div className="content text-sm text-gray-400 sm:text-base mt-2">
            <p>Share a little more about your company.</p>
          </div>

          <form className="flex w-full flex-col gap-4 text-white mt-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="headline" className="font-medium text-sm text-gray-300">
                  Job title <span className="text-red-500 pr-0.5">*</span>
                </label>
                <input 
                  name="headline" 
                  required 
                  type="text" 
                  className="bg-[#1E1E1E] rounded-lg border border-gray-700 text-white text-sm px-3 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none" 
                  placeholder="Head of Investigations" 
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="company" className="font-medium text-sm text-gray-300">
                  Company <span className="text-red-500 pr-0.5">*</span>
                </label>
                <input 
                  name="company" 
                  required 
                  type="text" 
                  className="bg-[#1E1E1E] rounded-lg border border-gray-700 text-white text-sm px-3 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none" 
                  placeholder="Baker street detectives" 
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-2">
              <label htmlFor="website" className="font-medium text-sm text-gray-300">
                Website
              </label>
              <input 
                name="website" 
                type="text" 
                className="bg-[#1E1E1E] rounded-lg border border-gray-700 text-white text-sm px-3 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none" 
                placeholder="https://bakerstreet.com" 
                spellCheck="false"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex w-full justify-between gap-2">
                <label htmlFor="companyLogo" className="text-sm font-medium text-gray-300">
                  Company Logo
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="company-logo" tabIndex={0} className="cursor-pointer">
                  <span className="sr-only" aria-label="required">not-required</span>
                  <div className="relative flex items-center gap-2">
                    <div slot="image">
                      <img 
                        src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" 
                        alt="" 
                        className="h-14 w-14 rounded-md object-cover"
                      />
                    </div>
                    <button 
                      type="button" 
                      className="rounded-lg bg-[#1E1E1E] border border-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#2A2A2A]"
                    >
                      Pick an image
                    </button>
                    <input 
                      tabIndex={-1} 
                      name="companyLogo" 
                      className="absolute left-0 top-3" 
                      style={{width: '0px', height: '0px', border: 'none', pointerEvents: 'none', opacity: 0}}
                    />
                    <input 
                      type="file" 
                      multiple 
                      accept="image/png,image/jpg,image/gif,image/jpeg,image/webp" 
                      autoComplete="off" 
                      style={{display: 'none'}}
                    />
                  </div>
                </label>
                <div className="ml-2 text-gray-400"></div>
              </div>
            </div>

            <div>
              <button className="w-full block rounded-[16px] border border-white/20 p-1 shadow-lg duration-200 hover:scale-[1.02] hover:shadow-purple-600/20 active:scale-[.98]">
                <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-b from-purple-600 to-purple-500 px-6 py-3 text-sm sm:px-8 sm:text-base text-white">
                  <div className="relative flex items-center justify-center w-full">
                    <span className="pointer-events-auto font-medium tracking-wide">Continue</span>
                  </div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </FormCard>
  );
};

export default AboutCompanyCard;
