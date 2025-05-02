import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

import Layout from '@/components/Layout';
import { CartProvider } from '@/context/CartContext'; // 👈 Import it

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </Layout>
    </CartProvider>
  );
}
