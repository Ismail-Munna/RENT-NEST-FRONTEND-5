import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>

        <Toaster position="top-right" richColors />
        {/* Navbar */}
        {children}

        {/* Footer */}
      </body>
    </html>
  );
}
