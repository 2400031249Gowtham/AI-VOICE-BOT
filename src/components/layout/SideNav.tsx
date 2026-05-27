"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mainNav, bottomNav } from './Sidebar/nav-items';
import { Sparkles } from 'lucide-react';

const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col bg-surface-ivory border-r border-neutral-gray"
      style={{ width: collapsed ? 80 : 250, transition: 'width 0.3s ease' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-gray">
        {!collapsed && <span className="font-bold text-accent">VoxAI</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-neutral-gray text-accent">
          <Sparkles size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center p-2 rounded-lg hover:bg-primary-lavender hover-lift cursor-pointer text-accent group transition-colors">
                <Icon size={20} className="group-hover:text-primary-indigo" />
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-gray">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center p-2 rounded-lg hover:bg-primary-lavender hover-lift cursor-pointer text-accent group transition-colors">
                <Icon size={20} className="group-hover:text-primary-indigo" />
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default SideNav;
