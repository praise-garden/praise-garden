"use client";

import React, { useState } from 'react';
import { AboutYouBlockConfig } from '@/types/form-config';
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

const ButtonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="8" width="18" height="8" rx="2" ry="2"></rect>
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface AboutYouEditPanelProps {
  block: AboutYouBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<AboutYouBlockConfig['props']>) => void;
  focusedField?: { blockId: string; fieldPath: string } | null;
}

const AboutYouEditPanel: React.FC<AboutYouEditPanelProps> = ({ block, onUpdate, focusedField }) => {
  // Track which field sections are expanded
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});

  // Refs for auto-focus
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);
  const buttonTextInputRef = React.useRef<HTMLInputElement>(null);
  const nameLabelRef = React.useRef<HTMLInputElement>(null);
  const namePlaceholderRef = React.useRef<HTMLInputElement>(null);
  const titleLabelRef = React.useRef<HTMLInputElement>(null);
  const titlePlaceholderRef = React.useRef<HTMLInputElement>(null);
  const companyLabelRef = React.useRef<HTMLInputElement>(null);
  const companyPlaceholderRef = React.useRef<HTMLInputElement>(null);
  const avatarLabelRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus logic
  React.useEffect(() => {
    if (!focusedField || focusedField.blockId !== block.id) return;

    const fieldPath = focusedField.fieldPath;
    let inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (fieldPath === 'props.title') inputRef = titleInputRef;
    else if (fieldPath === 'props.description') inputRef = descriptionInputRef;
    else if (fieldPath === 'props.buttonText') inputRef = buttonTextInputRef;
    else if (fieldPath === 'props.fields.name.label') inputRef = nameLabelRef;
    else if (fieldPath === 'props.fields.name.placeholder') inputRef = namePlaceholderRef;
    else if (fieldPath === 'props.fields.title.label') inputRef = titleLabelRef;
    else if (fieldPath === 'props.fields.title.placeholder') inputRef = titlePlaceholderRef;
    else if (fieldPath === 'props.fields.company.label') inputRef = companyLabelRef;
    else if (fieldPath === 'props.fields.company.placeholder') inputRef = companyPlaceholderRef;
    else if (fieldPath === 'props.fields.avatar.label') inputRef = avatarLabelRef;

    if (inputRef?.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [focusedField, block.id]);

  const handlePropChange = (prop: keyof AboutYouBlockConfig['props'], value: any) => {
    onUpdate(block.id, { [prop]: value });
  };

  const handleFieldChange = (
    field: keyof AboutYouBlockConfig['props']['fields'],
    prop: string,
    value: string | boolean
  ) => {
    const updatedFields = {
      ...block.props.fields,
      [field]: {
        ...block.props.fields[field],
        [prop]: value,
      },
    };
    handlePropChange('fields', updatedFields);
  };

  const toggleExpanded = (fieldKey: string) => {
    setExpandedFields(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  // Field configuration for rendering
  const fieldConfigs = [
    { key: 'name', label: 'Name Field', iconColor: 'emerald', hasPlaceholder: true },
    { key: 'title', label: 'Title/Role Field', iconColor: 'blue', hasPlaceholder: true },
    { key: 'company', label: 'Company Field', iconColor: 'violet', hasPlaceholder: true },
    { key: 'avatar', label: 'Avatar Upload', iconColor: 'pink', hasPlaceholder: false },
  ] as const;

  const getIconColorClasses = (color: string) => ({
    bg: `bg-${color}-500/10`,
    text: `text-${color}-400`,
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        {/* Title */}
        <div className="group">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-teal-500/10 text-teal-400 transition-colors group-hover:bg-teal-500/20">
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
            placeholder="Tell us about yourself"
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 h-11"
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
            value={block.props.description || 'Share a little more about yourself.'}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder="Share a little more about yourself..."
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 min-h-[70px] resize-none leading-relaxed"
            rows={2}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gray-950 px-3 text-gray-500 font-medium tracking-wide">FORM FIELDS</span>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="space-y-3">
        {fieldConfigs.map(({ key, label, iconColor, hasPlaceholder }) => {
          const field = block.props.fields[key as keyof typeof block.props.fields];
          const isExpanded = expandedFields[key] ?? false;
          const isEnabled = field.enabled;

          return (
            <div key={key} className="rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Expand/Collapse Button */}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(key)}
                    className={`flex items-center justify-center w-6 h-6 rounded transition-all ${isEnabled ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 cursor-not-allowed'
                      }`}
                    disabled={!isEnabled}
                  >
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded && isEnabled ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-5 h-5 rounded ${iconColor === 'emerald' ? 'bg-emerald-500/10' :
                    iconColor === 'blue' ? 'bg-blue-500/10' :
                      iconColor === 'violet' ? 'bg-violet-500/10' : 'bg-pink-500/10'
                    }`}>
                    <UserIcon className={`w-3 h-3 ${iconColor === 'emerald' ? 'text-emerald-400' :
                      iconColor === 'blue' ? 'text-blue-400' :
                        iconColor === 'violet' ? 'text-violet-400' : 'text-pink-400'
                      }`} />
                  </div>

                  {/* Label with asterisk for required */}
                  <span className={`text-sm font-medium ${isEnabled ? 'text-white' : 'text-gray-500'}`}>
                    {label}{isEnabled && field.required && <span className="text-red-400 text-xs ml-0.5">*</span>}
                  </span>
                </div>

                {/* Enable/Disable Switch - with better visibility */}
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleFieldChange(key as any, 'enabled', checked)}
                  className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-gray-700 border border-gray-600"
                />
              </div>

              {/* Expandable Content */}
              {isEnabled && isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-800 space-y-3">
                  {/* Required Checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={field.required ?? false}
                      onChange={(e) => handleFieldChange(key as any, 'required', e.target.checked)}
                      className="w-3 h-3 rounded border-gray-600 bg-transparent text-teal-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-500">Required</span>
                  </label>

                  {/* Label Input */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Label</label>
                    <Input
                      ref={key === 'name' ? nameLabelRef : key === 'title' ? titleLabelRef : key === 'company' ? companyLabelRef : avatarLabelRef}
                      value={field.label}
                      onChange={(e) => handleFieldChange(key as any, 'label', e.target.value)}
                      placeholder="Field label"
                      className="bg-gray-900/50 border-gray-700 text-white text-sm h-9"
                    />
                  </div>

                  {/* Placeholder Input (if applicable) */}
                  {hasPlaceholder && 'placeholder' in field && (
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Placeholder</label>
                      <Input
                        ref={key === 'name' ? namePlaceholderRef : key === 'title' ? titlePlaceholderRef : companyPlaceholderRef}
                        value={(field as any).placeholder}
                        onChange={(e) => handleFieldChange(key as any, 'placeholder', e.target.value)}
                        placeholder="Placeholder text"
                        className="bg-gray-900/50 border-gray-700 text-white text-sm h-9"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
        <div className="group">
          <label htmlFor="buttonText" className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
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
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-600 focus:bg-gray-900 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 h-11"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent_50%)]"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200 mb-1">Personalize Testimonials</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Toggle fields on/off and mark them as required. Click the chevron to expand field settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutYouEditPanel;
