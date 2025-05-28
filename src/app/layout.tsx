import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import Header from "./components/header/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Client Intake",
  description: "Next.js app with Clerk + PostgreSQL + Prisma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning={true}>
          <Header/>
          {/* Key fix: force ThemeProvider to only render on client */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
  