export default function ImepmsHomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">IME PMS Website</h1>
      <p className="text-lg mb-4">This website is under construction.Please check back soon. If you have any queries, you can use the WhatsApp button below to contact us.</p>

      {/* Our Offerings Section */}
      <div className="mt-16">
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <h2 className="text-3xl font-semibold text-gray-800 px-6">Our Offerings</h2>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Top Left */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">IME Concentrated Microtrends</h3>
            <p className="text-gray-700">A Large & Mid-cap concentrated portfolio that gives you concentrated exposures to value-generating microtrends.</p>
          </div>

          {/* Top Right */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">IME Digital Disruption</h3>
            <p className="text-gray-700">A Thematic Investment Portfolio, that gives you exposure to listed Digital Platforms.</p>
          </div>

          {/* Bottom Left */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">IME Equity Bespoke</h3>
            <p className="text-gray-700">Tailor-made equity stock portfolios, customised to the needs of individual clients. Min ticket sizes & alignment with our investment approach apply.</p>
          </div>

          {/* Bottom Right */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">IME Wealth Disruption</h3>
            <p className="text-gray-700">Tailor-made wealth portfolios, customised to the needs of individual clients. Min ticket sizes & alignment with our investment approach apply.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

