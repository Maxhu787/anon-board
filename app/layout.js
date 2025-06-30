import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[rgb(250,250,250)] dark:bg-[rgb(30,30,30)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex justify-center">
            <NavBar />
          </header>
          <main className="mt-20">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
