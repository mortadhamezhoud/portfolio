import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Loader from "@/components/hero/Loader";
import CustomCursor from "@/components/ui/CustomCursor";
import Navigation from "@/components/nav/Navigation";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { routing } from "@/i18n/routing";
import { cvExists } from "@/lib/cv-exists";
import { getProfile } from "@/lib/content";
import { RESTORE_SIDEBAR_SCRIPT } from "@/lib/sidebar-state";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// viewport-fit=cover lets the mobile bar use env(safe-area-inset-bottom) on iPhones
export const viewport: Viewport = { viewportFit: "cover" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const profile = getProfile(locale);
  return {
    title: `${profile.name} · ${profile.title}`,
    description: profile.status,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fr: "/fr", "x-default": "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const profile = getProfile(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("intro-seen")==="1")document.documentElement.classList.add("intro-seen")}catch(e){}${RESTORE_SIDEBAR_SCRIPT}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Loader />
          <LanguageSwitcher />
          <Navigation profile={profile} hasCv={cvExists()} />
          <SmoothScroll>{children}</SmoothScroll>
          <CustomCursor />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
