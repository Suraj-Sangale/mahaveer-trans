import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { constantsList } from "@/constant";
import AiChat from "@/components/AiChat/AiChat";
import FloatingContact from "@/components/FloatingContact/FloatingContact";
import VisitorTracker from "@/components/analytics/VisitorTracker";

// Note: Next.js metadata must be a static object (build-time), so we read
// constantsList directly here. All runtime component code uses getConstant().
export const metadata: Metadata = {
  title: `${constantsList.COMPANY_NAME_SHORT} — Modern Logistics`,
  description: "Fast, reliable, global logistics solutions for every business.",
  icons: {
    icon: "/favicon.ico",
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
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <VisitorTracker />
          <Header />
          {children}
          <Footer />
          <FloatingContact />
          {process.env.NEXT_PUBLIC_AI_CHAT_ENABLED === "1" && <AiChat />}
        </ThemeProvider>
      </body>
    </html>
  );
}
