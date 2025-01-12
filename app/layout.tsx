import type { Metadata } from "next";
import "../components/ui/globals.css";
import { inter } from "../components/ui/font";
import { Toaster } from 'sonner'


export const metadata: Metadata = {
  title: "Social Paroi",
  description: "Climbing social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          theme="dark" 
          position="bottom-right"
          closeButton
          richColors
        />
      </body>
    </html>
  );
}
