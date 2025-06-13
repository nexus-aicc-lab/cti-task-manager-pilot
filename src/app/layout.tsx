import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CTI Task Master",
  description: "CTI Task Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}