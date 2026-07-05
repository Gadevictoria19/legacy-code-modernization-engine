/**
 * The Parser: Strips comments from Java/COBOL files.
 */
export function stripComments(code: string, language: string): string {
  if (language.toLowerCase() === 'java' || language.toLowerCase() === 'c++') {
    // Remove single-line comments
    let stripped = code.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove empty lines
    return stripped.replace(/^\s*[\r\n]/gm, '').trim();
  } else if (language.toLowerCase() === 'cobol') {
    // COBOL comments usually have '*' in the 7th column (index 6)
    const lines = code.split('\n');
    const strippedLines = lines.filter(line => {
      if (line.length >= 7 && (line[6] === '*' || line[6] === '/')) {
        return false;
      }
      return true;
    });
    return strippedLines.join('\n').replace(/^\s*[\r\n]/gm, '').trim();
  }
  return code;
}
