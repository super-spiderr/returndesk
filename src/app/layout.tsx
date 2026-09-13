import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo, Noto_Sans_Tamil, Mukta_Malar } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://returndesk.in"),
  title: {
    default: "returndesk — the calculator that takes your side",
    template: "%s — returndesk",
  },
  description:
    "Free Indian personal finance calculators that end with a plain verdict, not a sales pitch. No login, nothing for sale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
