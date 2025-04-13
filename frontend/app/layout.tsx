export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="is">
      <head />
      <body>{children}</body>
    </html>
  )
}
