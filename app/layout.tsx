// app/layout.tsx
import { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import 'styles/animations.css';

const title = 'Moderntology | Bridging Spirituality & Society';
const description = 'The convergence of ancient wisdom and modern data. Unlock exclusive insights with our unified ideology tool.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,

  // Custom Open Graph metadata for rich social media previews
  openGraph: {
    title: title,
    description: description,
    url: getURL(),
    siteName: title,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: getURL(`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`),
        width: 1200,
        height: 630,
        alt: 'The List Before The List - Property Research Platform',
      },
    ],
  },


  // Additional metadata
  keywords: [
    'property research',
    'property tax records',
    'real estate data',
    'property analytics',
    'auction properties',
    'property investment'
  ],

  authors: [{ name: 'The List Before The List Team' }],

  // Structured data for better previews
  other: {
    'application-name': title,
    'apple-mobile-web-app-title': title,
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#000000',
  },

  // Remove the empty icons since they might be causing issues
  // If you want a favicon, create proper icon files
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better social media support */}
        <meta name="author" content="The List Before The List Team" />
        <meta name="publisher" content="The List Before The List" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* Structured data for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": title,
              "description": description,
              "url": getURL(),
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "category": "SaaS"
              }
            })
          }}
        />
      </head>
      <body className="bg-black">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          {children}
        </main>
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
