'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ResizableTextArea, TextInput, ToggleGroupInput } from '@/components/forms/FormFields';
import { ComponentDirectorySheet } from '@/components/uiBlocks/ComponentDirectory';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { supabaseUpdateRow } from '@/lib/supabase/serverQueryHelper';
import { toast } from 'sonner';

interface Blog {
  slug: string;
  created_at: Date;
  body: string;
  title: string;
  featured_image: string;
  status: string;
}

interface EditBlogFormProps {
  initialData: Blog;
}

interface BlogFormData {
  title: string;
  featured_image: string;
  status: string;
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
      title: initialData.title || '',
      featured_image: initialData.featured_image || '',
      status: initialData.status || 'draft',
      body: initialData.body || ''
    }
  });

  useEffect(() => {
    reset({
      title: initialData.title || '',
      featured_image: initialData.featured_image || '',
      status: initialData.status || 'draft',
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
      await supabaseUpdateRow('blogs', 'slug', initialData.slug, {
        title: data.title,
        featured_image: data.featured_image,
        status: data.status,
        body: processedBody
      });

      // Trigger on-demand revalidation for instant updates
      try {
        const revalidateRes = await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: `/blogs/${initialData.slug}` })
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
      router.push(`/blogs/${initialData.slug}`);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploaded = (imagePath: string) => {
    // Set the featured_image field with the uploaded image path
    // This would require access to the form's setValue method
    toast.info(`Image uploaded! Path: ${imagePath}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Edit Blog</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Toolbar */}
        <div className="flex gap-2">
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
            className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
          >
            Cancel
          </Button>
          <ToggleGroupInput 
            name="status" 
            label="Status" 
            control={control}
            itemClassName="ime-choice-chips"
            hiddenLabel={true}
            options={[
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' }
            ]}
          />
        </div>

        {/* Blog Fields */}
        <div className="grid grid-cols-2 space-x-4">
          <TextInput 
            name="title" 
            label="Blog Title" 
            control={control}
            placeholder="Enter blog title"
          />
          <TextInput 
            name="featured_image" 
            label="Featured Image URL" 
            control={control}
            placeholder="Image URL from uploader"
          />
        </div>
        <div className="grid grid-cols-2 space-x-4">  
          <ComponentDirectorySheet />
          <ImageUpload onImageUploaded={handleImageUploaded} />
        </div>

        {/* Content Editor */}
        <ResizableTextArea 
          name="body" 
          label="Blog Content" 
          control={control}
          maxRows={20}
        />

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500">
            {Object.entries(errors).map(([field, error]) => (
              <div key={field}>{field}: {(error as any).message}</div>
            ))}
          </div>
        )}

      </form>
    </div>
  );
}
