import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CuantiCFO – Panel de Control Financiero',
  description: 'Plataforma CFO para gestión financiera, contabilidad, impuestos y flujo de caja.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
