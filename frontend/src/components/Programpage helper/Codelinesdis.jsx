import { useState, useRef } from 'react';
import CodeBlock from './CodeBlock';


export default function CodeEditor() {
  const [code, setCode] = useState(`// Type your code here...\nfunction test() {\n  return true;\n}`);
  
  // Create a reference to the display block to control its scroll
  const displayRef = useRef(null);

  // Sync the display container scroll positions with the textarea scroll positions
  const handleScroll = (e) => {
    if (displayRef.current) {
      displayRef.current.scrollTop = e.target.scrollTop;
      displayRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  return (
    <div className="editor-wrapper">
      {/* Pass the scroll reference down to the viewer */}
      <CodeBlock codeString={code} displayRef={displayRef} />

      {/* Attach scroll and change events to the input layer */}
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
