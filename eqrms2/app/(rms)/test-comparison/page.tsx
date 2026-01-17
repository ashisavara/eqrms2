import { FundAmcComparison } from '@/components/uiComponents/fund-amc-comparison';

export default async function TestComparisonPage() {
  // Test with a few fund IDs
  // Using common fund IDs - adjust these based on actual fund IDs in your database
  const testFundIds = [2500, 2501, 2502,2503,2504];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fund AMC Comparison Test</h1>
      <p className="text-gray-600 mb-8">
        Testing comparison component with fund IDs: {testFundIds.join(', ')}
      </p>
      <FundAmcComparison fundIds={testFundIds}>
        <h3 className="text-red-500">Test</h3>
        <p>This is a <b>test comparison</b> of the funds.</p>
      </FundAmcComparison>
    </div>
  );
}
