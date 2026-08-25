'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  MapPin, 
  Layers, 
  Users,
  History,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Instagram,
  Megaphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roles, signOut } = useAuth();
  const { theme, changeTheme } = usePreferences();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Timetables', href: '/admin/timetables', icon: Calendar },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
    { name: 'Rooms', href: '/admin/rooms', icon: MapPin },
    { name: 'Classes / Sections', href: '/admin/classes', icon: Layers },
    { name: 'Professors', href: '/admin/professors', icon: Users },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Activity History', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-lg font-semibold text-text-primary tracking-tight">Flowtime Admin</span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-button transition-colors ${
                isActive
                  ? 'bg-accent-soft text-primary-accent'
                  : 'text-text-secondary hover:bg-background hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer (User Info & Sign Out) */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex flex-col gap-2">
          <div className="px-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                {user?.email}
              </p>
              <p className="text-[10px] text-text-secondary capitalize mt-0.5">
                {roles.join(', ')}
              </p>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                if (theme === 'light') changeTheme('dark');
                else if (theme === 'dark') changeTheme('system');
                else changeTheme('light');
              }}
              className="p-1.5 border border-border bg-surface hover:bg-background rounded-button text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer shrink-0"
              title={`Theme: ${theme} (Click to toggle)`}
            >
              {theme === 'light' && <Sun className="w-3.5 h-3.5" />}
              {theme === 'dark' && <Moon className="w-3.5 h-3.5" />}
              {theme === 'system' && <Monitor className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-2 py-2 text-sm font-medium text-danger hover:bg-danger-soft rounded-button transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
          
          <div className="pt-2 text-center text-[10px] text-text-secondary flex items-center justify-center gap-1 border-t border-border/40 mt-1">
            <span>Made with ❤️ by</span>
            <a
              href="https://instagram.com/rntxpurval"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline flex items-center gap-0.5 text-primary-accent"
            >
              <Instagram className="w-3 h-3" />
              Purval
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
