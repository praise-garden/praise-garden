import React from 'react';
import { AboutYouBlockConfig } from '@/types/form-config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AboutYouEditPanelProps {
  block: AboutYouBlockConfig;
  onUpdate: (blockId: string, updatedProps: Partial<AboutYouBlockConfig['props']>) => void;
}

const AboutYouEditPanel: React.FC<AboutYouEditPanelProps> = ({ block, onUpdate }) => {
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

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={block.props.title}
          onChange={(e) => handlePropChange('title', e.target.value)}
        />
      </div>

      {Object.keys(block.props.fields).map((fieldKey) => {
        const field = block.props.fields[fieldKey as keyof typeof block.props.fields];
        return (
          <div key={fieldKey} className="space-y-3 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <Label className="capitalize">{fieldKey}</Label>
              <Switch
                checked={field.enabled}
                onCheckedChange={(checked) => handleFieldChange(fieldKey as any, 'enabled', checked)}
              />
            </div>
            {field.enabled && (
              <div className="space-y-2">
                <Label htmlFor={`${fieldKey}-label`} className="text-xs text-gray-400">Label</Label>
                <Input
                  id={`${fieldKey}-label`}
                  value={field.label}
                  onChange={(e) => handleFieldChange(fieldKey as any, 'label', e.target.value)}
                />
                { 'placeholder' in field && (
                    <>
                        <Label htmlFor={`${fieldKey}-placeholder`} className="text-xs text-gray-400">Placeholder</Label>
                        <Input
                        id={`${fieldKey}-placeholder`}
                        value={(field as any).placeholder}
                        onChange={(e) => handleFieldChange(fieldKey as any, 'placeholder', e.target.value)}
                        />
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

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

export default AboutYouEditPanel;
