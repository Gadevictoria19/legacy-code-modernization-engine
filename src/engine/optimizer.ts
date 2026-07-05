/**
 * The Context Optimizer: Isolates the specific function and its dependencies.
 */
export function optimizeContext(
  targetFunctionCode: string, 
  dependencies: string[], 
  dataStructures: string[]
): string {
  let context = `// TARGET FUNCTION\n${targetFunctionCode}\n\n`;
  
  if (dependencies.length > 0) {
    context += `// DEPENDENCIES (1st-Degree)\n`;
    dependencies.forEach(dep => {
      context += `${dep}\n`;
    });
    context += `\n`;
  }
  
  if (dataStructures.length > 0) {
    context += `// DATA STRUCTURES\n`;
    dataStructures.forEach(ds => {
      context += `${ds}\n`;
    });
  }
  
  return context.trim();
}
