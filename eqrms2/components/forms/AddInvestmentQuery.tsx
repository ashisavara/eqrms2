'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InvestmentQuerySchema, InvestmentQueryValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { MASTER_OPTIONS } from "@/lib/constants";

export function AddInvestmentQueryForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const defaultData: InvestmentQueryValues = {
        title: "",
        body: "",
        query_categories: "",
        slug: ""
    };

    const { control, handleSubmit } = useForm<InvestmentQueryValues>({
        defaultValues: defaultData,
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
            
            await supabaseInsertRow('investment_queries', processedData);
            
            if (typeof window !== "undefined") {
                toast.success("Investment Query created successfully!");
                setTimeout(() => {
                    router.push('/internal/public-site/investment-query');
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating Investment Query:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to create Investment Query. Please try again.");
            }
            setIsLoading(false);
        }
    });

    // Transform constants to value-label format for SelectInput
    const queryCategoryOptions = MASTER_OPTIONS.investmentQuery.map(category => ({ value: category, label: category }));

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            <h2>Add Investment Query</h2>
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
                    {isLoading ? 'Creating...' : 'Create Investment Query'}
                </Button>
            </div>
        </form>
    );
}

