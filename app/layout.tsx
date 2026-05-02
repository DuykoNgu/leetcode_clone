import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans", geist.variable)}>
        {children}
      </body>
    </html>
  );
}
