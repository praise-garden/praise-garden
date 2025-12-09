"use client";

import React from 'react';
import { NegativeFeedbackBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Icons
const TypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="4 7 4 4 20 4 20 7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ButtonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="8" width="18" height="8" rx="2" ry="2"></rect>
    <line x1="12" y1="12" x2="12" y2="12"></line>
  </svg>
);

const HeartHandshakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path>
    <path d="m18 15-2-2"></path>
    <path d="m15 18-2-2"></path>
  </svg>
);

interface NegativeFeedbackEditPanelProps {
  block: NegativeFeedbackBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<NegativeFeedbackBlockConfig['props']>) => void;
  focusedField?: { blockId: string; fieldPath: string } | null;
}

const NegativeFeedbackEditPanel: React.FC<NegativeFeedbackEditPanelProps> = ({ block, onUpdate, focusedField }) => {
  // Refs for auto-focus
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);
  const feedbackQuestionInputRef = React.useRef<HTMLInputElement>(null);
  const feedbackPlaceholderInputRef = React.useRef<HTMLInputElement>(null);
  const feedbackHelperTextInputRef = React.useRef<HTMLInputElement>(null);
  const buttonTextInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus logic
  React.useEffect(() => {
    if (!focusedField || focusedField.blockId !== block.id) return;

    const fieldPath = focusedField.fieldPath;
    let inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (fieldPath === 'props.title') inputRef = titleInputRef;
    else if (fieldPath === 'props.description') inputRef = descriptionInputRef;
    else if (fieldPath === 'props.feedbackQuestion') inputRef = feedbackQuestionInputRef;
    else if (fieldPath === 'props.feedbackPlaceholder') inputRef = feedbackPlaceholderInputRef;
    else if (fieldPath === 'props.feedbackHelperText') inputRef = feedbackHelperTextInputRef;
    else if (fieldPath === 'props.buttonText') inputRef = buttonTextInputRef;

    if (inputRef?.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [focusedField, block.id]);

  const handlePropChange = (prop: keyof NegativeFeedbackBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500/20">
              <TypeIcon />
            </div>
            Title
          </label>
          <Input
            ref={titleInputRef}
            id="title"
            type="text"
            value={block.props.title || ''}
            onChange={(e) => handlePropChange('title', e.target.value)}
            placeholder="What can we do better?"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Description */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
              <MessageSquareIcon />
            </div>
            Description
          </label>
          <Textarea
            ref={descriptionInputRef}
            id="description"
            value={block.props.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="We're sorry to hear that. Please share your feedback..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 min-h-[90px] resize-none leading-relaxed"
            rows={3}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">FEEDBACK FORM TEXT</span>
        </div>
      </div>

      {/* Feedback Form Texts */}
      <div className="space-y-6">
        {/* Feedback Question */}
        <div className="group">
          <label htmlFor="feedbackQuestion" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500/20">
              <TypeIcon />
            </div>
            Feedback Question Label
          </label>
          <Input
            ref={feedbackQuestionInputRef}
            id="feedbackQuestion"
            type="text"
            value={block.props.feedbackQuestion || 'Could you please tell us more?'}
            onChange={(e) => handlePropChange('feedbackQuestion', e.target.value)}
            placeholder="Could you please tell us more?"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Feedback Placeholder */}
        <div className="group">
          <label htmlFor="feedbackPlaceholder" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
              <MessageSquareIcon />
            </div>
            Placeholder Text
          </label>
          <Input
            ref={feedbackPlaceholderInputRef}
            id="feedbackPlaceholder"
            type="text"
            value={block.props.feedbackPlaceholder || 'Please share as much detail as possible...'}
            onChange={(e) => handlePropChange('feedbackPlaceholder', e.target.value)}
            placeholder="Please share as much detail as possible..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Helper Text */}
        <div className="group">
          <label htmlFor="feedbackHelperText" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
              <MessageSquareIcon />
            </div>
            Helper Text
          </label>
          <Input
            ref={feedbackHelperTextInputRef}
            id="feedbackHelperText"
            type="text"
            value={block.props.feedbackHelperText || 'We value your feedback and review every submission carefully.'}
            onChange={(e) => handlePropChange('feedbackHelperText', e.target.value)}
            placeholder="We value your feedback..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 h-11"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">BUTTON</span>
        </div>
      </div>

      {/* Button Section */}
      <div className="space-y-6">
        {/* Button Text */}
        <div className="group">
          <label htmlFor="buttonText" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-rose-500/10 text-rose-400 transition-colors group-hover:bg-rose-500/20">
              <ButtonIcon />
            </div>
            Button Text
          </label>
          <Input
            ref={buttonTextInputRef}
            id="buttonText"
            type="text"
            value={block.props.buttonText || ''}
            onChange={(e) => handlePropChange('buttonText', e.target.value)}
            placeholder="Continue"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 h-11"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <HeartHandshakeIcon className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">
              Feedback Matters
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This page appears when users rate below a certain threshold. Use it to collect constructive feedback while showing empathy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegativeFeedbackEditPanel;
