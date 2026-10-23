import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://learn.whpp.site"),
  alternates: { canonical: "/" },
  title: "WHPP Learn — бесплатный интерактивный курс HTML, CSS и JavaScript",
  description:
    "Бесплатный интерактивный курс веб-разработки: HTML, CSS и JavaScript — теория простыми словами, живые примеры и задания с автопроверкой прямо в браузере.",
  openGraph: {
    title: "WHPP Learn — интерактивный курс HTML, CSS и JavaScript",
    description:
      "Учитесь создавать сайты, выполняя задания прямо в браузере: теория, живые примеры, автопроверка и прогресс. Бесплатно и без регистрации.",
    url: "https://learn.whpp.site",
    siteName: "WHPP Learn",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: "WHPP Learn — бесплатный курс HTML, CSS и JavaScript",
              url: "https://learn.whpp.site/",
              inLanguage: "ru",
              isAccessibleForFree: true,
              provider: { "@type": "Organization", name: "WHPP", sameAs: "https://whpp.site/" },
              description:
                "Бесплатный интерактивный курс веб-разработки: HTML, CSS и JavaScript — теория простыми словами, живые примеры и задания с автопроверкой прямо в браузере.",
            }),
          }}
        />

        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(113733353, "init", {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: false
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/113733353"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
