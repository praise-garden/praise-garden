import React from 'react';
import { PrivateFeedbackBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PrivateFeedbackEditPanelProps {
  block: PrivateFeedbackBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<PrivateFeedbackBlockConfig['props']>) => void;
}

const PrivateFeedbackEditPanel: React.FC<PrivateFeedbackEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof PrivateFeedbackBlockConfig['props'], value: string) => {
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

export default PrivateFeedbackEditPanel;
