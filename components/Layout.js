import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar'; // 👈 Add this import

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartSidebar />
      {children}
      <Footer />
    </div>
  );
}
