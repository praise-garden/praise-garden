import React from 'react';
import { NegativeFeedbackBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NegativeFeedbackEditPanelProps {
  block: NegativeFeedbackBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<NegativeFeedbackBlockConfig['props']>) => void;
}

const NegativeFeedbackEditPanel: React.FC<NegativeFeedbackEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof NegativeFeedbackBlockConfig['props'], value: string) => {
    onUpdate(block.id, { [prop]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={block.props.title}
          onChange={(e) => handlePropChange('title', e.target.value)}
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

export default NegativeFeedbackEditPanel;
