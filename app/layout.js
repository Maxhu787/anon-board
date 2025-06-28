import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-center">
          <NavBar />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
