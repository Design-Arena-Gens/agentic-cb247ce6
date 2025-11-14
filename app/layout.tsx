import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Harini & Vishnu | Wedding Celebration',
  description:
    'Join us to celebrate the wedding of Harini B and Vishnu Sithan with an elegant, interactive invitation experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
