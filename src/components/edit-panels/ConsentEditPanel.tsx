"use client";

import React from 'react';
import { ConsentBlockConfig } from '@/types/form-config';
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

const CheckSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
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

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

interface ConsentEditPanelProps {
  block: ConsentBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<ConsentBlockConfig['props']>) => void;
  focusedField?: { blockId: string; fieldPath: string } | null;
}

const ConsentEditPanel: React.FC<ConsentEditPanelProps> = ({ block, onUpdate, focusedField }) => {
  // Refs for auto-focus
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);
  const checkboxLabelInputRef = React.useRef<HTMLInputElement>(null);
  const buttonTextInputRef = React.useRef<HTMLInputElement>(null);
  const trustNoteInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus logic
  React.useEffect(() => {
    if (!focusedField || focusedField.blockId !== block.id) return;

    const fieldPath = focusedField.fieldPath;
    let inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (fieldPath === 'props.title') inputRef = titleInputRef;
    else if (fieldPath === 'props.description') inputRef = descriptionInputRef;
    else if (fieldPath === 'props.checkboxLabel') inputRef = checkboxLabelInputRef;
    else if (fieldPath === 'props.buttonText') inputRef = buttonTextInputRef;
    else if (fieldPath === 'props.trustNote') inputRef = trustNoteInputRef;

    if (inputRef?.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [focusedField, block.id]);

  const handlePropChange = (prop: keyof ConsentBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
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
            placeholder="Can we use your testimonial?"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Description */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
              <MessageSquareIcon />
            </div>
            Description
          </label>
          <Textarea
            ref={descriptionInputRef}
            id="description"
            value={block.props.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="We would love to share your feedback..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[90px] resize-none leading-relaxed"
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
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">CONSENT CHECKBOX</span>
        </div>
      </div>

      {/* Checkbox Section */}
      <div className="space-y-6">
        {/* Checkbox Label */}
        <div className="group">
          <label htmlFor="checkboxLabel" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
              <CheckSquareIcon />
            </div>
            Checkbox Label
          </label>
          <Input
            ref={checkboxLabelInputRef}
            id="checkboxLabel"
            type="text"
            value={block.props.checkboxLabel || ''}
            onChange={(e) => handlePropChange('checkboxLabel', e.target.value)}
            placeholder="I consent to my testimonial being used publicly."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">BUTTON & TRUST</span>
        </div>
      </div>

      {/* Button and Trust Section */}
      <div className="space-y-6">
        {/* Button Text */}
        <div className="group">
          <label htmlFor="buttonText" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-fuchsia-500/10 text-fuchsia-400 transition-colors group-hover:bg-fuchsia-500/20">
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
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Trust Note */}
        <div className="group">
          <label htmlFor="trustNote" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
              <ShieldIcon />
            </div>
            Trust Note
          </label>
          <Input
            ref={trustNoteInputRef}
            id="trustNote"
            type="text"
            value={block.props.trustNote || "Your privacy is important to us. We'll always respect your choice."}
            onChange={(e) => handlePropChange('trustNote', e.target.value)}
            placeholder="Your privacy is important to us..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <ShieldIcon className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">
              Consent is Key
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This page ensures users explicitly agree to share their testimonial publicly. It builds trust and complies with privacy best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentEditPanel;
