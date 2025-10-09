import React from 'react';
import { FormBlock, FormBlockType, FormConfig } from '@/types/form-config';

// Import placeholder Edit Panels (we will create these next)
import WelcomeEditPanel from './WelcomeEditPanel';
import RatingEditPanel from './RatingEditPanel';
import QuestionEditPanel from './QuestionEditPanel';
import NegativeFeedbackEditPanel from './NegativeFeedbackEditPanel';
import PrivateFeedbackEditPanel from './PrivateFeedbackEditPanel';
import ConsentEditPanel from './ConsentEditPanel';
import AboutYouEditPanel from './AboutYouEditPanel';
import ReadyToSendEditPanel from './ReadyToSendEditPanel';
import ThankYouEditPanel from './ThankYouEditPanel';

interface FormBuilderEditPanelProps {
  focusedBlock: FormBlock | null;
  onUpdateBlock: (blockId: string, updatedProps: any) => void;
}

const FormBuilderEditPanel: React.FC<FormBuilderEditPanelProps> = ({ focusedBlock, onUpdateBlock }) => {
  if (!focusedBlock) {
    return (
      <div className="text-center text-gray-500 pt-12">
        <p>Select a page or an element to see editing options.</p>
      </div>
    );
  }

  const renderPanel = () => {
    switch (focusedBlock.type) {
      case FormBlockType.Welcome:
        return <WelcomeEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.Rating:
        return <RatingEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.Question:
        return <QuestionEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.NegativeFeedback:
        return <NegativeFeedbackEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.PrivateFeedback:
        return <PrivateFeedbackEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.Consent:
        return <ConsentEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.AboutYou:
        return <AboutYouEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.ReadyToSend:
        return <ReadyToSendEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      case FormBlockType.ThankYou:
        return <ThankYouEditPanel block={focusedBlock as any} onUpdate={onUpdateBlock} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      <div>
        <h3 className="text-base font-medium text-gray-300 mb-4">
          Editing: <span className="text-purple-400 capitalize">{focusedBlock.type.replace('-', ' ')}</span>
        </h3>
        {renderPanel()}
      </div>
    </div>
  );
};

export default FormBuilderEditPanel;
