import { CartProvider } from './context/CartContext';
import './globals.css';

export const metadata = {
  title: {
    default: 'فیروزه جواهریان | آکادمی توسعه فردی و کوچینگ ثروت',
    template: '%s | فیروزه جواهریان'
  },
  description: 'آکادمی توسعه فردی فیروزه جواهریان، مرجع آموزش کوچینگ، ذهن ثروتمند و رشد شخصی برای دستیابی به موفقیت و آرامش پایدار.',
  keywords: [
    'توسعه فردی',
    'کوچینگ ثروت',
    'کوچینگ جذب ثروت',
    'کوچینگ ذهن ثروتمند',
    'فیروزه جواهریان',
    'رشد ذهنی',
    'موفقیت فردی',
    'دوره رشد فردی'
  ],
  metadataBase: new URL('https://firouzehjavaherian.com'),
  alternates: {
    canonical: 'https://firouzehjavaherian.com',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://firouzehjavaherian.com',
    siteName: 'فیروزه جواهریان',
    title: 'فیروزه جواهریان | آکادمی توسعه فردی و کوچینگ ثروت',
    description: 'آکادمی توسعه فردی فیروزه جواهریان، مرجع آموزش کوچینگ، ذهن ثروتمند و رشد شخصی برای دستیابی به موفقیت و آرامش پایدار.',
    images: [
      {
        url: 'https://firouzehjavaherian.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'فیروزه جواهریان - آکادمی توسعه فردی و کوچینگ ثروت',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فیروزه جواهریان | آکادمی توسعه فردی و کوچینگ ثروت',
    description: 'منبع آموزش توسعه فردی و کوچینگ ثروت برای زندگی آگاهانه و ذهن ثروتمند.',
    images: ['https://firouzehjavaherian.com/logo/fj-logo.png'],
    creator: '@firouzehjavaherian',
  },
  authors: [{ name: 'فیروزه جواهریان', url: 'https://firouzehjavaherian.com' }],
  creator: 'فیروزه جواهریان',
  publisher: 'آکادمی فیروزه جواهریان',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'کد_تأیید_گوگل_سرچ_کنسول_اینجا',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
