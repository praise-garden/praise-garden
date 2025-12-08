"use client";

import React from 'react';
import { RatingBlockConfig } from '@/types/form-config';
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

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

interface RatingEditPanelProps {
  block: RatingBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<RatingBlockConfig['props']>) => void;
}

const RatingEditPanel: React.FC<RatingEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof RatingBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Page Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-yellow-500/10 text-yellow-400 transition-colors group-hover:bg-yellow-500/20">
              <StarIcon />
            </div>
            Rating Question
          </label>
          <Input
            id="title"
            type="text"
            value={block.props.title || ''}
            onChange={(e) => handlePropChange('title', e.target.value)}
            placeholder="How would you rate your experience?"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Description */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
              <MessageSquareIcon />
            </div>
            Supporting Text
          </label>
          <Textarea
            id="description"
            value={block.props.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="Your feedback helps us improve our service"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[90px] resize-none leading-relaxed"
            rows={3}
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

      {/* Info Card */}
      <div className="mt-2 relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <StarIcon className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">
              Star Rating
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Users will rate their experience using a 5-star scale with interactive feedback labels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingEditPanel;
