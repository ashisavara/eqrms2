'use client';

import { useState } from 'react';
import PageTitle from "@/components/uiComponents/page-title";

export default function IntroductoryCallPage() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div>
            <PageTitle 
                title="Introductory Call" 
                caption="Book an Introduction Call to learn more about our services" 
            />
            <div className="relative">
                {isLoading && (
                    <div className="flex items-center justify-center min-h-[655px] bg-gray-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading booking form...</p>
                        </div>
                    </div>
                )}
                <iframe 
                    src="https://imecapital.trafft.com/booking-embedded" 
                    style={{
                        border: 'none', 
                        width: '100%', 
                        maxWidth: '1200px', 
                        minHeight: '655px', 
                        margin: '0 auto', 
                        display: 'block'
                    }}
                    onLoad={() => setIsLoading(false)}
                ></iframe>
            </div>
        </div>
    );
}