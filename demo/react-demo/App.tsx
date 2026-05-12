import React, { useState, useRef } from 'react';
import { WysiwygEditor } from '../../src/react/WysiwygEditor';
import { createEditor } from '../../src/core/EditorFactory';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [html, setHtml] = useState('<p>Hello from React!</p>');
  const [output, setOutput] = useState('');
  const editorRef = useRef<ReturnType<typeof createEditor> | null>(null);

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif', background: theme === 'dark' ? '#111827' : '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ color: theme === 'dark' ? '#f9fafb' : '#111827', marginTop: 0 }}>WYSIWYG Editor — React Demo</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>Toggle Dark</button>
        <button onClick={() => { const e = editorRef.current; if (e) setOutput(e.getHTML()); }}>Get HTML</button>
        <button onClick={() => { const e = editorRef.current; if (e) setOutput(e.getMarkdown()); }}>Get Markdown</button>
        <button onClick={() => { const e = editorRef.current; if (e) setOutput(JSON.stringify(e.getJSON(), null, 2)); }}>Get JSON</button>
        <button onClick={() => setHtml('<h1>Updated via controlled value</h1><p>This was set programmatically.</p>')}>
          Set Value
        </button>
      </div>
      <WysiwygEditor
        ref={editorRef as React.Ref<unknown>}
        value={html}
        onChange={(newHtml) => setHtml(newHtml)}
        theme={theme}
        placeholder="Start writing..."
        style={{ maxWidth: 900 }}
      />
      {output && (
        <pre style={{
          marginTop: 16,
          background: theme === 'dark' ? '#1f2937' : 'white',
          color: theme === 'dark' ? '#f9fafb' : '#111',
          padding: 16,
          borderRadius: 8,
          fontSize: 12,
          maxHeight: 300,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          {output}
        </pre>
      )}
    </div>
  );
}
