import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { t, setLang, getLang, Lang } from "@/lib/i18n";

const montserrat = Montserrat({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentKit",
  description: "Catálogo de skills, servidores MCP e prompts para agentes de IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined") {
    setLang((getLang() as Lang) || "pt");
    document.documentElement.lang = getLang();
  }

  return (
    <html lang={getLang()} className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
