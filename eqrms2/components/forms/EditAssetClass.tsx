'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { assetClassSchema, AssetClassValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

function EditAssetClassForm({initialData, id, onSuccess}: {initialData: AssetClassValues | null, id: number, onSuccess: () => void}) {
    const [isLoading, setIsLoading] = useState(false);

    const cleanedData: AssetClassValues = {
        asset_class_summary: initialData?.asset_class_summary || "",
        asset_class_desc: initialData?.asset_class_desc || ""
    };

    const { control, handleSubmit} = useForm<AssetClassValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(assetClassSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('rms_asset_class', 'asset_class_id', id, data);
            toast.success('Asset class updated successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error updating asset class:', error);
            toast.error('Failed to update asset class. Please try again.');
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-d space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <ResizableTextArea name="asset_class_summary" label="Asset Class Summary" control={control} />
            <ResizableTextArea name="asset_class_desc" label="Asset Class Description" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}
