"use client";

import React from 'react';
import { QuestionBlockConfig } from '@/types/form-config';
import { DEFAULT_TESTIMONIAL_TIPS } from '@/lib/default-form-config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

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

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m22 8-6 4 6 4V8Z"></path>
    <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
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
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface QuestionEditPanelProps {
  block: QuestionBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<QuestionBlockConfig['props']>) => void;
  focusedField?: { blockId: string; fieldPath: string } | null;
}

const QuestionEditPanel: React.FC<QuestionEditPanelProps> = ({ block, onUpdate, focusedField }) => {
  // Refs for inputs to enable auto-focus
  const questionInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);
  const videoTitleInputRef = React.useRef<HTMLInputElement>(null);
  const videoDescInputRef = React.useRef<HTMLInputElement>(null);
  const textTitleInputRef = React.useRef<HTMLInputElement>(null);
  const textDescInputRef = React.useRef<HTMLInputElement>(null);

  // Provide defaults if props don't exist yet
  const enableVideoTestimonial = block.props.enableVideoTestimonial ?? true;
  const enableTextTestimonial = block.props.enableTextTestimonial ?? true;
  const tips = block.props.tips || DEFAULT_TESTIMONIAL_TIPS;

  // Auto-focus logic when focusedField changes
  React.useEffect(() => {
    if (!focusedField || focusedField.blockId !== block.id) return;

    const fieldPath = focusedField.fieldPath;
    let inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (fieldPath === 'props.question') inputRef = questionInputRef;
    else if (fieldPath === 'props.description') inputRef = descriptionInputRef;
    else if (fieldPath === 'props.videoOptionTitle') inputRef = videoTitleInputRef;
    else if (fieldPath === 'props.videoOptionDescription') inputRef = videoDescInputRef;
    else if (fieldPath === 'props.textOptionTitle') inputRef = textTitleInputRef;
    else if (fieldPath === 'props.textOptionDescription') inputRef = textDescInputRef;

    if (inputRef?.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [focusedField, block.id]);

  const handlePropChange = (prop: keyof QuestionBlockConfig['props'], value: string | boolean | string[]) => {
    onUpdate(block.id, { [prop]: value });
  };

  const handleToggleVideo = (checked: boolean) => {
    // Ensure at least one testimonial type is enabled
    if (!checked && !enableTextTestimonial) {
      return; // Can't disable video if text is already disabled
    }
    handlePropChange('enableVideoTestimonial', checked);
  };

  const handleToggleText = (checked: boolean) => {
    // Ensure at least one testimonial type is enabled
    if (!checked && !enableVideoTestimonial) {
      return; // Can't disable text if video is already disabled
    }
    handlePropChange('enableTextTestimonial', checked);
  };

  const handleAddTip = () => {
    handlePropChange('tips', [...tips, '']);
  };

  const handleUpdateTip = (index: number, value: string) => {
    const currentTips = [...tips];
    currentTips[index] = value;
    handlePropChange('tips', currentTips);
  };

  const handleRemoveTip = (index: number) => {
    const currentTips = [...tips];
    currentTips.splice(index, 1);
    handlePropChange('tips', currentTips);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Question */}
        <div className="group">
          <label htmlFor="question" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
              <TypeIcon />
            </div>
            Question
          </label>
          <Input
            ref={questionInputRef}
            id="question"
            type="text"
            value={block.props.question || ''}
            onChange={(e) => handlePropChange('question', e.target.value)}
            placeholder="What made you choose us?"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
          />
        </div>

        {/* Supporting Text */}
        <div className="group">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
              <MessageSquareIcon />
            </div>
            Supporting Text
          </label>
          <Textarea
            ref={descriptionInputRef}
            id="description"
            value={block.props.description || ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="Share your experience with us..."
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
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">TESTIMONIAL TYPE</span>
        </div>
      </div>

      {/* Testimonial Type Toggles */}
      <div className="space-y-4">
        {/* Video Testimonial Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400">
              <VideoIcon />
            </div>
            <div>
              <span className="text-sm font-medium text-white block">Video Testimonial</span>
              <span className="text-xs text-gray-500">Allow users to record video</span>
            </div>
          </label>
          <Switch
            checked={enableVideoTestimonial}
            onCheckedChange={handleToggleVideo}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>

        {/* Text Testimonial Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-lime-500/10 text-lime-400">
              <PenIcon />
            </div>
            <div>
              <span className="text-sm font-medium text-white block">Text Testimonial</span>
              <span className="text-xs text-gray-500">Allow users to write text</span>
            </div>
          </label>
          <Switch
            checked={enableTextTestimonial}
            onCheckedChange={handleToggleText}
            className="data-[state=checked]:bg-lime-600"
          />
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500 text-center">
          At least one testimonial type must be enabled
        </p>
      </div>

      {/* Video Option Labels - Only show if video is enabled */}
      {enableVideoTestimonial && (
        <>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">VIDEO OPTION LABELS</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Video Title */}
            <div className="group">
              <label htmlFor="videoOptionTitle" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                  <VideoIcon />
                </div>
                Video Option Title
              </label>
              <Input
                ref={videoTitleInputRef}
                id="videoOptionTitle"
                type="text"
                value={block.props.videoOptionTitle || 'Record a video'}
                onChange={(e) => handlePropChange('videoOptionTitle', e.target.value)}
                placeholder="Record a video"
                className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
              />
            </div>

            {/* Video Description */}
            <div className="group">
              <label htmlFor="videoOptionDescription" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                  <MessageSquareIcon />
                </div>
                Video Option Description
              </label>
              <Input
                ref={videoDescInputRef}
                id="videoOptionDescription"
                type="text"
                value={block.props.videoOptionDescription || '2-minute video testimonial'}
                onChange={(e) => handlePropChange('videoOptionDescription', e.target.value)}
                placeholder="2-minute video testimonial"
                className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
              />
            </div>
          </div>
        </>
      )}

      {/* Text Option Labels - Only show if text is enabled */}
      {enableTextTestimonial && (
        <>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">TEXT OPTION LABELS</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Text Title */}
            <div className="group">
              <label htmlFor="textOptionTitle" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-lime-500/10 text-lime-400 transition-colors group-hover:bg-lime-500/20">
                  <PenIcon />
                </div>
                Text Option Title
              </label>
              <Input
                ref={textTitleInputRef}
                id="textOptionTitle"
                type="text"
                value={block.props.textOptionTitle || 'Write your story'}
                onChange={(e) => handlePropChange('textOptionTitle', e.target.value)}
                placeholder="Write your story"
                className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
              />
            </div>

            {/* Text Description */}
            <div className="group">
              <label htmlFor="textOptionDescription" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-lime-500/10 text-lime-400 transition-colors group-hover:bg-lime-500/20">
                  <MessageSquareIcon />
                </div>
                Text Option Description
              </label>
              <Input
                ref={textDescInputRef}
                id="textOptionDescription"
                type="text"
                value={block.props.textOptionDescription || 'Text testimonial'}
                onChange={(e) => handlePropChange('textOptionDescription', e.target.value)}
                placeholder="Text testimonial"
                className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-11"
              />
            </div>
          </div>
        </>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">TIPS FOR GREAT TESTIMONIALS</span>
        </div>
      </div>

      {/* Tips Section */}
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="group flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Input
              type="text"
              value={tip}
              onChange={(e) => handleUpdateTip(index, e.target.value)}
              placeholder="Enter a tip..."
              className="flex-1 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-10 text-sm"
            />
            <button
              onClick={() => handleRemoveTip(index)}
              className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="Remove tip"
            >
              <XIcon />
            </button>
          </div>
        ))}

        {/* Add Tip Button */}
        <button
          onClick={handleAddTip}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-900/30 transition-all duration-200"
        >
          <PlusIcon />
          <span className="text-sm font-medium">Add Tip</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="mt-2 relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <LightbulbIcon className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">
              Tip Guidance
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tips help users provide better, more specific testimonials. Each tip will be displayed with a checkmark icon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditPanel;
