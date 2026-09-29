import React, { useState } from 'react';
import { ViewTab } from '../types/tool';
import { Wrench, Sparkles, FolderHeart, Info, Menu, X, PlusCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  savedToolsCount: number;
  onNewToolClick: () => void;
  onOpenAuditModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedToolsCount,
  onNewToolClick,
  onOpenAuditModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: ViewTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Wrench className="w-5 h-5 text-white transform -rotate-12 group-hover:rotate-0 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Tool<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Forge</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-700/60 text-indigo-300">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Instant Mini Web Tools</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => handleNav('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === 'home'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => handleNav('my-tools')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === 'my-tools'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            My Tools
            {savedToolsCount > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                currentTab === 'my-tools' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-indigo-400'
              }`}>
                {savedToolsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === 'about'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Info className="w-4 h-4" />
            About
          </button>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenAuditModal && (
            <button
              onClick={onOpenAuditModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/50 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
              title="Run Security & Compliance Audit"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security Audit</span>
            </button>
          )}

          <button
            onClick={() => {
              onNewToolClick();
              handleNav('home');
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-xl transition shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            New Tool
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenAuditModal && (
            <button
              onClick={onOpenAuditModal}
              className="p-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 rounded-lg text-xs font-medium flex items-center gap-1"
              title="Security Audit"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              onNewToolClick();
              handleNav('home');
            }}
            className="p-2 text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 rounded-lg text-xs font-medium flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'home'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 bg-slate-900/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Home & Tool Generator</span>
            </div>
            <span className="text-xs text-slate-400">Builder</span>
          </button>

          <button
            onClick={() => handleNav('my-tools')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'my-tools'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 bg-slate-900/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderHeart className="w-4 h-4 text-indigo-400" />
              <span>My Tools</span>
            </div>
            {savedToolsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-900 text-indigo-200">
                {savedToolsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'about'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 bg-slate-900/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>About & Safety Sandbox</span>
            </div>
            <span className="text-xs text-slate-400">Info</span>
          </button>

          {onOpenAuditModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuditModal();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-950/60 transition"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Run System & Security Audit</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Audit</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
