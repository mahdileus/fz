import './globals.css';



export const metadata = {
  title: '6504878',
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