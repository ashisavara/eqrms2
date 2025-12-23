// Usage
// import { AddBlogForm } from "@/components/forms/AddBlog";
// <AddBlogForm />


'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BlogSchema, BlogValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { MASTER_OPTIONS } from "@/lib/constants";
import { ComponentDirectorySheet } from "@/components/uiBlocks/ComponentDirectory";
import { ImageUpload } from "@/components/forms/ImageUpload";

export function AddBlogForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const defaultData: BlogValues = {
        title: "",
        body: "",
        featured_image: "",
        status: "",
        category: ""
    };

    const { control, handleSubmit } = useForm<BlogValues>({
        defaultValues: defaultData,
        resolver: zodResolver(BlogSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            // Convert empty string to null for featured_image
            const processedData = {
                ...data,
                featured_image: data.featured_image && data.featured_image.trim() !== "" ? data.featured_image : null
            };
            
            await supabaseInsertRow('blogs', processedData);
            
            if (typeof window !== "undefined") {
                toast.success("Blog created successfully!");
                setTimeout(() => {
                    router.push('/internal/public-site/blog');
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating Blog:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to create Blog. Please try again.");
            }
            setIsLoading(false);
        }
    });

    // Transform constants to value-label format for SelectInput
    const statusOptions = MASTER_OPTIONS.blogStatus.map(status => ({ value: status, label: status }));
    const categoryOptions = MASTER_OPTIONS.blogCategory.map(category => ({ value: category, label: category }));

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <h2>Add Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="title" label="Title" control={control} placeholder="Enter blog title" />
                <SelectInput 
                        name="status" 
                        label="Status" 
                        control={control} 
                        options={statusOptions}
                        valueType="string"
                    />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TextInput 
                name="featured_image" 
                label="Featured Image Path" 
                control={control} 
                placeholder="Paste image path here (e.g., /image.jpg)" 
            />
            
            
                
                <SelectInput 
                    name="category" 
                    label="Category" 
                    control={control} 
                    options={categoryOptions}
                    valueType="string"
                />
                <ComponentDirectorySheet />
                <ImageUpload />
      

            </div>
            
            
            <ResizableTextArea name="body" label="Body" control={control} />
            
            

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Blog'}
                </Button>
            </div>
        </form>
    );
}

