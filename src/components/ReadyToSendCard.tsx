import React from 'react';
import Image from 'next/image';
import { PageItem, FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import AppBar from '@/components/ui/app-bar';

interface ReadyToSendCardProps extends FormCardProps {}

const ReadyToSendCard: React.FC<ReadyToSendCardProps> = (props) => {
  return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto">
        <AppBar onBack={props.onPrevious} />
        <div className="mx-auto flex w-full max-w-3xl flex-col items-stretch px-6 sm:px-16 pb-8 pt-8 sm:pb-20">
          <h1 className="text-xl sm:text-2xl font-bold leading-normal text-white">Ready to send?</h1>
          <div className="content text-sm text-gray-400 sm:text-base mt-2">
            <p>Happy with your testimonial? Click submit to send it!</p>
          </div>

          <div className="mb-8 mt-6 flex flex-col gap-4">
            <div className="flex flex-col rounded-xl border border-gray-700 bg-[#1E1E1E] p-4 shadow-sm md:flex-row gap-4">
              <div className="flex-none md:w-56 w-full">
                <div className="mt-1 text-gray-400 text-sm">Introduce yourself and share why you love using our product 💜</div>
              </div>
              <div className="rounded-lg bg-[#2A2A2A] p-3 text-sm text-gray-400 w-full">When your customer fills out this question, they will see their answer here.</div>
            </div>
            <div className="flex flex-col rounded-xl border border-gray-700 bg-[#1E1E1E] p-4 shadow-sm md:flex-row gap-4">
              <div className="flex-none md:w-56 w-full">
                <div className="mt-1 text-gray-400 text-sm">What was it like getting started with Senja?</div>
              </div>
              <div className="rounded-lg bg-[#2A2A2A] p-3 text-sm text-gray-400 w-full">When your customer fills out this question, they will see their answer here.</div>
            </div>
          </div>

          <div>
            <button className="w-full block rounded-[16px] border border-white/20 p-1 shadow-lg duration-200 hover:scale-[1.02] hover:shadow-purple-600/20 active:scale-[.98]">
              <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-b from-purple-600 to-purple-500 px-6 py-3 text-sm sm:px-8 sm:text-base text-white">
                <div className="relative flex items-center justify-center w-full">
                  <span className="pointer-events-auto font-medium tracking-wide">Submit</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default ReadyToSendCard;
