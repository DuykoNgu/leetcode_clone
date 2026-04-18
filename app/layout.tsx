import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({}) {
  return (
    <html className={cn("font-sans", geist.variable)}>
      <body>
        <h1>He</h1>;
      </body>
    </html>
  );
}
