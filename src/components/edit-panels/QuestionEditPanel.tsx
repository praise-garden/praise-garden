import React from 'react';
import { QuestionBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionEditPanelProps {
  block: QuestionBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<QuestionBlockConfig['props']>) => void;
}

const QuestionEditPanel: React.FC<QuestionEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof QuestionBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          value={block.props.question}
          onChange={(e) => handlePropChange('question', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={block.props.description}
          onChange={(e) => handlePropChange('description', e.target.value)}
        />
      </div>
       <div>
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={block.props.placeholder}
          onChange={(e) => handlePropChange('placeholder', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={block.props.buttonText}
          onChange={(e) => handlePropChange('buttonText', e.target.value)}
        />
      </div>
    </div>
  );
};

export default QuestionEditPanel;
