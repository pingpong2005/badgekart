import { LogOut, ShoppingBag } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminHeader() {
  const { logout } = useAuth()
  return <header className="admin-header"><div className="container admin-header-inner">
    <Link className="brand" to="/admin" aria-label="Badgekart owner dashboard"><span className="brand-mark"><ShoppingBag size={20} /></span><span><strong>Badgekart</strong><small>Owner dashboard</small></span></Link>
    <nav className="admin-nav" aria-label="Owner navigation">
      <NavLink to="/admin" end>Home</NavLink>
      <NavLink to="/admin/products/add">Add products</NavLink>
      <NavLink to="/admin/products">Manage products</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>
      <NavLink to="/admin/orders/custom">Custom orders</NavLink>
      <button className="btn btn-quiet" type="button" onClick={() => void logout()}><LogOut size={17} /> Sign out</button>
    </nav>
  </div></header>
}
