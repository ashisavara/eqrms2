'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MediaInterviewSchema, MediaInterviewValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { MASTER_OPTIONS } from "@/lib/constants";
import { toLocalDateString } from "@/lib/utils";

export function AddMediaInterviewForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const defaultData: MediaInterviewValues = {
        title: "",
        publication: "",
        publication_date: null,
        youtube_url: "",
        summary: "",
        slug: "",
        article_link: ""
    };

    const { control, handleSubmit } = useForm<MediaInterviewValues>({
        defaultValues: defaultData,
        resolver: zodResolver(MediaInterviewSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            // Convert empty strings to null and Date to string
            const processedData = {
                ...data,
                publication_date: toLocalDateString(data.publication_date),
                youtube_url: data.youtube_url && data.youtube_url.trim() !== "" ? data.youtube_url : null,
                slug: data.slug && data.slug.trim() !== "" ? data.slug : null
            };
            
            await supabaseInsertRow('media_interviews', processedData);
            
            if (typeof window !== "undefined") {
                toast.success("Media Interview created successfully!");
                setTimeout(() => {
                    router.push('/internal/public-site/media-interview');
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating Media Interview:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to create Media Interview. Please try again.");
            }
            setIsLoading(false);
        }
    });

    // Transform constants to value-label format for SelectInput
    const publicationOptions = MASTER_OPTIONS.media.map(publication => ({ value: publication, label: publication }));

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <h2>Add Media Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="title" label="Title" control={control} placeholder="Enter interview title" />
                <SelectInput 
                    name="publication" 
                    label="Publication" 
                    control={control} 
                    options={publicationOptions}
                    valueType="string"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DatePicker name="publication_date" label="Publication Date" control={control} />
                <TextInput 
                    name="youtube_url" 
                    label="YouTube URL" 
                    control={control} 
                    placeholder="Enter YouTube URL" 
                />
                <TextInput 
                    name="slug" 
                    label="Slug" 
                    control={control} 
                    placeholder="Enter slug" 
                />
            </div>
            <TextInput 
                name="article_link" 
                label="Article Link" 
                control={control} 
                placeholder="Enter article link" 
            />
            <ResizableTextArea name="summary" label="Summary" control={control} />
            

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Media Interview'}
                </Button>
            </div>
        </form>
    );
}

