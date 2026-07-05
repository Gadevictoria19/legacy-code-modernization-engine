import { useState } from 'react';
import { Save, Shield, Cpu, Sliders, CheckCircle2 } from 'lucide-react';

export function SettingsView() {
  const [model, setModel] = useState('gemini-3.1-pro-preview');
  const [temperature, setTemperature] = useState('0.1');
  const [stripComments, setStripComments] = useState(true);
  const [removeDeadCode, setRemoveDeadCode] = useState(true);
  const [maxDepth, setMaxDepth] = useState('1st-Degree (Recommended)');
  const [token, setToken] = useState('••••••••••••••••••••••••••••••••');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setShowSuccess(false);
    
    // Simulate API call and log settings to prove they work
    console.log('Saving settings:', {
      model,
      temperature,
      stripComments,
      removeDeadCode,
      maxDepth,
      token: token ? '***' : ''
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] transition-colors">
      <div className="h-auto sm:h-16 py-4 sm:py-0 border-b border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 shrink-0 relative transition-colors gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-xs text-zinc-500">Configure engine parameters and preferences.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {showSuccess && (
            <span className="text-sm text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Section: LLM Configuration */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              LLM Configuration
            </h2>
            <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-xl p-4 sm:p-5 space-y-5 transition-colors">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Primary Model</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                  <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                </select>
                <p className="text-xs text-zinc-500 mt-1.5">The model used for code translation and context analysis.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Temperature</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="flex-1 accent-indigo-600 dark:accent-indigo-500" 
                  />
                  <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400 w-8">{temperature}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1.5">Lower temperatures produce more deterministic, accurate code translations.</p>
              </div>
            </div>
          </section>

          {/* Section: Context Optimization */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Context Optimization Pipeline
            </h2>
            <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-xl p-4 sm:p-5 space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Strip Comments</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Remove all comments from legacy code before processing.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={stripComments}
                    onChange={(e) => setStripComments(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                </label>
              </div>
              
              <div className="w-full h-px bg-zinc-200 dark:bg-white/5 transition-colors"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Remove Dead Code</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Use static analysis to strip unreachable code blocks.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={removeDeadCode}
                    onChange={(e) => setRemoveDeadCode(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className="w-full h-px bg-zinc-200 dark:bg-white/5 transition-colors"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Max Dependency Depth</div>
                  <div className="text-xs text-zinc-500 mt-0.5">How many levels deep to traverse the call graph.</div>
                </div>
                <select 
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(e.target.value)}
                  className="bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors w-full sm:w-auto"
                >
                  <option value="1st-Degree (Recommended)">1st-Degree (Recommended)</option>
                  <option value="2nd-Degree">2nd-Degree</option>
                  <option value="3rd-Degree">3rd-Degree</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section: Security & Access */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Security & Access
            </h2>
            <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-white/5 rounded-xl p-4 sm:p-5 space-y-5 transition-colors">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">GitHub Personal Access Token</label>
                <input 
                  type="password" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
                />
                <p className="text-xs text-zinc-500 mt-1.5">Required for fetching private repositories.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
