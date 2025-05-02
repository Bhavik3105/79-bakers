import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar'; // 👈 Add this import

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <CartSidebar /> {/* 👈 Add CartSidebar after Navbar */}
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
