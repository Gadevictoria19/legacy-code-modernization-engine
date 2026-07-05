import { useState } from 'react';
import { Code2, FolderGit2, Settings, LayoutDashboard, Cpu, Moon, Sun } from 'lucide-react';

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme 
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  theme: 'dark' | 'light',
  toggleTheme: () => void
}) {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ['Lead Engineer', 'Senior Developer', 'Project Manager', 'Admin'];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'repositories', label: 'Repositories', icon: FolderGit2 },
    { id: 'modernize', label: 'Modernization Engine', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-[#111111] border-r border-zinc-200 dark:border-white/5 h-screen flex flex-col shrink-0 transition-colors">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-white">LegacyMod</span>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-zinc-200 dark:border-white/5 transition-colors">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-xs font-medium transition-colors">
            V
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">Victoria</span>
            <button 
              onClick={() => setRoleIndex((prev) => (prev + 1) % roles.length)}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-left transition-colors"
            >
              {roles[roleIndex]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
