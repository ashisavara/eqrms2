import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import Link from "next/link";

export default function ImepmsHomePage() {
  return (
    <div>
      <RmsPageTitle 
        title="IME Portfolio Managers" 
        caption="Research-First Portfolio Management Services with 20+ Years of Proven Track Record" 
      />

      {/* Introduction Section */}
      <Section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to IME Portfolio Managers</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            IME Portfolio Managers (IME PMS) was founded in 2025 by Ashi Anand, a seasoned fund manager with 20+ years of fund management experience. 
            We follow a strong fundamental investment approach driven by the IME Twin-Engine Investment Framework, with industry-leading investment processes & documentation.
          </p>
        </div>
      </Section>

      {/* Key Highlights */}
      <Section className="bg-blue-50 !py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Why Choose IME PMS?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">20+ Years Experience</h3>
            <p className="text-gray-700">Proven track record across multiple market cycles and investment strategies</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Research-First Approach</h3>
            <p className="text-gray-700">Driven by the IME Twin-Engine Investment Framework for disciplined stock selection</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Consistent Outperformance</h3>
            <p className="text-gray-700">Strong performance track record across all funds managed over 2 decades</p>
          </div>
        </div>
      </Section>

      {/* Our Offerings Section */}
      <Section>
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <h2 className="text-3xl font-semibold text-gray-800 px-6">Our Offerings</h2>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="border-box p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              <Link href="/imepms/ime-concentrated-microtrends" className="hover:text-blue-600">
                IME Concentrated Microtrends
              </Link>
            </h3>
            <p className="text-gray-700 mb-4">A Large & Mid-cap concentrated portfolio that gives you concentrated exposures to value-generating microtrends.</p>
            <Link href="/imepms/ime-concentrated-microtrends" className="text-blue-600 hover:underline">
              Learn more →
            </Link>
          </div>

          <div className="border-box p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              <Link href="/imepms/ime-digital-disruption" className="hover:text-blue-600">
                IME Digital Disruption
              </Link>
            </h3>
            <p className="text-gray-700 mb-4">A Thematic Investment Portfolio that gives you exposure to listed Digital Platforms.</p>
            <Link href="/imepms/ime-digital-disruption" className="text-blue-600 hover:underline">
              Learn more →
            </Link>
          </div>

          <div className="border-box p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              <Link href="/imepms/ime-bespoke-strategies" className="hover:text-blue-600">
                IME Equity Bespoke
              </Link>
            </h3>
            <p className="text-gray-700 mb-4">Tailor-made equity stock portfolios, customised to the needs of individual clients. Min ticket sizes & alignment with our investment approach apply.</p>
            <Link href="/imepms/ime-bespoke-strategies" className="text-blue-600 hover:underline">
              Learn more →
            </Link>
          </div>

          <div className="border-box p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">IME Wealth Bespoke</h3>
            <p className="text-gray-700 mb-4">Tailor-made wealth portfolios, customised to the needs of individual clients. Min ticket sizes & alignment with our investment approach apply.</p>
          </div>
        </div>
      </Section>

      {/* Investment Philosophy Highlight */}
      <SectionTextHighlight color="blue">
        <h2 className="text-2xl font-bold mb-4">Our Investment Philosophy</h2>
        <p className="mb-4">
          The IME Twin-Engine Investment Framework simplifies complex changes in diverse business fundamentals into two quantifiable factors: 
          expected changes in growth & multiples.
        </p>
        <p className="mb-4">
          This provides clear visibility into expected drivers of future stock price movements, building strong quantitative rigour & discipline to stock selection.
        </p>
        <Link href="/imepms/ime-twin-engine-framework" className="text-blue-300 hover:underline font-semibold">
          Learn more about our Investment Framework →
        </Link>
      </SectionTextHighlight>

      {/* About CIO Section */}
      <Section className="bg-gray-50 !py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">About Our CIO</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Ashi Anand brings over 20 years of fund management experience from ICICI Pru AMC, Kotak AMC, Allegro Capital Advisors, and Valcreate Investment Managers. 
            With a proven track record of consistent outperformance across all funds managed, Ashi has delivered exceptional results including Deep Value Strategy (#3 out of 127 funds) 
            and Allegro Healthcare (one of India's best performing funds over 2017-20).
          </p>
          <Link href="/imepms/about-us" className="text-blue-600 hover:underline font-semibold">
            Learn more about Ashi Anand →
          </Link>
        </div>
      </Section>

    </div>
  );
}

