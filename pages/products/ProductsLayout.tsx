import { Inter } from "next/font/google";
import "./globals.css"; // Adjust path if needed
import Navbar from "./components/Navbar";
import SessionProvider from './SessionProvider';


const inter = Inter({ subsets: ["latin"] });



export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}