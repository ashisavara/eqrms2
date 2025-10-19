'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BookOpen, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

// Component directory data with minimal prop metadata
const mdxComponents = [
  {
    name: 'AlertBox',
    props: [
      { name: 'color', options: ['blue', 'green', 'red', 'yellow', 'gray'] },
      { name: 'heading', required: true },
      { name: 'children', required: true }
    ]
  },
  {
    name: 'TextHighlight',
    props: [
      { name: 'children', required: true }
    ]
  },
  {
    name: 'HTML',
    props: [
      { name: 'children', required: true }
    ]
  },
  {
    name: 'Image',
    props: [
      { name: 'src', required: true },
      { name: 'alt', required: true },
      { name: 'caption', optional: true },
      { name: 'width', optional: true },
      { name: 'height', optional: true },
      { name: 'align', options: ['left', 'center', 'right'] }
    ]
  },
  {
    name: 'InfoCard',
    props: [
      { name: 'image', optional: true },
      { name: 'headline', optional: true },
      { name: 'children', optional: true },
      { name: 'colorStyle', options: ['blue', 'green', 'red', 'yellow', 'gray', 'purple'] }
    ]
  },
  {
    name: 'Accordion (Complete)',
    props: [
      { name: 'Full accordion tree with 2 items', required: true }
    ]
  }
];

export function ComponentDirectorySheet() {
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [isOpen, setIsOpen] = useState(false);

  const generateCode = (component: any) => {
    // Special case for complete accordion
    if (component.name === 'Accordion (Complete)') {
      return `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What are hybrid funds?</AccordionTrigger>
    <AccordionContent>
      Hybrid funds invest in a combination of equity stocks and debt securities to provide investors with a balanced risk-return profile.
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item-2">
    <AccordionTrigger>What are the benefits?</AccordionTrigger>
    <AccordionContent>
      Benefits include lower volatility, automatic rebalancing, and potential tax advantages compared to separate equity and debt investments.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;
    }

    const propsString = component.props
      .map((prop: any) => {
        if (prop.options) {
          return `${prop.name}="${prop.options[0]}"`;
        }
        if (prop.optional) {
          return `${prop.name}="value"`;
        }
        return `${prop.name}="value"`;
      })
      .join(' ');

    return `<${component.name} ${propsString}>content</${component.name}>`;
  };

  const copyToClipboard = async (componentName: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [componentName]: true }));
      toast.success('Code copied!');
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [componentName]: false }));
      }, 2000);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" /> MDX Components
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>MDX Components</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-2">
          {/* Quick Grid Layout Copy */}
          <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
            <div className="flex-1">
              <div className="font-medium text-sm">Grid Layout (2 columns)</div>
              <div className="text-xs text-gray-600 mt-1">Responsive grid container</div>
            </div>
            <Button
              onClick={() => copyToClipboard('grid-2col', '<div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>')}
              className="gap-1 bg-green-700 hover:bg-green-800 text-white ml-2"
              size="sm"
            >
              {copiedStates['grid-2col'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          {mdxComponents.map((component) => {
            const currentCode = generateCode(component);
            const isCopied = copiedStates[component.name];

            return (
              <div key={component.name} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{component.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {component.props.map((prop: any, index: number) => {
                      const parts = [];
                      if (prop.options) {
                        parts.push(`${prop.name} (${prop.options.join(', ')})`);
                      } else if (prop.optional) {
                        parts.push(`${prop.name} (optional)`);
                      } else {
                        parts.push(prop.name);
                      }
                      return parts.join(', ');
                    }).join(' • ')}
                  </div>
                </div>
                <Button
                  onClick={() => copyToClipboard(component.name, currentCode)}
                  className="gap-1 bg-green-700 hover:bg-green-800 text-white ml-2"
                  size="sm"
                >
                  {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

