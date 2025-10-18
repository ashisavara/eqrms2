'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

// Component directory data
const mdxComponents = [
  {
    name: 'AlertBox',
    description: 'alert box with color variants',
    props: 'color: "blue" | "green" | "red" | "yellow" | "gray", heading, children',
    example: `<AlertBox color="blue" heading="Important Information"> content </AlertBox>`
  },
  {
    name: 'TextHighlight',
    description: 'text with bold/italic styling and gray borders',
    props: 'children',
    example: `<TextHighlight> highlighted text </TextHighlight>`
  },
  {
    name: 'HTML',
    description: 'render raw HTML content (trusted users only)',
    props: 'children (string)',
    example: `<HTML>{"<p><strong>Bold text</strong> with <em>italic</em></p>"}</HTML>`
  },
  // Add more components here as they are created
];

export function ComponentDirectorySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          MDX Components
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Available MDX Components</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <p className="text-sm text-gray-600">
            These components are available for use in your MDX content. Simply copy the example code and modify as needed.
          </p>

          {mdxComponents.map((component, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{component.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{component.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Props:</h4>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  <code className="font-mono text-gray-800">{component.props}</code>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Example:</h4>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                  <code>{component.example}</code>
                </pre>
              </div>
            </div>
          ))}

          {mdxComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No components registered yet.</p>
              <p className="text-sm mt-1">Add components to /components/uiBlocks/</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

