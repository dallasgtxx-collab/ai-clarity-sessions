import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiclaritysessions.com"),
  title: {
    default: "AI Clarity Sessions | AI Made Useful",
    template: "%s | AI Clarity Sessions",
  },
  description:
    "Beginner-friendly, hands-on AI workshops that make ChatGPT and everyday artificial intelligence tools clear, useful, and safe.",
  applicationName: "AI Clarity Sessions",
  authors: [{ name: "Da'LLas G'" }],
  creator: "Da'LLas G'",
  publisher: "AI Clarity Sessions",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AI classes for beginners",
    "ChatGPT workshop",
    "artificial intelligence training",
    "hands-on AI class",
    "AI Clarity Sessions",
  ],
  openGraph: {
    title: "AI Clarity Sessions | AI Finally Makes Sense",
    description:
      "No coding. No tech talk. Patient, hands-on guidance for using AI in real life, school, creativity, and business.",
    url: "/",
    siteName: "AI Clarity Sessions",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        alt: "AI Clarity Sessions — AI finally makes sense.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Clarity Sessions | AI Finally Makes Sense",
    description:
      "Beginner-friendly, hands-on AI workshops with patient, practical guidance.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f9f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
