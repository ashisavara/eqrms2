import PageTitle from "@/components/uiComponents/page-title";

export default function InvestorComplaintsPage() {
  return (
    <div>
      <div className="mb-12">
        <PageTitle 
            title="Investor Complaints"
        />
        <h2 className="mt-10">Data for month ending Nov-25</h2>
        <table className="w-full border-collapse border border-gray-300 mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Sr No</th>
              <th className="border border-gray-300 p-2 text-left">Received From</th>
              <th className="border border-gray-300 p-2 text-left">Pending at end of last month</th>
              <th className="border border-gray-300 p-2 text-left">Received</th>
              <th className="border border-gray-300 p-2 text-left">Resolved</th>
              <th className="border border-gray-300 p-2 text-left">Pending</th>
              <th className="border border-gray-300 p-2 text-left">Pending Complaints greater than 3 months</th>
              <th className="border border-gray-300 p-2 text-left">Average Resolution time (in days)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">Directly from Investors</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">SEBI (SCORES)</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
                <td className="border border-gray-300 p-2">3</td>
                <td className="border border-gray-300 p-2">Other Sources</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
            </tr>
          </tbody>
        </table>
        <p className="table-footer-note">Average Resolution time is the sum total of time taken to resolve each complaint in days, in the current month divided by total number of complaints resolved in the current month. </p>
      </div>

      {/* Table 2: Trend of Monthly Disposal of Complaints */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Trend of Monthly Disposal of Complaints</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Sr No</th>
              <th className="border border-gray-300 p-2 text-left">Month</th>
              <th className="border border-gray-300 p-2 text-left">Carried Forward from previous month</th>
              <th className="border border-gray-300 p-2 text-left">Received</th>
              <th className="border border-gray-300 p-2 text-left">Resolved *</th>
              <th className="border border-gray-300 p-2 text-left">Pending #</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">Jul-25</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">Aug-25</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
                <td className="border border-gray-300 p-2">3</td>
                <td className="border border-gray-300 p-2">Sep-25</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">4</td>
              <td className="border border-gray-300 p-2">Oct-25</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
                <td className="border border-gray-300 p-2">5</td>
                <td className="border border-gray-300 p-2">Nov-25</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
                <td className="border border-gray-300 p-2">0</td>
            </tr>
           
          </tbody>
        </table>
        <p className="table-footer-note">*Inclusive of complaints of previous months resolved in the current month.</p> <p className="table-footer-note">#Inclusive of complaints pending as on the last day of the month</p>
        <p className="table-footer-note">IME PMS gots its SEBI license in Jul-25 and monthly complaints data is accordingly shared post the date of license receipt.</p>
      </div>

      {/* Table 3: Trend of Annual Disposal of Complaints */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Trend of Annual Disposal of Complaints</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Sr No</th>
              <th className="border border-gray-300 p-2 text-left">Year</th>
              <th className="border border-gray-300 p-2 text-left">Carried Forward from previous month</th>
              <th className="border border-gray-300 p-2 text-left">Received</th>
              <th className="border border-gray-300 p-2 text-left">Resolved**</th>
              <th className="border border-gray-300 p-2 text-left">Pending##</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">2025-26</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
            </tr>
          </tbody>
        </table>
        <p className="table-footer-note">**Inclusive of complaints of previous years resolved in the current year.</p> <p className="table-footer-note">##Inclusive of complaints pending as on the last day of the year.</p>
      </div>
    </div>
  );
}

