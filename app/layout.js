import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[rgb(250,250,250)] dark:bg-[rgb(30,30,30)]">
        <header className="flex justify-center">
          <NavBar />
        </header>
        <main className="mt-25">{children}</main>
      </body>
    </html>
  );
}
