import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://learn.whpp.site"),
  title: "WHPP Learn — бесплатный интерактивный курс HTML, CSS и JavaScript",
  description:
    "Полноценный бесплатный курс веб-разработки для начинающих: теория простыми словами, живые примеры и задания с автопроверкой прямо в браузере. HTML, CSS, немного JavaScript и финальный проект — своя страница с нуля.",
  openGraph: {
    title: "WHPP Learn — интерактивный курс HTML, CSS и JavaScript",
    description:
      "Учитесь создавать сайты, выполняя задания прямо в браузере: теория, живые примеры, автопроверка и прогресс. Бесплатно и без регистрации.",
    url: "https://learn.whpp.site",
    siteName: "WHPP Learn",
    type: "website",
    locale: "ru_RU",
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("whpp-learn-theme");if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
