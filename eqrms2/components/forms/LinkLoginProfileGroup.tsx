'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NumberInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

type FormValues = { group_id: number };

function LinkLoginProfileGroupForm({ uuid, onSuccess }: { uuid: string; onSuccess: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<any | null>(null);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { group_id: 0 }
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await supabaseUpdateRow('login_profile', 'uuid', uuid, { group_id: data.group_id });
      if (typeof window !== "undefined") {
        toast.success("Group linked successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1200);
      }
    } catch (error: any) {
      // Capture and show detailed Supabase/PostgREST error info
      setApiError(error);
      if (typeof window !== "undefined") {
        toast.error("Failed to link group. See error details in the form.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md text-sm">
          <div className="font-semibold mb-1">Update failed</div>
          {apiError.message && <div><span className="font-medium">Message:</span> {String(apiError.message)}</div>}
          {apiError.details && <div><span className="font-medium">Details:</span> {String(apiError.details)}</div>}
          {apiError.hint && <div><span className="font-medium">Hint:</span> {String(apiError.hint)}</div>}
          {apiError.code && <div><span className="font-medium">Code:</span> {String(apiError.code)}</div>}
          {apiError.status && <div><span className="font-medium">Status:</span> {String(apiError.status)}</div>}
        </div>
      )}

      <NumberInput name="group_id" label="Group ID" control={control} step="1" />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Linking...' : 'Link Group'}
        </Button>
      </div>
    </form>
  );
}

export function LinkLoginProfileGroupButton({ uuid }: { uuid: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span 
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
      >
        Link Group
      </span>
      {open && (
        <Sheet open={true} onOpenChange={() => setOpen(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Link Group to Login Profile</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <LinkLoginProfileGroupForm uuid={uuid} onSuccess={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}


