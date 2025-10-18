'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import AlertBox from './AlertBox';
import TextHighlight from './TextHighlight';
import HTML from './HTML';
import Image from './Image';

// Component directory data with detailed prop metadata
const mdxComponents = [
  {
    name: 'AlertBox',
    component: AlertBox,
    props: [
      { name: 'color', type: 'select', options: ['blue', 'green', 'red', 'yellow', 'gray'], default: 'blue' },
      { name: 'heading', type: 'text', default: 'Important Information' },
      { name: 'children', type: 'ignore', default: 'Your content here' }
    ]
  },
  {
    name: 'TextHighlight',
    component: TextHighlight,
    props: [
      { name: 'children', type: 'text', default: 'Highlighted text' }
    ]
  },
  {
    name: 'HTML',
    component: HTML,
    props: [
      { name: 'children', type: 'text', default: '<p><strong>Bold text</strong> with <em>italic</em></p>' }
    ]
  },
  {
    name: 'Image',
    component: Image,
    props: [
      { name: 'src', type: 'text', default: '/image.jpg' },
      { name: 'alt', type: 'text', default: 'Description' },
      { name: 'caption', type: 'text', default: 'Optional caption' },
      { name: 'width', type: 'number', default: 400 },
      { name: 'height', type: 'number', default: 300 }
    ]
  }
];

interface PropValue {
  [key: string]: string | number;
}

export function ComponentDirectorySheet() {
  const [propValues, setPropValues] = useState<PropValue>({});
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [isOpen, setIsOpen] = useState(false);

  const updatePropValue = (componentName: string, propName: string, value: string | number) => {
    setPropValues(prev => ({
      ...prev,
      [`${componentName}.${propName}`]: value
    }));
  };

  const getPropValue = (componentName: string, propName: string, defaultValue: string | number) => {
    return propValues[`${componentName}.${propName}`] ?? defaultValue;
  };

  const generateCode = (component: any, values: PropValue) => {
    const componentName = component.name;
    const componentValues = Object.keys(values)
      .filter(key => key.startsWith(`${componentName}.`))
      .reduce((acc, key) => {
        const propName = key.replace(`${componentName}.`, '');
        acc[propName] = values[key];
        return acc;
      }, {} as PropValue);

    const propsString = component.props
      .filter((prop: any) => prop.type !== 'ignore')
      .map((prop: any) => {
        const value = componentValues[prop.name] ?? prop.default;
        if (prop.name === 'children') {
          return `>${value}</${componentName}>`;
        }
        return `${prop.name}="${value}"`;
      })
      .join(' ');

    if (component.props.some((prop: any) => prop.name === 'children')) {
      const childrenValue = componentValues.children ?? component.props.find((p: any) => p.name === 'children')?.default;
      return `<${componentName} ${propsString.replace(`>${childrenValue}</${componentName}>`, '')}>${childrenValue}</${componentName}>`;
    }

    return `<${componentName} ${propsString} />`;
  };

  const copyToClipboard = async (componentName: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [componentName]: true }));
      toast.success('Code copied to clipboard!');
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [componentName]: false }));
      }, 2000);
      // Close the sheet after copying
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const renderInput = (component: any, prop: any) => {
    const value = getPropValue(component.name, prop.name, prop.default);

    switch (prop.type) {
      case 'select':
        return (
          <div key={prop.name} className="flex items-center gap-2">
            <label className="text-sm font-medium w-16 text-right">{prop.name}:</label>
            <Select
              value={value as string}
              onValueChange={(val) => updatePropValue(component.name, prop.name, val)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prop.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'number':
        return (
          <div key={prop.name} className="flex items-center gap-2">
            <label className="text-sm font-medium w-16 text-right">{prop.name}:</label>
            <Input
              type="number"
              value={value}
              onChange={(e) => updatePropValue(component.name, prop.name, parseInt(e.target.value) || 0)}
              className="flex-1"
            />
          </div>
        );
      case 'text':
      default:
        return (
          <div key={prop.name} className="flex items-center gap-2">
            <label className="text-sm font-medium w-16 text-right">{prop.name}:</label>
            <Input
              value={value as string}
              onChange={(e) => updatePropValue(component.name, prop.name, e.target.value)}
              className="flex-1"
            />
          </div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          MDX Components
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>MDX Components</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 p-2">
          <Accordion type="single" collapsible className="space-y-1 p-2 rounded">
            {mdxComponents.map((component) => {
              const currentCode = generateCode(component, propValues);
              const isCopied = copiedStates[component.name];

              return (
                <AccordionItem key={component.name} value={component.name} className="border border-gray-400 my-4 p-2 rounded">
                  <AccordionTrigger className="px-1 py-1 hover:no-underline">
                    <div className="font-medium text-sm">{component.name}</div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="space-y-3">
                      {/* Input fields */}
                      <div className="grid grid-cols-1 gap-2">
                        {component.props
                          .filter((prop: any) => prop.type !== 'ignore')
                          .map((prop: any) => renderInput(component, prop))}
                      </div>

                      {/* Live preview */}
                      <div>
                        <div className="max-w-sm">
                          {(() => {
                            try {
                              const props: any = {};
                              component.props.forEach((prop: any) => {
                                const value = getPropValue(component.name, prop.name, prop.default);
                                if (prop.type !== 'ignore') {
                                  props[prop.name] = value;
                                }
                              });
                              const Component = component.component;
                              return <Component {...props} />;
                            } catch (error) {
                              return (
                                <div className="text-gray-500 text-xs">
                                  Preview unavailable
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* Copyable code */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Button
                            onClick={() => copyToClipboard(component.name, currentCode)}
                            className="gap-2 bg-green-700 hover:bg-green-800 text-white"
                            size="sm"
                          >
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {isCopied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                          <code>{currentCode}</code>
                        </pre>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

