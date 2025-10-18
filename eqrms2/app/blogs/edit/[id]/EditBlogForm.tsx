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
    try {
      await supabaseUpdateRow('blogs', 'id', initialData.id, {
        body: data.body
      });

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
