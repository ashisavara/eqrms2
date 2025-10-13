'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { TicketsSchema, TicketsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { MASTER_OPTIONS } from "@/lib/constants";

// Internal form component
function AddTicketForm({
  onSuccess, 
  employeeOptions, 
  segmentOptions
}: {
  onSuccess: () => void;
  employeeOptions: { value: string; label: string }[];
  segmentOptions: { value: string; label: string }[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const defaultData: TicketsValues = {
        ticket_summary: "",
        ticket_description: "",
        ticket_name: "",
        created_by: "",
        status: "",
        status_desc: "",
        assignee: "",
        importance: "",
        ticket_segment: 0,
    };

    const { control, handleSubmit} = useForm<TicketsValues>({
        defaultValues: defaultData,
        resolver: zodResolver(TicketsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseInsertRow('ticketing', data);
            
            if (typeof window !== "undefined") {
                toast.success("Ticket created successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating Ticket:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to create Ticket. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput name="ticket_name" label="Ticket Name" control={control}/>
                <TextInput name="ticket_summary" label="Ticket Summary" control={control} />
                <ToggleGroupInput 
                name="importance" 
                label="Importance" 
                control={control} 
                options={MASTER_OPTIONS.ticketUrgency.map(urgency => ({ value: urgency, label: urgency }))} 
                itemClassName="ime-choice-chips" 
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectInput name="created_by" label="Created By" control={control} options={employeeOptions} />
                <SelectInput name="assignee" label="Assignee" control={control} options={employeeOptions} />
                <SelectInput name="ticket_segment" label="Ticket Segment" control={control} options={segmentOptions} valueType="number" />
            </div>

            <ToggleGroupInput 
                name="status" 
                label="Status" 
                control={control} 
                options={MASTER_OPTIONS.ticketStatus.map(status => ({ value: status, label: status }))}
                itemClassName="ime-choice-chips" 
            />
            
            <TextInput name="status_desc" label="Status Description" control={control} />
            <ResizableTextArea name="ticket_description" label="Ticket Description" control={control} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Ticket'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function AddTicketButton() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string }[]>([]);
  const [segmentOptions, setSegmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Fetch options when sheet opens
  const fetchOptions = async () => {
    if (isLoadingOptions) return;
    
    setIsLoadingOptions(true);
    try {
      // Fetch employee options
      const employees = await supabaseListRead({
        table: "ime_emp",
        columns: "auth_id, name"
      });
      
      // Fetch segment options
      const segments = await supabaseListRead({
        table: "ticket_segments", 
        columns: "id, ticket_segment"
      });

      console.log('Raw segments data:', segments);

      setEmployeeOptions(employees
        .filter((emp: any) => emp.auth_id != null && emp.name != null)
        .map((emp: any) => ({
          value: emp.auth_id,
          label: emp.name
        })));

      const processedSegments = segments
        .filter((seg: any) => seg.id != null && seg.ticket_segment != null)
        .map((seg: any) => ({
          value: String(seg.id),
          label: seg.ticket_segment
        }));
      
      console.log('Processed segments:', processedSegments);
      setSegmentOptions(processedSegments);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => {
          setShowAddSheet(true);
          fetchOptions();
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Add New Ticket
      </Button>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Create New Ticket</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              {isLoadingOptions ? (
                <div className="p-4 text-center">Loading options...</div>
              ) : (
                <AddTicketForm
                  onSuccess={() => setShowAddSheet(false)}
                  employeeOptions={employeeOptions}
                  segmentOptions={segmentOptions}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
