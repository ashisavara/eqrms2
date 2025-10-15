"use client";

import { Button } from "@/components/ui/button";
import { RiskProfilerScores } from "@/lib/conversational-forms/riskProfilerCalculations";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface RiskProfilerSummaryProps {
  scores: RiskProfilerScores;
  onConfirm: () => void;
  onEdit: () => void;
  isSubmitting: boolean;
}

export function RiskProfilerSummary({
  scores,
  onConfirm,
  onEdit,
  isSubmitting
}: RiskProfilerSummaryProps) {
  
  // Helper to get color class based on category
  const getCategoryColor = (category: string | null): string => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    switch (category) {
      case 'Very Conservative':
        return 'bg-blue-100 text-blue-800';
      case 'Conservative':
        return 'bg-green-100 text-green-800';
      case 'Balanced':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aggressive':
        return 'bg-orange-100 text-orange-800';
      case 'Very Aggressive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Assessment Complete
          </h2>
        </div>
        <p className="text-gray-600">
          Review your risk profile results below and confirm to save.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Risk Taking Ability */}
        <div className="border rounded-lg p-2 bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900 my-2">Risk Taking Ability</p>
            </div>
            <div className="text-right">
              
              {scores.risk_taking_ability && (
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(scores.risk_taking_ability)}`}>
                {scores.risk_taking_ability}
              </span>
            </div>
          )}
            </div>
          </div>
          
        </div>

        {/* Risk Appetite */}
        <div className="border rounded-lg p-2 bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900 my-2">Risk Appetite</p>
            </div>
            <div className="text-right">
                {scores.risk_appetite && (
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(scores.risk_appetite)}`}>
                    {scores.risk_appetite}
                  </span>
                </div>
               )}
            </div>
          </div>
          
        </div>

        {/* Overall Risk Profile */}
        <div className="border-2 border-blue-200 rounded-lg p-2 bg-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg my-2">Overall Risk Profile</h3>
            </div>
            <div className="text-right">
                {scores.risk_profile && (
                <div className="mt-2">
                  <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold ${getCategoryColor(scores.risk_profile)}`}>
                    {scores.risk_profile}
                  </span>
                </div>
                )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4 mb-8">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Note:</span> This assessment helps us recommend investments aligned with your risk profile. 
          You can update your risk-profile anytime by clicking the pencil icon on your mandate page.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Answers
        </Button>
        
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex items-center gap-2 ml-auto bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Confirm & Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

