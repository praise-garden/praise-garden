import React from 'react';
import { ThankYouBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ThankYouEditPanelProps {
  block: ThankYouBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<ThankYouBlockConfig['props']>) => void;
}

const ThankYouEditPanel: React.FC<ThankYouEditPanelProps> = ({ block, onUpdate }) => {
  const handlePropChange = (prop: keyof ThankYouBlockConfig['props'], value: string | boolean) => {
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
      <div className="flex items-center justify-between rounded-lg border border-gray-700 p-3">
        <Label htmlFor="showSocials">Show Socials</Label>
        <Switch
          id="showSocials"
          checked={block.props.showSocials}
          onCheckedChange={(checked) => handlePropChange('showSocials', checked)}
        />
      </div>
    </div>
  );
};

export default ThankYouEditPanel;
