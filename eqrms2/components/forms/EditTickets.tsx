'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { TicketsSchema, TicketsValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";
import { MASTER_OPTIONS } from "@/lib/constants";

// Internal form component
function EditTicketForm({
  initialData, 
  id, 
  onSuccess, 
  employeeOptions, 
  segmentOptions
}: {
  initialData: TicketsValues | null; 
  id: number; 
  onSuccess: () => void;
  employeeOptions: { value: string; label: string }[];
  segmentOptions: { value: string; label: string }[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: TicketsValues = {
        ticket_summary: initialData?.ticket_summary || "",
        ticket_description: initialData?.ticket_description || "",
        ticket_name: initialData?.ticket_name || "",
        created_by: initialData?.created_by || "",
        status: initialData?.status || "",
        status_desc: initialData?.status_desc || "",
        assignee: initialData?.assignee || null,
        importance: initialData?.importance || null,
        ticket_segment: initialData?.ticket_segment || 0,
    };

    const { control, handleSubmit} = useForm<TicketsValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(TicketsSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('ticketing', 'ticket_id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Ticket updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Ticket:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Ticket. Please try again.");
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
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditTicketButton({ 
  ticketData,
  ticketId
}: { 
  ticketData: any;
  ticketId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string }[]>([]);
  const [segmentOptions, setSegmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  if (!ticketId) {
    console.error('Asset class data is missing asset_class_id:', ticketData);
  }

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

  // Convert category data to TicketsValues format
  const ticketUpdateData: TicketsValues = {
    ticket_summary: ticketData.ticket_summary ?? "",
    ticket_description: ticketData.ticket_description ?? "",
    ticket_name: ticketData.ticket_name ?? "",
    created_by: ticketData.created_by ?? "",
    status: ticketData.status ?? "",
    status_desc: ticketData.status_desc ?? "",
    assignee: ticketData.assignee ?? null,
    importance: ticketData.importance ?? null,
    ticket_segment: ticketData.ticket_segment ?? null,
  };

  return (
    <>
      <span 
        onClick={() => {
          setShowEditSheet(true);
          fetchOptions();
        }}
        className="blue-hyperlink"
      >
        {ticketData.ticket_name || "Edit Ticket"}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Ticket Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              {isLoadingOptions ? (
                <div className="p-4 text-center">Loading options...</div>
              ) : (
                <EditTicketForm
                  initialData={ticketUpdateData}
                  id={ticketId}
                  onSuccess={() => setShowEditSheet(false)}
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