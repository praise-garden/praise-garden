"use client";

import React from 'react';
import { NegativeFeedbackBlockConfig } from '@/types/form-config';
import { TypeIcon, MessageSquareIcon, ButtonIcon, HeartHandshakeIcon } from './icons';
import { EditField, SectionDivider, InfoCard } from './shared';
import { useAutoFocus, useBlockUpdate } from './hooks';

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

  // Use custom hooks
  useAutoFocus(focusedField, block.id, {
    'props.title': titleInputRef,
    'props.description': descriptionInputRef,
    'props.feedbackQuestion': feedbackQuestionInputRef,
    'props.feedbackPlaceholder': feedbackPlaceholderInputRef,
    'props.feedbackHelperText': feedbackHelperTextInputRef,
    'props.buttonText': buttonTextInputRef,
  });

  const handlePropChange = useBlockUpdate<NegativeFeedbackBlockConfig['props']>(block.id, onUpdate);

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content Section */}
      <div className="space-y-6">
        <EditField
          id="title"
          label="Title"
          icon={<TypeIcon />}
          iconColorClass="orange"
          value={block.props.title || ''}
          onChange={(v) => handlePropChange('title', v)}
          placeholder="What can we do better?"
          inputRef={titleInputRef}
        />

        <EditField
          id="description"
          label="Description"
          icon={<MessageSquareIcon />}
          iconColorClass="amber"
          type="textarea"
          value={block.props.description || ''}
          onChange={(v) => handlePropChange('description', v)}
          placeholder="We're sorry to hear that. Please share your feedback..."
          inputRef={descriptionInputRef}
        />
      </div>

      <SectionDivider label="FEEDBACK FORM TEXT" />

      {/* Feedback Form Texts */}
      <div className="space-y-6">
        <EditField
          id="feedbackQuestion"
          label="Feedback Question Label"
          icon={<TypeIcon />}
          iconColorClass="orange"
          value={block.props.feedbackQuestion || 'Could you please tell us more?'}
          onChange={(v) => handlePropChange('feedbackQuestion', v)}
          placeholder="Could you please tell us more?"
          inputRef={feedbackQuestionInputRef}
        />

        <EditField
          id="feedbackPlaceholder"
          label="Placeholder Text"
          icon={<MessageSquareIcon />}
          iconColorClass="amber"
          value={block.props.feedbackPlaceholder || 'Please share as much detail as possible...'}
          onChange={(v) => handlePropChange('feedbackPlaceholder', v)}
          placeholder="Please share as much detail as possible..."
          inputRef={feedbackPlaceholderInputRef}
        />

        <EditField
          id="feedbackHelperText"
          label="Helper Text"
          icon={<MessageSquareIcon />}
          iconColorClass="amber"
          value={block.props.feedbackHelperText || 'We value your feedback and review every submission carefully.'}
          onChange={(v) => handlePropChange('feedbackHelperText', v)}
          placeholder="We value your feedback..."
          inputRef={feedbackHelperTextInputRef}
        />
      </div>

      <SectionDivider label="BUTTON" />

      {/* Button Section */}
      <div className="space-y-6">
        <EditField
          id="buttonText"
          label="Button Text"
          icon={<ButtonIcon />}
          iconColorClass="rose"
          value={block.props.buttonText || ''}
          onChange={(v) => handlePropChange('buttonText', v)}
          placeholder="Continue"
          inputRef={buttonTextInputRef}
        />
      </div>

      {/* Info Card */}
      <InfoCard
        icon={<HeartHandshakeIcon className="w-4 h-4 text-orange-400" />}
        iconColorClass="orange"
        title="Feedback Matters"
        description="This page appears when users rate below a certain threshold. Use it to collect constructive feedback while showing empathy."
      />
    </div>
  );
};

export default NegativeFeedbackEditPanel;
