import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DataHub 数据工具选型平台",
    template: "%s | DataHub",
  },
  description: "DataHub 提供数据工具评测、技术对比与选型方法，帮助团队基于公开口径做出更稳健的技术决策。",
  keywords: [
    "数据工具",
    "BI 工具",
    "数据可视化",
    "数据采集",
    "工具对比",
    "技术选型",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DataHub 数据工具选型平台",
    description: "公开评测口径 + 多维度对比，帮助技术团队完成数据工具选型。",
    url: siteUrl,
    siteName: "DataHub",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataHub 数据工具选型平台",
    description: "公开评测口径 + 多维度对比，帮助技术团队完成数据工具选型。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
