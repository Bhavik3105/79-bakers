import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

import Layout from '@/components/Layout';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster position="top-right" />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}
