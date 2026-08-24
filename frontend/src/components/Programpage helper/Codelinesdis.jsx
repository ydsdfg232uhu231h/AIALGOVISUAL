import { useState, useRef } from 'react';
import CodeBlock from './CodeBlock';


export default function CodeEditor() {
  const [code, setCode] = useState(`// Type your code here...\nfunction test() {\n  return true;\n}`);

  const displayRef = useRef(null);

 
  const handleScroll = (e) => {
    if (displayRef.current) {
      displayRef.current.scrollTop = e.target.scrollTop;
      displayRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  return (
    <div className="editor-wrapper">
     
      <CodeBlock codeString={code} displayRef={displayRef} />
    
      <textarea
        className="code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onScroll={handleScroll}
        spellCheck="false"
      />
    </div>
  );
}
