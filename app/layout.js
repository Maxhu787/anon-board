import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToggleThemeButton } from "@/components/ToggleThemeButton";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>g4o2.me</title>
      </head>
      <body className="bg-[rgb(250,250,250)] dark:bg-[rgb(30,30,30)]">
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
            className="min-w-[50px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)] fixed right-6 bottom-6"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
