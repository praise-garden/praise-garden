import React from 'react';
import { WelcomeBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WelcomeEditPanelProps {
  block: WelcomeBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<WelcomeBlockConfig['props']>) => void;
}

const WelcomeEditPanel: React.FC<WelcomeEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof WelcomeBlockConfig['props'], value: string) => {
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
        <Input
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
       <div>
        <Label htmlFor="brandName">Brand Name</Label>
        <Input
          id="brandName"
          value={block.props.brandName}
          onChange={(e) => handlePropChange('brandName', e.target.value)}
        />
      </div>
       <div>
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          value={block.props.logoUrl}
          onChange={(e) => handlePropChange('logoUrl', e.target.value)}
        />
      </div>
    </div>
  );
};

export default WelcomeEditPanel;
