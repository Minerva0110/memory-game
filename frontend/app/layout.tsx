import './globals.scss'

export const metadata = {
  title: 'Memory Game',
  description: 'Sci-fi memory matching fun!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  )
}
