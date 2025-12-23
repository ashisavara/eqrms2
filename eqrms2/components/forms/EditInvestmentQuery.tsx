'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InvestmentQuerySchema, InvestmentQueryValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { MASTER_OPTIONS } from "@/lib/constants";

export function EditInvestmentQueryForm({ 
    initialData, 
    id 
}: { 
    initialData: InvestmentQueryValues | null; 
    id: number; 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: InvestmentQueryValues = {
        title: initialData?.title || "",
        body: initialData?.body || "",
        query_categories: initialData?.query_categories || "",
        slug: initialData?.slug || ""
    };

    const { control, handleSubmit } = useForm<InvestmentQueryValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(InvestmentQuerySchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            // Convert empty string to null for slug
            const processedData = {
                ...data,
                slug: data.slug && data.slug.trim() !== "" ? data.slug : null
            };
            
            await supabaseUpdateRow('investment_queries', 'query_id', id, processedData);
            
            if (typeof window !== "undefined") {
                toast.success("Investment Query updated successfully!");
                setTimeout(() => {
                    router.push('/internal/public-site/investment-query');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Investment Query:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Investment Query. Please try again.");
            }
            setIsLoading(false);
        }
    });

    // Transform constants to value-label format for SelectInput
    const queryCategoryOptions = MASTER_OPTIONS.investmentQuery.map(category => ({ value: category, label: category }));

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <h2>Edit Investment Query</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="title" label="Title" control={control} placeholder="Enter query title" />
                <SelectInput 
                    name="query_categories" 
                    label="Query Category" 
                    control={control} 
                    options={queryCategoryOptions}
                    valueType="string"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput 
                    name="slug" 
                    label="Slug" 
                    control={control} 
                    placeholder="Enter slug" 
                />
            </div>
            
            <ResizableTextArea name="body" label="Body" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

