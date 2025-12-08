"use client";

import React from 'react';
import { WelcomeBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

interface WelcomeEditPanelProps {
  block: WelcomeBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<WelcomeBlockConfig['props']>) => void;
}

const WelcomeEditPanel: React.FC<WelcomeEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof WelcomeBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Page Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
              <TypeIcon />
            </div>
            Page Title
          </label>
          <Input
            id="title"
            type="text"
            value={block.props.title || ''}
            onChange={(e) => handlePropChange('title', e.target.value)}
            placeholder="Leave us a testimonial"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
         
        </div>

        {/* Subtitle */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
              <MessageSquareIcon />
            </div>
            Subtitle
          </label>
          <Textarea
            id="description"
            value={block.props.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="Testimonials help me grow my business. They're the best way of helping me out if you read and enjoy my work."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[110px] resize-none leading-relaxed"
            rows={4}
          />
          
        </div>

        {/* Call to Action */}
        <div className="group">
          <label htmlFor="buttonText" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-500/10 text-green-400 transition-colors group-hover:bg-green-500/20">
              <SparklesIcon />
            </div>
            Button Text
          </label>
          <Input
            id="buttonText"
            type="text"
            value={block.props.buttonText || ''}
            onChange={(e) => handlePropChange('buttonText', e.target.value)}
            placeholder="Continue"
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
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">ADDITIONAL MESSAGES</span>
        </div>
      </div>

      {/* Additional Messages Section */}
      <div className="space-y-6">
        {/* Timing Message */}
        <div className="group">
          <label htmlFor="timingMessage" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500/20">
              <ClockIcon />
            </div>
            Time Estimate
          </label>
          <Input
            id="timingMessage"
            type="text"
            value={block.props.timingMessage ?? 'Takes less than 3 minutes'}
            onChange={(e) => handlePropChange('timingMessage', e.target.value)}
            placeholder="Takes less than 3 minutes"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
          
        </div>

        {/* Consent Message */}
        <div className="group">
          <label htmlFor="consentMessage" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20">
              <ShieldCheckIcon />
            </div>
            Privacy Reassurance
          </label>
          <Textarea
            id="consentMessage"
            value={block.props.consentMessage ?? "You control what's shared"}
            onChange={(e) => handlePropChange('consentMessage', e.target.value)}
            placeholder="You control what's shared"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[70px] resize-none leading-relaxed"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">
            Builds trust about data control
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default WelcomeEditPanel;
