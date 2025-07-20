"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToggleThemeButton } from "@/components/ToggleThemeButton";
import { I18nProvider } from "@/components/i18nProvider";
import { ToggleLanguageButton } from "@/components/ToggleLanguageButton";
import Script from "next/script";
import Analytics from "@/utils/analytics";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>g4o2.me</title>
        <meta name="title" content="g4o2.me - 學生留言平台" />
        <meta name="description" content="匿名或公開發布貼文、留言" />
        <meta name="author" content="Hu Kai-Hsiang @ tagme" />
        <meta name="robots" content="index, follow" />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:title" content="g4o2.me - 學生留言平台" />
        <meta property="og:description" content="匿名或公開發布貼文、留言" />
        <meta property="og:image" content="https://g4o2.me/logo.png" />
        <meta property="og:url" content="https://g4o2.me" />
        <meta property="og:type" content="website" />

        {/* <!-- X (Twitter) --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://g4o2.me/" />
        <meta property="twitter:title" content="g4o2.me - 學生留言平台" />
        <meta
          property="twitter:description"
          content="匿名或公開發布貼文、留言"
        />
        <meta property="twitter:image" content="https://g4o2.me/logo.png" />

        {/* Google One Tap Script */}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body className="overscroll-none bg-[rgb(250,250,250)] dark:bg-[rgb(10,10,10)] ">
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <header className="flex justify-center">
              <NavBar />
            </header>
            <main>{children}</main>
            <Toaster />
            <ToggleThemeButton
              variant="outline"
              asChild
              className="backdrop-blur-[2px] bg-transparent min-w-[50px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)] fixed right-4 top-40"
            />
            <ToggleLanguageButton
              variant="outline"
              asChild
              className="backdrop-blur-[2px] bg-transparent min-w-[50px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)] fixed right-4 top-25"
            />
          </ThemeProvider>
        </I18nProvider>
        <Analytics />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-DXLYE91G0P`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DXLYE91G0P');
          `}
        </Script>
        {/* Simple Analytics */}
        <script
          data-collect-dnt="true"
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
      </body>
    </html>
  );
}
