import React, { useState } from 'react';
import {
  Scan,
  Cpu,
  History,
  BookOpen,
  Sparkles,
  Info,
  Menu,
  X,
  Activity,
  Award,
  Database
} from 'lucide-react';

export type ActiveTab = 'analyze' | 'technical' | 'history' | 'care' | 'recommendations' | 'about';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  historyCount: number;
  datasetItemCount?: number;
  datasetFolderName?: string;
  isDatasetGroundingActive?: boolean;
  onOpenDatasetModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  historyCount,
  datasetItemCount = 0,
  datasetFolderName,
  isDatasetGroundingActive = false,
  onOpenDatasetModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'analyze' as ActiveTab, label: 'Analyze', icon: Scan },
    { id: 'technical' as ActiveTab, label: 'Technical CV & Viva', icon: Cpu },
    { id: 'history' as ActiveTab, label: 'My History', icon: History, count: historyCount },
    { id: 'care' as ActiveTab, label: 'Care Guide', icon: BookOpen },
    { id: 'recommendations' as ActiveTab, label: 'Recommendations', icon: Sparkles },
    { id: 'about' as ActiveTab, label: 'About Project', icon: Info },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Academic Project Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect('analyze')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-900/30">
              <Scan className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-slate-100 font-mono">VASTRA</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wider">
                  B.Tech CV
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-tight">
                Smart Textile Recognition & Analysis
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {onOpenDatasetModal && (
              <button
                type="button"
                onClick={onOpenDatasetModal}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  isDatasetGroundingActive
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 shadow-xs'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                title={
                  isDatasetGroundingActive
                    ? `Ground-truth active with /${datasetFolderName || 'dataset'}/ (${datasetItemCount} items)`
                    : 'Upload data folder for enhanced accuracy'
                }
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Data Folder:</span>
                <span>{datasetItemCount > 0 ? `${datasetItemCount} Items` : 'Upload Data'}</span>
                {isDatasetGroundingActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>YOLOv8 + Gemini 3.8</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-indigo-300 border border-slate-700">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
          {onOpenDatasetModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDatasetModal();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Custom Data Folder</span>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {datasetItemCount > 0 ? `${datasetItemCount} Items` : 'Upload'}
              </span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>Course: PBCMT504 CV</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Edge Pipeline Active
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
