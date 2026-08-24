

export default function CodeBlock({ codeString, displayRef }) {
  const lines = codeString.split('\n');

  return (
  
    <div className="code-container" ref={displayRef}>
      {lines.map((line, index) => (
        <div key={index} className="code-line">
          <span className="code-text">{line || ' '}</span>
          
        </div>
      ))}
    </div>
  );
}
