import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JULIA — Le parfum, bientôt',
  description: 'Une nouvelle signature. Le parfum Julia arrive dans deux mois.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
