"use client";

import React from 'react';
import Header from './Header';
import SideNav from './SideNav';
import '@/styles/theme.css';
import '@/styles/motion.css';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspaceShellProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

import { usePathname } from 'next/navigation';

export const WorkspaceShell = ({ children }: WorkspaceShellProps) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-screen bg-bg-warm-white">
      <SideNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
