"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToggleThemeButton } from "@/components/ToggleThemeButton";
import { I18nProvider } from "@/components/i18nProvider";
import { ToggleLanguageButton } from "@/components/ToggleLanguageButton";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>g4o2.me</title>
        <meta
          name="description"
          content="Your website's short and compelling description goes here."
        />
        <meta name="author" content="Hu Kai-Hsiang @ tagme" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="g4o2.me - 學生匿名留言網站" />
        <meta
          property="og:description"
          content="一個輕型的平台，讓學生能公開、匿名分享貼文，享受簡潔的瀏覽體驗。"
        />
        <meta property="og:image" content="https://g4o2.me/logo.png" />
        <meta property="og:url" content="https://g4o2.me" />
        <meta property="og:type" content="website" />
      </head>
      <body className="overscroll-none bg-[rgb(250,250,250)] dark:bg-[rgb(30,30,30)] ">
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
              className="backdrop-blur-[1px] bg-transparent min-w-[50px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)] fixed right-6 top-40"
            />
            <ToggleLanguageButton
              variant="outline"
              asChild
              className="backdrop-blur-[1px] bg-transparent min-w-[50px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)] fixed right-6 top-25"
            />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
