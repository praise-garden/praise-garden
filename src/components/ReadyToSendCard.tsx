import React from 'react';
import Image from 'next/image';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import AppBar from '@/components/ui/app-bar';
import { ReadyToSendBlockConfig } from '@/types/form-config';

interface ReadyToSendCardProps extends FormCardProps {
    config: ReadyToSendBlockConfig;
    onFieldFocus?: (blockId: string, fieldPath: string) => void;
}

const ReadyToSendCard: React.FC<ReadyToSendCardProps> = ({ config, onFieldFocus, ...props }) => {
    
    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus?.(config.id, fieldPath);
    };

    return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto">
        <AppBar onBack={props.onPrevious} />
        <div className="mx-auto flex w-full max-w-3xl flex-col items-stretch px-8 sm:px-16 pb-10 pt-10">
          <h1 
            className="text-lg sm:text-xl font-bold leading-normal text-white"
            style={{ color: config.props.titleColor }}
            onClick={() => handleFieldClick('props.title')}
            data-field="props.title"
          >
              {config.props.title}
          </h1>
          <div 
            className="content text-xs text-gray-400 sm:text-sm mt-2 leading-relaxed"
            style={{ color: config.props.descriptionColor }}
            onClick={() => handleFieldClick('props.description')}
            data-field="props.description"
          >
            <p>{config.props.description}</p>
          </div>

          <div className="mb-6 mt-5 flex flex-col gap-3">
            <div className="flex flex-col rounded-lg border border-gray-700 bg-[#1E1E1E] p-3.5 shadow-sm md:flex-row gap-3.5">
              <div className="flex-none md:w-52 w-full">
                <div className="mt-0.5 text-gray-400 text-xs">Introduce yourself and share why you love using our product 💜</div>
              </div>
              <div className="rounded-md bg-[#2A2A2A] p-2.5 text-xs text-gray-400 w-full">When your customer fills out this question, they will see their answer here.</div>
            </div>
            <div className="flex flex-col rounded-lg border border-gray-700 bg-[#1E1E1E] p-3.5 shadow-sm md:flex-row gap-3.5">
              <div className="flex-none md:w-52 w-full">
                <div className="mt-0.5 text-gray-400 text-xs">What was it like getting started with Senja?</div>
              </div>
              <div className="rounded-md bg-[#2A2A2A] p-2.5 text-xs text-gray-400 w-full">When your customer fills out this question, they will see their answer here.</div>
            </div>
          </div>

          <div>
            <button 
                className="w-full block rounded-xl border border-white/20 p-0.5 shadow-lg duration-200 hover:scale-[1.02] hover:shadow-purple-600/20 active:scale-[.98]"
                onClick={props.onNext}
                onClickCapture={() => handleFieldClick('props.buttonText')}
                data-field="props.buttonText"
            >
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-purple-600 to-purple-500 px-6 py-2.5 text-sm text-white">
                <div className="relative flex items-center justify-center w-full">
                  <span className="pointer-events-auto font-semibold tracking-wide">{config.props.buttonText}</span>
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
