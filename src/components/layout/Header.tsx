"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-glass shadow-sm">
      <motion.h1
        className="text-xl font-bold text-accent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        VoxAI Workspace
      </motion.h1>
      {/* Placeholder for user avatar / profile */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary-indigo" />
        <span className="text-sm">User</span>
      </div>
    </header>
  );
};

export default Header;
