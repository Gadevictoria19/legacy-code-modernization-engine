import { useState } from 'react';
import { Database, FileCode, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export function DashboardView() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-zinc-50 dark:bg-[#0a0a0a] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">Project Overview</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Legacy Code Modernization Engine Status</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-zinc-500">Last updated: {lastUpdated}</span>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-zinc-500">Total Repos</span>
            </div>
            <div className="text-3xl font-semibold text-zinc-900 dark:text-white">12</div>
            <div className="text-xs text-zinc-500 mt-2">Active legacy codebases</div>
          </div>
          
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <FileCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-zinc-500">Files Processed</span>
            </div>
            <div className="text-3xl font-semibold text-zinc-900 dark:text-white">4,289</div>
            <div className="text-xs text-zinc-500 mt-2">AST parsed and mapped</div>
          </div>

          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl transition-colors sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-zinc-500">Modernized</span>
            </div>
            <div className="text-3xl font-semibold text-zinc-900 dark:text-white">156</div>
            <div className="text-xs text-zinc-500 mt-2">Functions successfully converted</div>
          </div>
        </div>

        <h2 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">Recent Activity</h2>
        <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden transition-colors">
          <div className="divide-y divide-zinc-200 dark:divide-white/5">
            {[
              { repo: 'core-billing-sys', action: 'AST Parsing Complete', time: '10 mins ago', status: 'success' },
              { repo: 'hr-payroll-legacy', action: 'Context Optimization Pipeline Running', time: '1 hour ago', status: 'processing' },
              { repo: 'inventory-tracker', action: 'Dead Code Stripping Failed', time: '3 hours ago', status: 'error' },
            ].map((activity, i) => (
              <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="mt-0.5 sm:mt-0">
                    {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />}
                    {activity.status === 'processing' && <div className="w-5 h-5 border-2 border-indigo-200 dark:border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />}
                    {activity.status === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />}
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{activity.repo}</div>
                    <div className="text-xs text-zinc-500">{activity.action}</div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 ml-9 sm:ml-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
