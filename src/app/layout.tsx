import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo, Noto_Sans_Tamil, Mukta_Malar } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const muktaMalar = Mukta_Malar({
  variable: "--font-mukta-malar",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-tamil-body",
  subsets: ["tamil"],
  weight: ["400", "500", "700", "800"],
});

const taunTamil = localFont({
  src: [
    {
      path: "../../public/fonts/taun-tamil.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-taun-tamil",
  display: "swap",
});

const siteTitle = "returndesk — the calculator that takes your side";
const siteDescription =
  "Free Indian personal finance calculators that end with a plain verdict, not a sales pitch. No login, nothing for sale.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: "%s — returndesk",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/images/hero.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/hero.png"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: siteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${muktaMalar.variable} ${taunTamil.variable} ${notoSansTamil.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Plain block body, not flex: a flex item with auto horizontal margins
          (every page's `mx-auto max-w-*` wrapper) shrinks to its content
          width instead of filling the viewport, so this stays block. */}
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* AdSense account verification/loader. No ad units are placed yet.
            Plain <script>, not next/script, so it's present verbatim in the
            static HTML for Google's verification crawl rather than injected
            client-side after hydration. */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2629348632800859"
          crossOrigin="anonymous"
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
