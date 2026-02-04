import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Truck, Users ,LogOut, UserCog, History, FileText, ShoppingCart, ArrowDownToLine} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { ROLE_PERMISSIONS } from '../lib/rolePermissions';
import '../style/sidebar.css'


export default function SideBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const allMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
    { path: '/ProductsList', label: 'Inventory', icon: Package, permission: 'ProductsList' },
    { path: '/Suppliers', label: 'Suppliers', icon: Truck, permission: 'Suppliers' },
    { path: '/Clients', label: 'Clients', icon: Users, permission: 'Clients' },
    { path: '/Purchases', label: 'Purchases', icon: ArrowDownToLine, permission: 'Purchases' },
    { path: '/Sales', label: 'Sales', icon: ShoppingCart, permission: 'Sales' },
    { path: '/incoming-history', label: 'Incoming History', icon: History, permission: 'incoming-history' },
    { path: '/sales-history', label: 'Sales History', icon: FileText, permission: 'sales-history' },
    { path: '/user-management', label: 'User Management', icon: UserCog, permission: 'user-management' },
  ];

  // Filter menu items based on user role
  const userRole = user?.roles?.[0] || null;
  const allowedPermissions = ROLE_PERMISSIONS[userRole] || [];
  
  const menuItems = allMenuItems.filter(item => 
    allowedPermissions.includes(item.permission.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">

        <div className="sidebar-header">
            <h2>AutoParts ERP</h2>
            <p>Management System</p>
            {user && (
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#888' }}>
                Role: <strong>{userRole}</strong>
              </p>
            )}
        </div>
      
        
         <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item' }
            >
              <Icon size={18} className="nav-icon" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

        <div className="logout-section">
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontFamily: 'inherit'
                  }}
                  className="nav-item"
                >
                    <span className="nav-icon"> <LogOut /> </span> Logout
                </button>
        </div>

    </div>
  )
}
