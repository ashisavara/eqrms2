'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Upload, X, Copy, Check } from 'lucide-react';
import { uploadImageToStorage } from '@/lib/supabase/serverQueryHelper';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUploaded?: (imagePath: string) => void;
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'MDX' | 'HTML' | null>(null);
  
  // Image props state
  const [imageProps, setImageProps] = useState({
    alt: '',
    caption: '',
    width: '',
    height: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImageToStorage(file, 'blog');
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadedPath(result.path!);
      toast.success('Image uploaded successfully!');
      
      // Call callback if provided
      if (onImageUploaded) {
        onImageUploaded(result.path!);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const generateMDXCode = () => {
    if (!uploadedPath) return '';
    
    const props = [];
    if (imageProps.alt && imageProps.alt.trim()) props.push(`alt="${imageProps.alt}"`);
    if (imageProps.caption && imageProps.caption.trim()) props.push(`caption="${imageProps.caption}"`);
    const widthNum = imageProps.width ? Number(imageProps.width) : NaN;
    if (!isNaN(widthNum) && widthNum > 0) props.push(`width={${widthNum}}`);
    const heightNum = imageProps.height ? Number(imageProps.height) : NaN;
    if (!isNaN(heightNum) && heightNum > 0) props.push(`height={${heightNum}}`);
    
    return props.length > 0 
      ? `<Image src="${uploadedPath}" ${props.join(' ')} />`
      : `<Image src="${uploadedPath}" />`;
  };

  const generateHTMLCode = () => {
    if (!uploadedPath) return '';
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/blog${uploadedPath}`;
    
    const attrs = [];
    attrs.push(`src="${imageUrl}"`);
    if (imageProps.alt && imageProps.alt.trim()) {
      attrs.push(`alt="${imageProps.alt}"`);
    }
    const widthNum = imageProps.width ? Number(imageProps.width) : NaN;
    if (!isNaN(widthNum) && widthNum > 0) attrs.push(`width="${widthNum}"`);
    const heightNum = imageProps.height ? Number(imageProps.height) : NaN;
    if (!isNaN(heightNum) && heightNum > 0) attrs.push(`height="${heightNum}"`);
    
    return `<img ${attrs.join(' ')} />`;
  };

  const copyToClipboard = async (code: string, type: 'MDX' | 'HTML') => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopiedType(type);
      toast.success(`${type} code copied to clipboard!`);
      setTimeout(() => setCopiedType(null), 2000);
      setIsOpen(false); // Close sheet after copying
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const resetUpload = () => {
    setUploadedPath(null);
    setCopiedType(null);
    setImageProps({
      alt: '',
      caption: '',
      width: '',
      height: ''
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Upload Image</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {!uploadedPath ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-4">
                  Click to select an image or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Select Image'}
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Upload Successful!</p>
                    <p className="text-xs text-green-600 mt-1">Configure image properties:</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Image Props Input Fields */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-16 text-right">alt:</label>
                  <Input
                    value={imageProps.alt}
                    onChange={(e) => setImageProps(prev => ({ ...prev, alt: e.target.value }))}
                    className="flex-1"
                    placeholder="Optional alt text"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-16 text-right">caption:</label>
                  <Input
                    value={imageProps.caption}
                    onChange={(e) => setImageProps(prev => ({ ...prev, caption: e.target.value }))}
                    className="flex-1"
                    placeholder="Optional caption"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-16 text-right">width:</label>
                  <Input
                    type="number"
                    value={imageProps.width}
                    onChange={(e) => setImageProps(prev => ({ ...prev, width: e.target.value }))}
                    className="flex-1"
                    placeholder="Optional width"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-16 text-right">height:</label>
                  <Input
                    type="number"
                    value={imageProps.height}
                    onChange={(e) => setImageProps(prev => ({ ...prev, height: e.target.value }))}
                    className="flex-1"
                    placeholder="Optional height"
                  />
                </div>
              </div>
              
              {/* Generated MDX Code */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">MDX Code (for blogs):</span>
                    <Button
                      onClick={() => copyToClipboard(generateMDXCode(), 'MDX')}
                      className="gap-2 bg-green-700 hover:bg-green-800 text-white"
                      size="sm"
                    >
                      {copiedType === 'MDX' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedType === 'MDX' ? 'Copied!' : 'Copy MDX'}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                    <code>{generateMDXCode()}</code>
                  </pre>
                </div>

                {/* Generated HTML Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HTML Code (for financials):</span>
                    <Button
                      onClick={() => copyToClipboard(generateHTMLCode(), 'HTML')}
                      className="gap-2 bg-blue-700 hover:bg-blue-800 text-white"
                      size="sm"
                    >
                      {copiedType === 'HTML' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedType === 'HTML' ? 'Copied!' : 'Copy HTML'}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                    <code>{generateHTMLCode()}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
