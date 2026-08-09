import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebase";

const SITE_URL = "https://boursio.onrender.com";
const logoPath = "/logo.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page non trouvÃ©e</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous recherchez n'existe pas ou a Ã©tÃ© dÃ©placÃ©e.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour Ã  l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu s'afficher
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue. Vous pouvez rÃ©essayer ou revenir Ã  l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            RÃ©essayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour Ã  l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Boursio â€” Trouvez et candidatez aux bourses d'Ã©tudes avec l'IA" },
      {
        name: "description",
        content:
          "Boursio est la plateforme IA tout-en-un pour trouver les bourses d'Ã©tudes adaptÃ©es Ã  votre profil, prÃ©parer vos dossiers de candidature et suivre vos demandes jusqu'au succÃ¨s. Disponible sur mobile et web.",
      },
      { name: "author", content: "Boursio" },
      {
        name: "robots",
        content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      },
      {
        name: "keywords",
        content:
          "bourses d'Ã©tudes, bourses Ã©tudiants Afrique, bourse internationale, IA bourses, Boursio, recommandation bourse personnalisÃ©e, dossier candidature bourse, Ã©tude Ã  l'Ã©tranger, bourse master, bourse doctorat, lettre de motivation bourse, suivi candidature bourse, application bourse mobile",
      },
      { name: "theme-color", content: "#0047AB" },
      { name: "msapplication-TileColor", content: "#0047AB" },
      { name: "google-site-verification", content: "dYmXN8d9Jf9cWdgnzrGidKiLu4Q2fbmvpmvUzc1frKc" },
      { name: "revisit-after", content: "7 days" },
      { name: "language", content: "French" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Boursio" },
      { name: "application-name", content: "Boursio" },
      { name: "mobile-web-app-capable", content: "yes" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Boursio" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: "Boursio â€” Trouvez et candidatez aux bourses d'Ã©tudes avec l'IA" },
      {
        property: "og:description",
        content:
          "Recommandations de bourses personnalisÃ©es par IA, assistance Ã  la rÃ©daction de vos dossiers et suivi de vos candidatures jusqu'au succÃ¨s.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}${logoPath}` },
      { property: "og:image:secure_url", content: `${SITE_URL}${logoPath}` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:alt", content: "Boursio â€” Plateforme IA de bourses d'Ã©tudes" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@boursio_app" },
      { name: "twitter:creator", content: "@boursio_app" },
      { name: "twitter:title", content: "Boursio â€” Trouvez et candidatez aux bourses d'Ã©tudes avec l'IA" },
      {
        name: "twitter:description",
        content:
          "Trouvez les bourses adaptÃ©es Ã  votre profil et candidatez plus efficacement grÃ¢ce Ã  l'intelligence artificielle.",
      },
      { name: "twitter:image", content: `${SITE_URL}${logoPath}` },
      { name: "twitter:image:alt", content: "Boursio â€” Plateforme IA de bourses d'Ã©tudes" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "icon", href: "/favicon-64x64.png", type: "image/png", sizes: "64x64" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />

        {/* Organization */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Boursio",
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}${logoPath}`,
                width: 512,
                height: 512,
              },
              description:
                "Plateforme IA de recommandation et suivi de bourses d'Ã©tudes pour Ã©tudiants africains et internationaux.",
              foundingDate: "2024",
              areaServed: "Worldwide",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "contact@boursio.app",
                availableLanguage: ["French"],
              },
              sameAs: [
                "https://www.linkedin.com/company/boursio/",
                "https://instagram.com/boursio_app",
                "https://facebook.com/boursio.official",
                "https://tiktok.com/@boursio.app",
                "https://x.com/boursio_app",
              ],
            }),
          }}
        />

        {/* WebSite + SearchAction */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Boursio",
              url: SITE_URL,
              description: "Trouvez les bourses d'Ã©tudes adaptÃ©es Ã  votre profil grÃ¢ce Ã  l'intelligence artificielle.",
              inLanguage: "fr-FR",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://app.boursio.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* SoftwareApplication */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Boursio",
              operatingSystem: "Android, iOS, Web",
              applicationCategory: "EducationApplication",
              description:
                "Application mobile et web munie d'une IA qui recommande des bourses d'Ã©tudes sur-mesure, aide Ã  la candidature et suit les dossiers.",
              url: SITE_URL,
              offers: [
                { "@type": "Offer", name: "Plan Gratuit", price: "0", priceCurrency: "XOF" },
                { "@type": "Offer", name: "Plan Essentiel", price: "500", priceCurrency: "XOF" },
                { "@type": "Offer", name: "Plan Premium", price: "1000", priceCurrency: "XOF" },
              ],
              featureList: [
                "Recommandations de bourses personnalisÃ©es par IA",
                "Assistance Ã  la rÃ©daction de lettres de motivation",
                "Suivi des candidatures en temps rÃ©el",
                "Agents IA pour la gestion des dossiers",
                "Base de donnÃ©es de bourses internationales",
              ],
            }),
          }}
        />

        {/* FAQPage */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Comment Boursio trouve-t-il les bourses adaptÃ©es Ã  mon profil ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Boursio utilise une IA qui analyse votre profil acadÃ©mique, votre parcours et vos objectifs pour vous recommander les bourses les plus pertinentes parmi une base de donnÃ©es internationale constamment mise Ã  jour.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Boursio est-il gratuit ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Boursio propose un plan gratuit. Des abonnements Ã  500 FCFA/mois (Essentiel) et 1000 FCFA/mois (Premium) donnent accÃ¨s aux fonctionnalitÃ©s avancÃ©es de l'IA.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Sur quelles plateformes est disponible Boursio ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Boursio est disponible sur le web (app.boursio.com), sur Android via le Play Store et sur iOS via l'App Store.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Boursio aide-t-il Ã  rÃ©diger les lettres de motivation ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Oui, les agents IA de Boursio gÃ©nÃ¨rent des lettres de motivation personnalisÃ©es et optimisÃ©es pour chaque bourse.",
                  },
                },
              ],
            }),
          }}
        />

        {/* BreadcrumbList */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "FonctionnalitÃ©s", item: `${SITE_URL}/#features` },
                { "@type": "ListItem", position: 3, name: "Comment Ã§a marche", item: `${SITE_URL}/#how` },
                { "@type": "ListItem", position: 4, name: "Tarifs", item: `${SITE_URL}/#pricing` },
                { "@type": "ListItem", position: 5, name: "FAQ", item: `${SITE_URL}/#faq` },
                { "@type": "ListItem", position: 6, name: "Contact", item: `${SITE_URL}/#contact` },
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAnalytics />
      <Outlet />
    </QueryClientProvider>
  );
}

function FirebaseAnalytics() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);
  return null;
}
