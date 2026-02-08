import './fonts.css'

export const metadata = {
  title: 'Tallulah',
  description: 'Tallulah Form Submission'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
