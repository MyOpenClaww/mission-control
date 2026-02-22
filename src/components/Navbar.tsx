'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/tools', label: 'Tools', icon: '🛠️' },
  { href: '/approvals', label: 'Approvals', icon: '✅' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/memory', label: 'Memory', icon: '🧠' },
  { href: '/docs', label: 'Docs', icon: '📄' },
  { href: '/tasks', label: 'Tasks', icon: '🎯' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <div className="navbar-logo">MC</div>
        <span className="navbar-title">Mission Control</span>
      </Link>
      
      <div className="navbar-links">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span style={{ marginLeft: '0.25rem' }}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="navbar-user">
        <div className="navbar-user-info">
          <div className="navbar-user-name">Erv</div>
          <div className="navbar-user-status">Online</div>
        </div>
        <div className="navbar-avatar">👤</div>
      </div>
    </nav>
  );
}
