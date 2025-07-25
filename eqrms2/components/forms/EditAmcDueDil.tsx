'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { amcDueDiligenceSchema, AmcDueDiligenceValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput  , DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

// Internal form component
function EditAmcDueDilForm({ 
  initialData, 
  id,
  onSuccess
}: { 
  initialData: AmcDueDiligenceValues; 
  id: number;
  onSuccess?: () => void;
}) {  
  // Convert null values to appropriate defaults for form inputs
  const cleanedData: AmcDueDiligenceValues = {
    // DD Section
    amc_incorporation_dd: initialData.amc_incorporation_dd ?? 0,
    pms_license_number_dd: initialData.pms_license_number_dd ?? "",
    shareholding_structure_dd: initialData.shareholding_structure_dd ?? "",
    other_biz_dd: initialData.other_biz_dd ?? "",
    legal_dd: initialData.legal_dd ?? "",
    
    // AMC Section
    team_changes_amc: initialData.team_changes_amc ?? "",
    inv_team_amc: initialData.inv_team_amc ?? "",
    ops_team_amc: initialData.ops_team_amc ?? "",
    inv_committee_amc: initialData.inv_committee_amc ?? "",
    ownership_alignment_amc: initialData.ownership_alignment_amc ?? "",
    strategy_adherance_amc: initialData.strategy_adherance_amc ?? "",
    nav_chart_amc: initialData.nav_chart_amc ?? "",
    cy_returns_amc: initialData.cy_returns_amc ?? 0,
    drawdown_history_amc: initialData.drawdown_history_amc ?? "",
    qty_mktcap_composition_amc: initialData.qty_mktcap_composition_amc ?? "",
    portfolio_turnover_amc: initialData.portfolio_turnover_amc ?? 0,
    section_allocation_amc: initialData.section_allocation_amc ?? "",
    historic_calls_amc: initialData.historic_calls_amc ?? "",
    black_swan_events_amc: initialData.black_swan_events_amc ?? "",
    capacity_contraints_amc: initialData.capacity_contraints_amc ?? "",
    inv_comm_amc: initialData.inv_comm_amc ?? "",
    webinars_amc: initialData.webinars_amc ?? "",
    mailing_list_amc: initialData.mailing_list_amc ?? false,
    
    // MAT Section
    fund_managers_mkt_mat: initialData.fund_managers_mkt_mat ?? "",
    inv_philosophy_mkt_mat: initialData.inv_philosophy_mkt_mat ?? "",
    portfolio_construction_mkt_mat: initialData.portfolio_construction_mkt_mat ?? "",
    risk_management_mkt_mat: initialData.risk_management_mkt_mat ?? "",
    cash_management_mkt_mat: initialData.cash_management_mkt_mat ?? "",
    derivatives_mkt_mat: initialData.derivatives_mkt_mat ?? false,
    inv_process_mkt_mat: initialData.inv_process_mkt_mat ?? "",
    active_schemes_mkt_mat: initialData.active_schemes_mkt_mat ?? "",
    rolling_returns_mkt_mat: initialData.rolling_returns_mkt_mat ?? 0,
    portfolio_composition_mkt_mat: initialData.portfolio_composition_mkt_mat ?? "",
    fee_mkt_mat: initialData.fee_mkt_mat ?? 0,
    commission_mkt_mat: initialData.commission_mkt_mat ?? 0,
    disclosure_doc_mkt_mat: initialData.disclosure_doc_mkt_mat ?? "",
    custory_broker_mkt_mat: initialData.custory_broker_mkt_mat ?? "",
    
    // SEBI Section
    firm_aum_sebi: initialData.firm_aum_sebi ?? 0,
    strategy_aum_clients_sebi: initialData.strategy_aum_clients_sebi ?? 0,
    
    // CHECK Section - Dates can stay null as they represent absence of a check
    disclosure_doc_last_check: initialData.disclosure_doc_last_check ?? null,
    mkt_mat_last_check: initialData.mkt_mat_last_check ?? null,
    amc_diligence_last_check: initialData.amc_diligence_last_check ?? null
  };

  const { control, handleSubmit, formState: { errors } } = useForm<AmcDueDiligenceValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(amcDueDiligenceSchema),
  });

  // Debug: Log form errors
  console.log('Form errors:', errors);

  const onSubmit = async (data: AmcDueDiligenceValues) => {
    console.log('Form submitted with data:', data); // Add this line
    
    try {
      if (!id) {
        throw new Error('id is required for updates');
      }
      
      await supabaseUpdateRow('rms_amc', 'id', id, data);
      
      if (typeof window !== "undefined") {
        toast.success("AMC Due Diligence updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== "undefined") {
        toast.error("Error updating AMC Due Diligence");
      }
    }
  };

  const yesNoOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => {
      console.log('Form submission failed with errors:', errors);
    })} className="w-full p-4 space-y-6">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      {/* CHECK Section */}
      <h3 className="text-lg font-semibold border-b pb-2">Last Check Dates</h3>
      <div className="space-y-4 grid grid-cols-3">
        <DatePicker name="disclosure_doc_last_check" label="Disclosure Document Last Check" control={control} />
        <DatePicker name="mkt_mat_last_check" label="Market Materials Last Check" control={control} />
        <DatePicker name="amc_diligence_last_check" label="AMC Diligence Last Check" control={control} />
      </div>

      {/* DD Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Due Diligence (DD)</h3>
        <TextInput name="amc_incorporation_dd" label="AMC Incorporation" control={control} type="number" />
        <TextInput name="pms_license_number_dd" label="PMS License Number" control={control} />
        <ResizableTextArea name="shareholding_structure_dd" label="Shareholding Structure" control={control} />
        <ResizableTextArea name="other_biz_dd" label="Other Business" control={control} />
        <ResizableTextArea name="legal_dd" label="Legal DD" control={control} />
      </div>

      {/* AMC Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">AMC Details</h3>
        <ResizableTextArea name="team_changes_amc" label="Team Changes" control={control} />
        <ResizableTextArea name="inv_team_amc" label="Investment Team" control={control} />
        <ResizableTextArea name="ops_team_amc" label="Operations Team" control={control} />
        <ResizableTextArea name="inv_committee_amc" label="Investment Committee" control={control} />
        <ResizableTextArea name="ownership_alignment_amc" label="Ownership Alignment" control={control} />
        <ResizableTextArea name="strategy_adherance_amc" label="Strategy Adherence" control={control} />
        <ResizableTextArea name="nav_chart_amc" label="NAV Chart" control={control} />
        <TextInput name="cy_returns_amc" label="Current Year Returns" control={control} type="number" step="0.01" />
        <ResizableTextArea name="drawdown_history_amc" label="Drawdown History" control={control} />
        <ResizableTextArea name="qty_mktcap_composition_amc" label="Quality Market Cap Composition" control={control} />
        <TextInput name="portfolio_turnover_amc" label="Portfolio Turnover" control={control} type="number" step="0.01" />
        <ResizableTextArea name="section_allocation_amc" label="Section Allocation" control={control} />
        <ResizableTextArea name="historic_calls_amc" label="Historic Calls" control={control} />
        <ResizableTextArea name="black_swan_events_amc" label="Black Swan Events" control={control} />
        <ResizableTextArea name="capacity_contraints_amc" label="Capacity Constraints" control={control} />
        <ResizableTextArea name="inv_comm_amc" label="Investment Communication" control={control} />
        <ResizableTextArea name="webinars_amc" label="Webinars" control={control} />
        <ToggleGroupInput 
          name="mailing_list_amc" 
          label="Mailing List" 
          control={control} 
          options={yesNoOptions}
          valueType="string"
          itemClassName="ime-choice-chips"
        />
      </div>

      {/* MAT Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Market Materials (MAT)</h3>
        <ResizableTextArea name="fund_managers_mkt_mat" label="Fund Managers" control={control} />
        <ResizableTextArea name="inv_philosophy_mkt_mat" label="Investment Philosophy" control={control} />
        <ResizableTextArea name="portfolio_construction_mkt_mat" label="Portfolio Construction" control={control} />
        <ResizableTextArea name="risk_management_mkt_mat" label="Risk Management" control={control} />
        <ResizableTextArea name="cash_management_mkt_mat" label="Cash Management" control={control} />
        <ToggleGroupInput 
          name="derivatives_mkt_mat" 
          label="Derivatives" 
          control={control} 
          options={yesNoOptions}
          valueType="string"
          itemClassName="ime-choice-chips"
        />
        <ResizableTextArea name="inv_process_mkt_mat" label="Investment Process" control={control} />
        <ResizableTextArea name="active_schemes_mkt_mat" label="Active Schemes" control={control} />
        <TextInput name="rolling_returns_mkt_mat" label="Rolling Returns" control={control} type="number" step="0.01" />
        <ResizableTextArea name="portfolio_composition_mkt_mat" label="Portfolio Composition" control={control} />
        <TextInput name="fee_mkt_mat" label="Fee" control={control} type="number" step="0.01" />
        <TextInput name="commission_mkt_mat" label="Commission" control={control} type="number" step="0.01" />
        <ResizableTextArea name="disclosure_doc_mkt_mat" label="Disclosure Document" control={control} />
        <ResizableTextArea name="custory_broker_mkt_mat" label="Custory Broker" control={control} />
      </div>

      {/* SEBI Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">SEBI Information</h3>
        <TextInput name="firm_aum_sebi" label="Firm AUM" control={control} type="number" /> 
        <TextInput name="strategy_aum_clients_sebi" label="Strategy AUM Clients" control={control} type="number" />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        onClick={() => console.log('Button clicked!')}
      >
        Update AMC Due Diligence
      </Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditAmcDueDilButton({ 
  amcData,
  amcId  // Add explicit amcId prop
}: { 
  amcData: any;
  amcId: number;  // Add explicit amcId prop type
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  // Use the explicit amcId prop instead of extracting from amcData
  if (!amcId) {
    console.error('amcId is required but not provided');
  }

  // Convert amc data to AmcDueDiligenceValues format
  const amcDueDilData: AmcDueDiligenceValues = {
    // DD Section
    amc_incorporation_dd: amcData.amc_incorporation_dd ?? 0,
    pms_license_number_dd: amcData.pms_license_number_dd ?? "",
    shareholding_structure_dd: amcData.shareholding_structure_dd ?? "",
    other_biz_dd: amcData.other_biz_dd ?? "",
    legal_dd: amcData.legal_dd ?? "",
    
    // AMC Section
    team_changes_amc: amcData.team_changes_amc ?? "",
    inv_team_amc: amcData.inv_team_amc ?? "",
    ops_team_amc: amcData.ops_team_amc ?? "",
    inv_committee_amc: amcData.inv_committee_amc ?? "",
    ownership_alignment_amc: amcData.ownership_alignment_amc ?? "",
    strategy_adherance_amc: amcData.strategy_adherance_amc ?? "",
    nav_chart_amc: amcData.nav_chart_amc ?? "",
    cy_returns_amc: amcData.cy_returns_amc ?? 0,
    drawdown_history_amc: amcData.drawdown_history_amc ?? "",
    qty_mktcap_composition_amc: amcData.qty_mktcap_composition_amc ?? "",
    portfolio_turnover_amc: amcData.portfolio_turnover_amc ?? 0,
    section_allocation_amc: amcData.section_allocation_amc ?? "",
    historic_calls_amc: amcData.historic_calls_amc ?? "",
    black_swan_events_amc: amcData.black_swan_events_amc ?? "",
    capacity_contraints_amc: amcData.capacity_contraints_amc ?? "",
    inv_comm_amc: amcData.inv_comm_amc ?? "",
    webinars_amc: amcData.webinars_amc ?? "",
    mailing_list_amc: amcData.mailing_list_amc ?? false,
    
    // MAT Section
    fund_managers_mkt_mat: amcData.fund_managers_mkt_mat ?? "",
    inv_philosophy_mkt_mat: amcData.inv_philosophy_mkt_mat ?? "",
    portfolio_construction_mkt_mat: amcData.portfolio_construction_mkt_mat ?? "",
    risk_management_mkt_mat: amcData.risk_management_mkt_mat ?? "",
    cash_management_mkt_mat: amcData.cash_management_mkt_mat ?? "",
    derivatives_mkt_mat: amcData.derivatives_mkt_mat ?? false,
    inv_process_mkt_mat: amcData.inv_process_mkt_mat ?? "",
    active_schemes_mkt_mat: amcData.active_schemes_mkt_mat ?? "",
    rolling_returns_mkt_mat: amcData.rolling_returns_mkt_mat ?? 0,
    portfolio_composition_mkt_mat: amcData.portfolio_composition_mkt_mat ?? "",
    fee_mkt_mat: amcData.fee_mkt_mat ?? 0,
    commission_mkt_mat: amcData.commission_mkt_mat ?? 0,
    disclosure_doc_mkt_mat: amcData.disclosure_doc_mkt_mat ?? "",
    custory_broker_mkt_mat: amcData.custory_broker_mkt_mat ?? "",
    
    // SEBI Section
    firm_aum_sebi: amcData.firm_aum_sebi ?? 0,
    strategy_aum_clients_sebi: amcData.strategy_aum_clients_sebi ?? 0,
    
    // CHECK Section - Dates can stay null as they represent absence of a check
    disclosure_doc_last_check: amcData.disclosure_doc_last_check ?? null,
    mkt_mat_last_check: amcData.mkt_mat_last_check ?? null,
    amc_diligence_last_check: amcData.amc_diligence_last_check ?? null
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
          Due Dil |
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit AMC Due Diligence</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAmcDueDilForm
                initialData={amcDueDilData}
                id={amcId}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
