import './globals.css';



export const metadata = {
  title: 'فیروزه جواهریان',
  description: 'آکادمی توسعه فردی',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir='rtl'>
      <body>

        {children}

      </body>
    </html>
  );
}