import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { GroupMandateProvider } from "@/lib/contexts/GroupMandateContext";
import { MasterOptionsProvider } from "@/lib/contexts/MasterOptionsContext";
import { Toaster } from "sonner";
import { PWARegister } from "@/components/ui/pwa-register";

// Always use production domain for metadataBase to ensure canonical URLs
// always point to imecapital.in, even in preview deployments
const defaultUrl = process.env.NODE_ENV === 'development' && !process.env.VERCEL_URL
  ? "http://localhost:3000"
  : "https://imecapital.in";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "IME RMS",
  description: "Proprietary Fund Research Database",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IME RMS",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "IME RMS",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MXJDP83S');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IME RMS" />
        <meta name="application-name" content="IME RMS" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />  
        <script 
          type="text/javascript"
          src="https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js"
          id="aisensy-wa-widget"
          widget-id="aaax9f"
        >
        </script> 
      </head>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MXJDP83S"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MasterOptionsProvider>
            <GroupMandateProvider>
              {children}
              <Toaster position="top-center" />
              <PWARegister />
            </GroupMandateProvider>
          </MasterOptionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
