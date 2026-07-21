import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import CartProvider from "@/components/cart/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GOOGLE_ANALYTICS_ID = "G-KQ40TZCC26";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.sidelinementality.com",
  ),

  title: {
    default: "Sideline Mentality Cards",
    template: "%s | Sideline Mentality Cards",
  },

  description:
    "Buy premium sports trading cards including NFL, NBA, MLB, UFC, WWE, Pokémon, rookie cards, autographs, and graded cards. Collector-owned. Secure checkout. Fast shipping.",

  keywords: [
    "sports cards",
    "trading cards",
    "football cards",
    "baseball cards",
    "basketball cards",
    "pokemon cards",
    "ufc cards",
    "wwe cards",
    "rookie cards",
    "graded cards",
    "PSA cards",
    "sports card shop",
    "sports card marketplace",
    "Sideline Mentality",
    "Sideline Mentality Cards",
  ],

  authors: [
    {
      name: "Sideline Mentality",
    },
  ],

  creator: "Sideline Mentality",

  publisher: "Sideline Mentality",

  category: "Sports Trading Cards",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sidelinementality.com",
    siteName: "Sideline Mentality Cards",

    title: "Sideline Mentality Cards",

    description:
      "Premium sports trading cards with secure checkout, fast shipping, and new inventory added regularly.",
  },

  twitter: {
    card: "summary_large_image",

    title: "Sideline Mentality Cards",

    description:
      "Premium sports trading cards with secure checkout and fast shipping.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>{children}</CartProvider>
      </body>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            window.dataLayer.push(arguments);
          }

          gtag("js", new Date());
          gtag("config", "${GOOGLE_ANALYTICS_ID}");
        `}
      </Script>
    </html>
  );
}