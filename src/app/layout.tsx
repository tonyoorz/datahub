import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataHub 数据工具库",
  description: "聚合优质数据工具，助力数据驱动决策",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
