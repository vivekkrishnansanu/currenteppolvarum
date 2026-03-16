import './globals.css'

export const metadata = {
  title: 'Current Eppolvarum | കറന്റ് എപ്പോൾ വരും?',
  description: 'Kerala real-time power outage tracker. Check scheduled KSEB cuts and unplanned outages by district.',
  openGraph: {
    title: 'Current Eppolvarum — കറന്റ് എപ്പോൾ വരും?',
    description: "Kerala's power cut tracker. Know before you ask.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Current Eppolvarum',
    description: "Kerala's power cut tracker. Know before you ask.",
  },
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
