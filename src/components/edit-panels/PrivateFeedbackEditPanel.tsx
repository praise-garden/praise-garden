"use client";

import React from 'react';
import { PrivateFeedbackBlockConfig } from '@/types/form-config';
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

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const PenIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
  </svg>
);

interface PrivateFeedbackEditPanelProps {
  block: PrivateFeedbackBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<PrivateFeedbackBlockConfig['props']>) => void;
  focusedField?: { blockId: string; fieldPath: string } | null;
}

const PrivateFeedbackEditPanel: React.FC<PrivateFeedbackEditPanelProps> = ({ block, onUpdate, focusedField }) => {
  // Refs for auto-focus
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);
  const placeholderInputRef = React.useRef<HTMLInputElement>(null);
  const buttonTextInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus logic
  React.useEffect(() => {
    if (!focusedField || focusedField.blockId !== block.id) return;

    const fieldPath = focusedField.fieldPath;
    let inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (fieldPath === 'props.title') inputRef = titleInputRef;
    else if (fieldPath === 'props.description') inputRef = descriptionInputRef;
    else if (fieldPath === 'props.placeholder') inputRef = placeholderInputRef;
    else if (fieldPath === 'props.buttonText') inputRef = buttonTextInputRef;

    if (inputRef?.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [focusedField, block.id]);

  const handlePropChange = (prop: keyof PrivateFeedbackBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
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
            placeholder="Would you like to send us private feedback?"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Description */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20">
              <MessageSquareIcon />
            </div>
            Description
          </label>
          <Textarea
            ref={descriptionInputRef}
            id="description"
            value={block.props.description || 'This stays between us and helps us improve.'}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="This stays between us and helps us improve..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[90px] resize-none leading-relaxed"
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
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">FEEDBACK INPUT</span>
        </div>
      </div>

      {/* Feedback Input Section */}
      <div className="space-y-6">
        {/* Placeholder */}
        <div className="group">
          <label htmlFor="placeholder" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-sky-500/10 text-sky-400 transition-colors group-hover:bg-sky-500/20">
              <PenIcon />
            </div>
            Placeholder Text
          </label>
          <Input
            ref={placeholderInputRef}
            id="placeholder"
            type="text"
            value={block.props.placeholder || ''}
            onChange={(e) => handlePropChange('placeholder', e.target.value)}
            placeholder="Type your private feedback here..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 h-11"
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
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
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
            placeholder="Send Private Feedback"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 h-11"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <LockIcon className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">
              Private & Confidential
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This page allows users to share feedback privately. Use it to collect honest feedback that won't be published publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateFeedbackEditPanel;
