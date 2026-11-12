import React from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const MobileNav = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar onCloseMobile={onClose} />
      </div>
    </div>
  );
};

