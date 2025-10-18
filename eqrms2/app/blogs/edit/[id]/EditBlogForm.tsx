'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ResizableTextArea } from '@/components/forms/FormFields';
import { ComponentDirectorySheet } from '@/components/uiBlocks/ComponentDirectory';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';
import { toast } from 'sonner';

interface Blog {
  id: number;
  created_at: string;
  body: string;
}

interface EditBlogFormProps {
  initialData: Blog;
}

interface BlogFormData {
  body: string;
}

export function EditBlogForm({ initialData }: EditBlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log the initial data to see what we're receiving
  console.log('Initial blog body:', JSON.stringify(initialData.body));

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BlogFormData>({
    defaultValues: {
      body: initialData.body || ''
    }
  });

  useEffect(() => {
    reset({
      body: initialData.body || ''
    });
  }, [initialData, reset]);

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    
    // Debug: Log what we're receiving from the form
    console.log('Form data.body:', JSON.stringify(data.body));
    console.log('Contains newlines?', data.body.includes('\n'));
    console.log('Newline count:', (data.body.match(/\n/g) || []).length);
    
    try {
      // Preprocess content: Convert single line breaks to double line breaks for proper Markdown paragraphs
      // This ensures pressing "Enter" once in the editor creates visual paragraph breaks
      const processedBody = data.body
        .split('\n')
        .map((line, index, array) => {
          // If current line is not empty and next line is not empty, add extra newline
          const currentLineEmpty = line.trim() === '';
          const nextLineEmpty = index < array.length - 1 ? array[index + 1].trim() === '' : true;
          
          // If we're at a non-empty line followed by another non-empty line, we need double breaks
          if (!currentLineEmpty && index < array.length - 1 && !nextLineEmpty) {
            return line + '\n';
          }
          return line;
        })
        .join('\n');
      
      console.log('Processed body:', JSON.stringify(processedBody));

      // Update blog in database with processed content
      await supabaseUpdateRow('blogs', 'id', initialData.id, {
        body: processedBody
      });

      // Trigger on-demand revalidation for instant updates
      try {
        const revalidateRes = await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: `/blogs/${initialData.id}` })
        });

        if (!revalidateRes.ok) {
          console.warn('Revalidation failed, but blog was saved:', await revalidateRes.text());
          toast.warning('Blog saved, but may take a moment to update');
        }
      } catch (revalidateError) {
        // Non-critical error - blog is saved, just revalidation failed
        console.warn('Revalidation request failed:', revalidateError);
      }

      toast.success('Blog updated successfully!');
      router.push(`/blogs/${initialData.id}`);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploaded = (imagePath: string) => {
    // This could be enhanced to automatically insert the image tag into the textarea
    toast.info(`Image uploaded! Use this path: ${imagePath}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Edit Blog</h1>
        <p className="text-gray-600">Write your blog content using Markdown and MDX components</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Toolbar */}
        <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
          <ComponentDirectorySheet />
          <ImageUpload onImageUploaded={handleImageUploaded} />
        </div>

        {/* Content Editor */}
        <ResizableTextArea 
          name="body" 
          label="Blog Content" 
          control={control}
        />

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500">
            {Object.entries(errors).map(([field, error]) => (
              <div key={field}>{field}: {(error as any).message}</div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : 'Save Blog'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
