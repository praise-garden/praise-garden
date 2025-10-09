import React from 'react';
import Image from 'next/image';
import { PageItem, FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';


interface PrivateFeedbackCardProps extends FormCardProps {}

const PrivateFeedbackCard: React.FC<PrivateFeedbackCardProps> = (props) => {
  return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto">
        <AppBar onBack={props.onPrevious} />
        <ContentContainer className="pb-8 pt-8 sm:pb-20">
          <h1 className="text-xl sm:text-2xl font-bold leading-normal text-white">Share private feedback with our team</h1>
          <div className="content text-sm text-gray-400 sm:text-base mt-2">
            <p>This stays between us and helps us improve. It will never appear on your public testimonial.

</p>
          </div>
          <form className="mt-6 flex flex-col gap-4">
            <textarea
              name="testimonial"
              id="testimonial-input"
              className="mt-4 w-full rounded-[16px] border-transparent bg-[#1E1E1E] border border-gray-700 p-6 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Write your feedback..."
              rows={5}
            ></textarea>
            <button className="w-full block rounded-[16px] border border-white/20 p-1 shadow-lg duration-200 hover:scale-[1.02] hover:shadow-purple-600/20 active:scale-[.98]">
              <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-b from-purple-600 to-purple-500 px-6 py-3 text-sm sm:px-8 sm:text-base text-white">
                <div className="relative flex items-center justify-center w-full">
                  <span className="pointer-events-auto font-medium tracking-wide">Continue</span>
                </div>
              </div>
            </button>
          </form>
        </ContentContainer>
      </div>
    </FormCard>
  );
};

export default PrivateFeedbackCard;
