import { useState, useMemo } from 'react';
import { FileCode2, ChevronRight, Play, CheckCircle2, AlertTriangle, Zap, FileJson, Layers, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { stripComments } from '../engine/parser';
import { optimizeContext } from '../engine/optimizer';
import { generateGoCode } from '../engine/llm';

// Mock data
const mockFunctions = [
  { id: 'f1', name: 'calculateTaxes', file: 'TaxCalculator.java', status: 'ready' },
  { id: 'f2', name: 'processPayroll', file: 'PayrollManager.java', status: 'pending' },
  { id: 'f3', name: 'generateReport', file: 'ReportGenerator.java', status: 'pending' },
];

const mockData: Record<string, { raw: string, dependencies: string[], dataStructures: string[] }> = {
  f1: {
    raw: `// Deprecated: Do not use this method directly
// TODO: Refactor this in 2014
public double calculateTaxes(Employee emp, TaxBracket bracket) {
    // Old tax calculation logic
    double baseTax = emp.getSalary() * bracket.getRate();
    
    // Check for exemptions
    if (emp.hasExemptions()) {
        baseTax -= calculateExemptions(emp); // Dependency 1
    }
    
    // Add state tax
    baseTax += getStateTax(emp.getStateCode()); // Dependency 2
    
    return baseTax;
}`,
    dependencies: [
      "double calculateExemptions(Employee emp);",
      "double getStateTax(String stateCode);"
    ],
    dataStructures: [
      "class Employee {\n    double getSalary();\n    boolean hasExemptions();\n    String getStateCode();\n}",
      "class TaxBracket {\n    double getRate();\n}"
    ]
  },
  f2: {
    raw: `/* 
 * Processes payroll for a given department
 * Author: Bob (1998)
 */
public void processPayroll(Department dept) {
    List<Employee> emps = dept.getEmployees();
    for(int i=0; i<emps.size(); i++) {
        Employee e = emps.get(i);
        // System.out.println("Processing " + e.getName());
        double salary = e.getBaseSalary();
        double bonus = calculateBonus(e);
        double deductions = getDeductions(e);
        
        BankAPI.transfer(e.getAccount(), salary + bonus - deductions);
    }
}`,
    dependencies: [
      "double calculateBonus(Employee e);",
      "double getDeductions(Employee e);",
      "void BankAPI.transfer(Account acc, double amount);"
    ],
    dataStructures: [
      "class Department { List<Employee> getEmployees(); }",
      "class Employee { double getBaseSalary(); Account getAccount(); }"
    ]
  },
  f3: {
    raw: `// Generates the end of month report
public String generateReport(Date startDate, Date endDate) {
    // String buffer is faster than concatenation in Java 1.4
    StringBuffer sb = new StringBuffer();
    sb.append("REPORT\\n");
    
    List<Transaction> txns = DB.getTransactions(startDate, endDate);
    double total = 0;
    
    for(Transaction t : txns) {
        // if (t.isInvalid()) continue; // Removed in v2.1
        sb.append(t.getId()).append(": ").append(t.getAmount()).append("\\n");
        total += t.getAmount();
    }
    
    sb.append("TOTAL: ").append(total);
    return sb.toString();
}`,
    dependencies: [
      "List<Transaction> DB.getTransactions(Date start, Date end);"
    ],
    dataStructures: [
      "class Transaction { String getId(); double getAmount(); }"
    ]
  }
};

export function ModernizeView() {
  const [selectedFunc, setSelectedFunc] = useState(mockFunctions[0]);
  const [viewMode, setViewMode] = useState<'raw' | 'stripped' | 'context'>('context');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const currentData = mockData[selectedFunc.id];
  
  // Use the engine to process the code dynamically
  const processedCode = useMemo(() => {
    const stripped = stripComments(currentData.raw, 'java');
    const context = optimizeContext(stripped, currentData.dependencies, currentData.dataStructures);
    return {
      raw: currentData.raw,
      stripped,
      context
    };
  }, [currentData]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowResult(false);
    
    try {
      // Use the LLM integration engine (calls the /api/generate serverless function)
      const text = await generateGoCode(processedCode.context);
      setGeneratedCode(text);
    } catch (error) {
      console.error("Error generating code:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setGeneratedCode(`// Error generating code: ${message}`);
    } finally {
      setIsGenerating(false);
      setShowResult(true);
    }
  };

  const handleSelectFunc = (func: typeof mockFunctions[0]) => {
    setSelectedFunc(func);
    setShowResult(false);
    setIsGenerating(false);
    setGeneratedCode('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a] transition-colors">
      {/* Header */}
      <div className="h-16 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Context Optimization Pipeline</h1>
          <p className="text-xs text-zinc-500">Isolate dependencies and reduce LLM hallucinations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium border border-indigo-200 dark:border-indigo-500/20 transition-colors">
            <Zap className="w-3.5 h-3.5" />
            <span>Context Window: 800 / 128k tokens</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left Pane: Function List */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#0f0f0f] shrink-0 transition-colors h-64 lg:h-full">
          <div className="p-4 border-b border-zinc-200 dark:border-white/5 transition-colors">
            <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Target Functions</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mockFunctions.map((func) => (
              <button
                key={func.id}
                onClick={() => handleSelectFunc(func)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedFunc.id === func.id ? 'bg-zinc-100 dark:bg-white/10' : 'hover:bg-zinc-50 dark:hover:bg-white/5'
                }`}
              >
                <FileCode2 className={`w-4 h-4 mt-0.5 ${selectedFunc.id === func.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{func.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{func.file}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle Pane: Pipeline View */}
        <div className="w-full lg:flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-white/5 min-w-0 transition-colors h-[400px] lg:h-full">
          <div className="h-12 border-b border-zinc-200 dark:border-white/5 flex items-center px-4 gap-2 bg-zinc-50 dark:bg-[#111111] shrink-0 overflow-x-auto transition-colors">
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${viewMode === 'raw' ? 'bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              Raw Legacy Code
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
            <button
              onClick={() => setViewMode('stripped')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${viewMode === 'stripped' ? 'bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              Stripped Code
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
            <button
              onClick={() => setViewMode('context')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${viewMode === 'context' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Optimized Context
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-[#0a0a0a] transition-colors">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300 flex items-center gap-2">
                {viewMode === 'raw' && <><AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" /> Unoptimized Input (High Noise)</>}
                {viewMode === 'stripped' && <><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Noise Reduced (Comments & Dead Code Removed)</>}
                {viewMode === 'context' && <><FileJson className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Final LLM Prompt Context (Target + Dependencies)</>}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {viewMode === 'raw' && 'Contains comments, deprecated tags, and potentially dead code.'}
                {viewMode === 'stripped' && 'Cleaned code ready for AST parsing and dependency mapping.'}
                {viewMode === 'context' && 'Only the essential logic and signatures needed for accurate translation.'}
              </p>
            </div>
            
            <pre className="font-mono text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-300 bg-zinc-50 dark:bg-[#111111] p-4 rounded-xl border border-zinc-200 dark:border-white/5 overflow-x-auto transition-colors">
              <code>{processedCode[viewMode]}</code>
            </pre>
          </div>
        </div>

        {/* Right Pane: LLM Output */}
        <div className="w-full lg:w-[400px] flex flex-col bg-white dark:bg-[#0f0f0f] shrink-0 transition-colors h-[400px] lg:h-full">
          <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between shrink-0 transition-colors">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Modernization Output</h2>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isGenerating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isGenerating ? 'Translating...' : 'Generate Go Code'}
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto relative">
            <AnimatePresence mode="wait">
              {!showResult && !isGenerating && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-6 text-center"
                >
                  <Cpu className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Ready to translate.</p>
                  <p className="text-xs mt-2">The optimized context will be sent to the LLM to generate idiomatic Go code.</p>
                </motion.div>
              )}
              
              {isGenerating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 p-6 text-center"
                >
                  <div className="w-12 h-12 border-2 border-indigo-200 dark:border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-medium">Processing Context...</p>
                  <p className="text-xs text-indigo-600/60 dark:text-indigo-400/60 mt-2">Applying strict system prompt to avoid hallucinations.</p>
                </motion.div>
              )}

              {showResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">Translation Complete</span>
                  </div>
                  <pre className="flex-1 font-mono text-[13px] leading-relaxed text-emerald-900 dark:text-emerald-50 bg-emerald-50 dark:bg-[#0a0a0a] p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/20 overflow-x-auto transition-colors">
                    <code>{generatedCode}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
