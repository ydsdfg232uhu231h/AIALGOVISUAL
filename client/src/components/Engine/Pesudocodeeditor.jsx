import { useState } from 'react';
import { Play, Code, Terminal, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Pesudocodeeditor.css';

const DIALECTS = {
  standard: {
    name: 'Standard / Academic',
    printKeyword: 'PRINT',
    example: `// Standard Pseudocode\nSET x = 5\nSET y = 10\nPRINT "Sum is: "\nPRINT x + y\n\nFOR i = 1 TO 3\n  PRINT "Loop count: "\n  PRINT i\nEND FOR`
  },
  ib: {
    name: 'IB Computer Science',
    printKeyword: 'OUTPUT',
    example: `// IB Style Pseudocode\nx = 10\ny = 20\nOUTPUT "Product: "\nOUTPUT x * y\n\nloop I from 1 to 3\n  OUTPUT I\nend loop`
  },
  pascal: {
    name: 'Pascal / Cambridge Style',
    printKeyword: 'WRITELN',
    example: `// Pascal Style Pseudocode\nx := 15;\ny := 3;\nWRITELN("Division: ");\nWRITELN(x / y);\n\nFOR i := 1 TO 3 DO\n  WRITELN(i);\nNEXT i;`
  }
};

const runPseudocode = (code, dialectKey) => {
  const dialect = DIALECTS[dialectKey];
  const logs = [];
  const env = {};
  const cleanCode = code.replace(/\/\/.*/g, '');

  const evaluateExpression = (exprStr) => {
    let substituted = exprStr;
    Object.keys(env).forEach(varName => {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      substituted = substituted.replace(regex, env[varName]);
    });

    try {
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${substituted})`)();
    } catch (e) {
        console.log(e.message)
      return exprStr.replace(/^"(.*)"$/, '$1');
    }
  };

  try {
    const rawLines = cleanCode.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let i = 0;

    while (i < rawLines.length) {
      let line = rawLines[i];
      if (line.endsWith(';')) line = line.slice(0, -1).trim();

      const isPrint = line.startsWith(dialect.printKeyword) || line.startsWith('PRINT') || line.startsWith('OUTPUT') || line.startsWith('WRITELN');

      if (isPrint) {
        let content = line.replace(/^(PRINT|OUTPUT|WRITELN)\b/i, '').trim();
        if (content.startsWith('(') && content.endsWith(')')) content = content.slice(1, -1).trim();
        logs.push(String(evaluateExpression(content)));
        i++;
        continue;
      }

      if (line.startsWith('SET ') || line.includes(':=') || line.includes('=')) {
        let cleanLine = line.replace(/^SET\s+/i, '');
        const op = cleanLine.includes(':=') ? ':=' : '=';
        const parts = cleanLine.split(op);

        if (parts.length === 2) {
          env[parts[0].trim()] = evaluateExpression(parts[1].trim());
          i++;
          continue;
        }
      }

      const forMatch = 
        line.match(/FOR\s+(\w+)\s*[:=]\s*(\d+)\s+TO\s+(\d+)/i) ||
        line.match(/FOR\s+(\w+)\s*=\s*(\d+)\s+TO\s+(\d+)/i) ||
        line.match(/LOOP\s+(\w+)\s+FROM\s+(\d+)\s+TO\s+(\d+)/i);

      if (forMatch) {
        const [ iterVar, start, end] = forMatch;
        let bodyLines = [];
        let j = i + 1;
        let depth = 1;

        while (j < rawLines.length && depth > 0) {
          const subLine = rawLines[j].toUpperCase();
          if (subLine.startsWith('FOR ') || subLine.startsWith('LOOP ')) depth++;
          if (subLine.includes('END FOR') || subLine.includes('END LOOP') || subLine.startsWith('NEXT')) {
            depth--;
            if (depth === 0) break;
          }
          bodyLines.push(rawLines[j]);
          j++;
        }

        for (let loopVal = parseInt(start, 10); loopVal <= parseInt(end, 10); loopVal++) {
          env[iterVar] = loopVal;
          bodyLines.forEach(stmt => {
            let inner = stmt.trim();
            if (inner.endsWith(';')) inner = inner.slice(0, -1).trim();
            if (inner.match(/^(PRINT|OUTPUT|WRITELN)\b/i)) {
              let cnt = inner.replace(/^(PRINT|OUTPUT|WRITELN)\b/i, '').trim();
              if (cnt.startsWith('(') && cnt.endsWith(')')) cnt = cnt.slice(1, -1).trim();
              logs.push(String(evaluateExpression(cnt)));
            }
          });
        }
        i = j + 1;
        continue;
      }
      i++;
    }
    return { status: 'success', output: logs };
  } catch (err) {
    return { status: 'error', output: [err.message] };
  }
};

export default function PseudocodeEditor() {
  const [dialect, setDialect] = useState('standard');
  const [code, setCode] = useState(DIALECTS.standard.example);
  const [output, setOutput] = useState([]);
  const [status, setStatus] = useState('idle');

  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  const handleRun = () => {
    setStatus('compiling');
    setTimeout(() => {
      const res = runPseudocode(code, dialect);
      setOutput(res.output);
      setStatus(res.status);
    }, 150);
  };

  return (
    <div className="ide-container">
      {/* Top Header */}
      <header className="ide-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Code size={20} />
          </div>
          <div>
            <h1 className="brand-title">Coddy Pseudocode Engine</h1>
            <p className="brand-subtitle">In-Browser Interpreter</p>
          </div>
        </div>

        <div className="controls-section">
          <div className="dialect-selector">
            <Layers size={16} />
            <span>Style:</span>
            <select
              value={dialect}
              onChange={(e) => {
                setDialect(e.target.value);
                setCode(DIALECTS[e.target.value].example);
                setOutput([]);
                setStatus('idle');
              }}
              className="dialect-dropdown"
            >
              {Object.entries(DIALECTS).map(([key, item]) => (
                <option key={key} value={key}>{item.name}</option>
              ))}
            </select>
          </div>

          <button onClick={handleRun} className="run-button">
            <Play size={16} fill="currentColor" />
            <span>Run Code</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="ide-workspace">
        {/* Editor Panel */}
        <div className="panel">
          <div className="panel-header">
            <span>INPUT PSEUDOCODE</span>
            <span>{DIALECTS[dialect].printKeyword} Engine</span>
          </div>

          <div className="editor-wrapper">
            <div className="line-numbers">
              {lineNumbers.map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="code-input"
            />
          </div>
        </div>

        {/* Console Panel */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color="#34d399" />
              <span>CONSOLE OUTPUT</span>
            </div>

            {status === 'success' && (
              <span className="status-badge success">
                <CheckCircle2 size={14} /> Executed
              </span>
            )}
            {status === 'error' && (
              <span className="status-badge error">
                <AlertCircle size={14} /> Error
              </span>
            )}
          </div>

          <div className="console-body">
            {status === 'idle' && (
              <p className="console-idle">Click "Run Code" to view compilation output...</p>
            )}

            {status === 'compiling' && (
              <p className="console-compiling">Interpreting pseudocode AST...</p>
            )}

            {status === 'error' && output.map((line, idx) => (
              <p key={idx} className="console-error">{line}</p>
            ))}

            {status === 'success' && (
              output.length > 0 ? (
                output.map((line, idx) => (
                  <div key={idx} className="console-line">
                    <span className="console-prompt">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <p className="console-idle">Program executed with no output statements.</p>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}