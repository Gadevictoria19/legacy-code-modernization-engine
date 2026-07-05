import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ModernizeView } from './components/ModernizeView';
import { RepositoriesView } from './components/RepositoriesView';
import { SettingsView } from './components/SettingsView';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('modernize');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-200 font-sans overflow-hidden transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b border-zinc-200 dark:border-white/5 flex items-center px-4 shrink-0 bg-white dark:bg-[#111111] transition-colors">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-zinc-900 dark:text-white ml-2">LegacyMod</span>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'repositories' && <RepositoriesView />}
          {activeTab === 'modernize' && <ModernizeView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}


