import { Geist, Doto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const doto = Doto({ subsets: ["latin"], variable: "--font-doto" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans", geist.variable, doto.variable)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
