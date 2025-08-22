'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { TextInput, NumberInput, ResizableTextArea, SelectInput, ToggleGroupInput } from "./FormFields";
import { CATEGORY_OPTIONS, STRUCTURE_OPTIONS, getAssetClassIdByCategoryId } from "@/lib/categoryConstants";
import { toast, Toaster } from "sonner";
import { useGroupMandate } from "@/lib/contexts/GroupMandateContext";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";

// Form schema for adding held away assets
type AddHeldAwayFormData = {
    fund_name: string;
    asset_class_id: number;
    category_id: number;
    structure_id: number;
    advisor_name: string;
    pur_amt: number;
    cur_amt: number;
    rms_fund_id: number | null;
    group_id: number;
    investor_id: number;
};

// Props for the form
type AddHeldAwayFormProps = {
    investorOptions: { value: number; label: string }[];
    onSuccess: () => void;
};

// Internal form component
function AddHeldAwayForm({ investorOptions, onSuccess }: AddHeldAwayFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { currentGroup } = useGroupMandate();

    const cleanedData: AddHeldAwayFormData = {
        fund_name: "",
        asset_class_id: 0,
        category_id: 0,
        structure_id: 0,
        advisor_name: "",
        pur_amt: 0,
        cur_amt: 0,
        rms_fund_id: null,
        group_id: currentGroup?.id || 0,
        investor_id: 0
    };

    const { control, handleSubmit, watch, setValue} = useForm<AddHeldAwayFormData>({
        defaultValues: cleanedData,
    });

    // Watch for category changes to auto-populate asset_class_id
    const selectedCategoryId = watch("category_id");
    
    useEffect(() => {
        if (selectedCategoryId) {
            const assetClassId = getAssetClassIdByCategoryId(selectedCategoryId);
            if (assetClassId !== null) {
                setValue("asset_class_id", assetClassId);
            }
        }
    }, [selectedCategoryId, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseInsertRow('investments', data);
            console.log("Submitting held away asset:", data);
            
            if (typeof window !== "undefined") {
                toast.success("Held Away Asset added successfully!");
                setTimeout(() => {
                    onSuccess?.();
                }, 1500);
            }
        } catch (error) {
            console.error('Error adding Held Away Asset:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to add Held Away Asset. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TextInput name="fund_name" label="Fund Name" control={control} />
                <TextInput name="advisor_name" label="Advisor Name" control={control} />
                <NumberInput name="pur_amt" label="Purchase Amount" control={control} />
                <NumberInput name="cur_amt" label="Current Amount" control={control} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Structure selection using ToggleGroupInput */}
                <ToggleGroupInput 
                    name="structure_id" 
                    label="Structure" 
                    control={control} 
                    options={STRUCTURE_OPTIONS.map(structure => ({
                        value: String(structure.structure_id),
                        label: structure.structure_name
                    }))}
                    valueType="number"
                    toggleGroupClassName="gap-2 flex-wrap"
                    itemClassName="ime-choice-chips"
                />
                
                {/* Category selection with automatic asset class lookup */}
                <SelectInput 
                    name="category_id" 
                    label="Category" 
                    control={control} 
                    options={CATEGORY_OPTIONS.map(cat => ({
                        value: String(cat.category_id),
                        label: cat.cat_long_name
                    }))}
                    valueType="number"
                />
            </div>
            
            {/* Investor selection using ToggleGroupInput */}
            <ToggleGroupInput 
                name="investor_id" 
                label="Investor" 
                control={control} 
                options={investorOptions.map(investor => ({
                    value: String(investor.value),
                    label: investor.label
                }))}
                valueType="number"
                toggleGroupClassName="gap-2 flex-wrap"
                itemClassName="ime-choice-chips"
            />
            
            {/* Hidden asset class field that gets auto-populated */}
            <input type="hidden" {...control.register("asset_class_id")} />
            
            {/* Hidden group_id field from context */}
            <input type="hidden" {...control.register("group_id")} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Held Away Asset'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function AddHeldAwayButton({ 
    investorOptions,
    children
}: { 
    investorOptions: { value: number; label: string }[];
    children?: React.ReactNode;
}) {
    const [showAddSheet, setShowAddSheet] = useState(false);

    return (
        <>
            <span 
                onClick={() => setShowAddSheet(true)}
                className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
            >
                {children || 'Add Held Away Asset'}
            </span>

            {/* Add Sheet */}
            {showAddSheet && (
                <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
                    <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
                        <SheetHeader>
                            <SheetTitle>Add New Held Away Asset</SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                            <AddHeldAwayForm
                                investorOptions={investorOptions}
                                onSuccess={() => setShowAddSheet(false)}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}
