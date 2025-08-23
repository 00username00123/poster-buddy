import type {Metadata} from 'next';
import { Film } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { MovieProvider } from "@/context/MovieContext";

export const metadata: Metadata = {
  title: 'Poster Buddy',
  description: 'A cycling display of movie posters and information.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
 <MovieProvider>
 <main className="flex-1">{children}</main>
 </MovieProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
