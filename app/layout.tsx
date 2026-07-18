import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiclaritysessions.com"),
  title: {
    default: "AI Clarity Sessions | AI Made Useful",
    template: "%s | AI Clarity Sessions",
  },
  description:
    "Beginner-friendly, hands-on AI training with Osborn G. Nelson II. Learn to use ChatGPT and everyday AI tools clearly, confidently, and safely.",
  applicationName: "AI Clarity Sessions",
  authors: [{ name: "Osborn G. Nelson II" }],
  creator: "Osborn G. Nelson II",
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
    "AI education",
    "AI training for small business",
    "AI safety training",
  ],
  category: "education",
  openGraph: {
    title: "AI Clarity Sessions | AI Finally Makes Sense",
    description:
      "No coding. No tech talk. Patient, hands-on guidance for using AI in real life, school, creativity, and business.",
    url: "https://aiclaritysessions.com",
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
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#080910",
  colorScheme: "dark light",
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
