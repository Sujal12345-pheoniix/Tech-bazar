import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { auth } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "TECH-BAAZAR — The Future of Mobile Accessories",
    template: "%s | TECH-BAAZAR",
  },
  description:
    "Discover India's finest mobile accessories. Premium phone cases, fast chargers, wireless earbuds, smartwatches & more. Engineered for the future. Shop now with free delivery above ₹499.",
  keywords: [
    "mobile accessories India",
    "phone cases",
    "wireless earbuds",
    "fast chargers",
    "smartwatch",
    "power banks",
    "MagSafe accessories",
    "gaming accessories",
    "screen protectors",
    "premium mobile accessories",
  ],
  authors: [{ name: "TECH-BAAZAR" }],
  creator: "TECH-BAAZAR",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TECH-BAAZAR",
    title: "TECH-BAAZAR — The Future of Mobile Accessories",
    description:
      "Upgrade your mobile experience with India's most premium accessories. Free delivery above ₹499.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TECH-BAAZAR — Premium Mobile Accessories",
    description: "Upgrade your mobile experience. Shop India's finest accessories.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <div className="relative min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </div>
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  background: "rgba(9, 9, 11, 0.9)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
