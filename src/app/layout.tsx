import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOS Dashboard",
  description: "Driver Compliance Overview — Vehicle Assignment & Plan Adherence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
