import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SiteFooter, SiteHeader } from './components/layout/SiteHeader'
import { useAuth } from './context/AuthContext'
import { HomePage } from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { CustomProductPage } from './pages/CustomProductPage'
import { CartPage } from './pages/CartPage'
import { ShopPage } from './pages/ShopPage'
import { ProductCategoryPage } from './pages/ProductCategoryPage'
import { InfoPage } from './pages/InfoPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminOrdersPage } from './pages/AdminOrdersPage'

function PublicLayout() {
  return <div className="page-shell"><SiteHeader /><Outlet /><SiteFooter /></div>
}

function AdminGuard() {
  const { loading, user, isAdmin, authorizationStatus } = useAuth()
  if (loading || authorizationStatus === 'checking') return <div className="screen-center">Checking access…</div>
  if (!user || !isAdmin || authorizationStatus !== 'authorized') return <Navigate to="/admin/login" replace />
  return <Outlet />
}

function AdminLayout() { return <div className="admin-shell"><Outlet /></div> }

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/magnets" element={<ProductCategoryPage type="magnet" />} />
      <Route path="/shop/badges" element={<ProductCategoryPage type="badge" />} />
      <Route path="/bulk-order" element={<InfoPage page="bulk-order" />} />
      <Route path="/about" element={<InfoPage page="about" />} />
      <Route path="/contact" element={<InfoPage page="contact" />} />
      <Route path="/products/:productId" element={<ProductDetailsPage />} />
      <Route path="/custom/:productType" element={<CustomProductPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Route>
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route element={<AdminGuard />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/products/add" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders/custom" element={<AdminOrdersPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
