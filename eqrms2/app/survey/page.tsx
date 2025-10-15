"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { surveyFormConfig } from "@/lib/conversational-forms/configs/surveyForm.config";
import { SimpleFormSheet } from "@/components/conversational-form/SimpleFormSheet";
import { MessageSquare, CheckCircle } from "lucide-react";

export default function SurveyPage() {
  const router = useRouter();
  const [showSurvey, setShowSurvey] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setShowSurvey(false);
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            User Feedback Survey
          </h1>
          <p className="text-lg text-gray-600">
            Share your experience and help us improve our service
          </p>
        </div>

        {isCompleted ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Thank You!</CardTitle>
              <CardDescription>
                Your feedback has been submitted successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                We appreciate you taking the time to share your thoughts with us.
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                Return Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Create New Survey */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Start New Survey</CardTitle>
                <CardDescription>
                  Begin a fresh survey and share your feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowSurvey(true)} 
                  className="w-full"
                >
                  Start Survey
                </Button>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>About This Survey</CardTitle>
                <CardDescription>
                  What to expect
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">One Question at a Time</p>
                    <p className="text-sm text-gray-600">Easy, focused questions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quick & Simple</p>
                    <p className="text-sm text-gray-600">Navigate back and forth freely</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">5-6 Questions</p>
                    <p className="text-sm text-gray-600">Takes about 2-3 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Simple Form Sheet */}
        <SimpleFormSheet
          formConfig={surveyFormConfig}
          open={showSurvey}
          onOpenChange={setShowSurvey}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}

