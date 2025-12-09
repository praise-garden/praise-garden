"use client";

import React from 'react';
import { ThankYouBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Icons
const TypeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="4 7 4 4 20 4 20 7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const PartyPopperIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5.8 11.3 2 22l10.7-3.79"></path>
    <path d="M4 3h.01"></path>
    <path d="M22 8h.01"></path>
    <path d="M15 2h.01"></path>
    <path d="M22 20h.01"></path>
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
    <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
    <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
    <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
  </svg>
);

interface ThankYouEditPanelProps {
  block: ThankYouBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<ThankYouBlockConfig['props']>) => void;
  focusedField?: { blockId: string; fieldPath: string } | null;
}

const ThankYouEditPanel: React.FC<ThankYouEditPanelProps> = ({ block, onUpdate, focusedField }) => {
  // Refs for auto-focus
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-focus logic
  React.useEffect(() => {
    if (!focusedField || focusedField.blockId !== block.id) return;

    const fieldPath = focusedField.fieldPath;
    let inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (fieldPath === 'props.title') inputRef = titleInputRef;
    else if (fieldPath === 'props.description') inputRef = descriptionInputRef;

    if (inputRef?.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [focusedField, block.id]);

  const handlePropChange = (prop: keyof ThankYouBlockConfig['props'], value: string | boolean) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-500/10 text-green-400 transition-colors group-hover:bg-green-500/20">
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
            placeholder="Thank you for your feedback!"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Description */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
              <MessageSquareIcon />
            </div>
            Description
          </label>
          <Textarea
            ref={descriptionInputRef}
            id="description"
            value={block.props.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="We appreciate you taking the time to share your thoughts..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 min-h-[90px] resize-none leading-relaxed"
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
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">SOCIAL SHARING</span>
        </div>
      </div>

      {/* Social Sharing Section */}
      <div className="space-y-4">
        {/* Show Socials Toggle */}
        <div className="rounded-lg border border-gray-800 p-4 bg-gray-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-sky-500/10 text-sky-400">
                <ShareIcon />
              </div>
              <div>
                <span className="text-sm font-medium text-white">Show Social Sharing</span>
                <p className="text-xs text-gray-500 mt-0.5">Let users share their testimonial on social media</p>
              </div>
            </div>
            <Switch
              id="showSocials"
              checked={block.props.showSocials}
              onCheckedChange={(checked) => handlePropChange('showSocials', checked)}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-700 border border-gray-600"
            />
          </div>
        </div>

        {/* Show Animations Toggle */}
        <div className="rounded-lg border border-gray-800 p-4 bg-gray-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-white">Show Animations</span>
                <p className="text-xs text-gray-500 mt-0.5">Confetti, floating emojis, and celebratory effects</p>
              </div>
            </div>
            <Switch
              id="showAnimations"
              checked={block.props.showAnimations ?? true}
              onCheckedChange={(checked) => handlePropChange('showAnimations', checked)}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-700 border border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <PartyPopperIcon className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">
              Celebrate & Share
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              This is the final page users see after submitting their testimonial. Enable social sharing to encourage them to spread the word!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouEditPanel;
