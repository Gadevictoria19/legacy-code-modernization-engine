import React, { useState } from 'react';
import { FolderGit2, Search, Plus, GitBranch, Clock, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

const initialRepos = [
  { id: 1, name: 'core-billing-sys', url: 'github.com/enterprise/core-billing-sys', language: 'Java', lastSync: '2 hours ago', status: 'synced', files: 1240 },
  { id: 2, name: 'hr-payroll-legacy', url: 'github.com/enterprise/hr-payroll-legacy', language: 'COBOL', lastSync: '1 day ago', status: 'syncing', files: 450 },
  { id: 3, name: 'inventory-tracker', url: 'github.com/enterprise/inventory-tracker', language: 'Java', lastSync: '3 days ago', status: 'error', files: 890 },
  { id: 4, name: 'crm-backend-v1', url: 'github.com/enterprise/crm-backend-v1', language: 'C++', lastSync: '1 week ago', status: 'synced', files: 2100 },
];

export function RepositoriesView() {
  const [repos, setRepos] = useState(initialRepos);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || repo.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLang === 'All' || repo.language === filterLang;
    return matchesSearch && matchesLang;
  });

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;
    
    setIsConnecting(true);
    setTimeout(() => {
      const newRepo = {
        id: Date.now(),
        name: newRepoUrl.split('/').pop() || 'new-repo',
        url: newRepoUrl.replace('https://', ''),
        language: 'Java', // Mock detection
        lastSync: 'Just now',
        status: 'syncing',
        files: Math.floor(Math.random() * 1000) + 100
      };
      setRepos([newRepo, ...repos]);
      setIsConnecting(false);
      setShowConnectModal(false);
      setNewRepoUrl('');
      
      // Simulate sync completion
      setTimeout(() => {
        setRepos(current => current.map(r => r.id === newRepo.id ? { ...r, status: 'synced' } : r));
      }, 3000);
    }, 1500);
  };

  const handleSync = (id: number) => {
    setRepos(repos.map(r => r.id === id ? { ...r, status: 'syncing' } : r));
    setTimeout(() => {
      setRepos(current => current.map(r => r.id === id ? { ...r, status: 'synced', lastSync: 'Just now' } : r));
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] transition-colors">
      <div className="h-16 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Repositories</h1>
          <p className="text-xs text-zinc-500">Manage connected legacy codebases for modernization.</p>
        </div>
        <button 
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Connect Repository
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search repositories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              {['All', 'Java', 'COBOL', 'C++'].map(lang => (
                <span 
                  key={lang}
                  onClick={() => setFilterLang(lang)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${filterLang === lang ? 'bg-white dark:bg-[#111111] border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-zinc-200 shadow-sm' : 'border border-transparent hover:bg-zinc-200 dark:hover:bg-white/5'}`}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredRepos.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No repositories found matching your criteria.</div>
            ) : (
              filteredRepos.map((repo) => (
                <div key={repo.id} className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-xl p-4 sm:p-5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors group">
                  <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-lg mt-1 transition-colors hidden sm:block">
                        <FolderGit2 className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-200 flex items-center gap-2 flex-wrap">
                          {repo.name}
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 uppercase tracking-wider transition-colors">
                            {repo.language}
                          </span>
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1.5 break-all">
                          <GitBranch className="w-3.5 h-3.5 shrink-0" />
                          {repo.url}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <FileCode2Icon className="w-3.5 h-3.5" />
                            {repo.files.toLocaleString()} files
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Last synced {repo.lastSync}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-3">
                      {repo.status === 'synced' && (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Synced
                        </div>
                      )}
                      {repo.status === 'syncing' && (
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Syncing...
                        </div>
                      )}
                      {repo.status === 'error' && (
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-500/20 transition-colors">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Sync Failed
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleSync(repo.id)}
                        disabled={repo.status === 'syncing'}
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors sm:mt-2 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {repo.status === 'error' ? 'Retry Sync \u2192' : 'Force Sync \u2192'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-zinc-900/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-colors">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Connect Repository</h2>
              <button onClick={() => setShowConnectModal(false)} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConnect}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Repository URL</label>
                <input 
                  type="text" 
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo" 
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isConnecting || !newRepoUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isConnecting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Connecting...</>
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FileCode2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m10 12.5-2 2 2 2" />
      <path d="m14 12.5 2 2-2 2" />
    </svg>
  );
}
