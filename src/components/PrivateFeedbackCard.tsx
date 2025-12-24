import React from 'react';
import Image from 'next/image';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import ContentContainer from '@/components/ui/content-container';
import AppBar from '@/components/ui/app-bar';
import BackButton from '@/components/ui/back-button';
import { PrivateFeedbackBlockConfig } from '@/types/form-config';


interface PrivateFeedbackCardProps extends FormCardProps {
  config: PrivateFeedbackBlockConfig;
  onFieldFocus: (blockId: string, fieldPath: string) => void;
}

const PrivateFeedbackCard: React.FC<PrivateFeedbackCardProps> = ({ config, onFieldFocus, theme, ...props }) => {

  const handleFieldClick = (fieldPath: string) => {
    onFieldFocus(config.id, fieldPath);
  };

  return (
    <FormCard {...props} theme={theme}>
      <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto relative">
        {props.onPrevious && <BackButton onClick={props.onPrevious} />}
        <AppBar logoUrl={theme?.logoUrl} />
        <ContentContainer className="pb-10 pt-10">
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
            onClickCapture={() => handleFieldClick('props.description')}
            data-field="props.description"
          >
            <p>{config.props.description || "This stays between us and helps us improve. It will never appear on your public testimonial."}</p>
          </div>
          <form className="mt-6 flex flex-col gap-4">
            <textarea
              name="testimonial"
              id="testimonial-input"
              className="mt-3 w-full rounded-xl border-transparent bg-[#1E1E1E] border border-gray-700 p-4 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={config.props.placeholder}
              rows={4}
              onClick={() => handleFieldClick('props.placeholder')}
              data-field="props.placeholder"
            ></textarea>
            <button
              className="w-full block rounded-xl border border-white/20 p-1 shadow-lg duration-200 hover:scale-[1.02] hover:shadow-purple-600/20 active:scale-[.98]"
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
          </form>
        </ContentContainer>
      </div>
    </FormCard>
  );
};

export default PrivateFeedbackCard;
