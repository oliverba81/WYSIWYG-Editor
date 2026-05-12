import { useState, useRef } from 'react';
import {
  WysiwygEditor,
  type WysiwygEditorHandle,
} from '../../src/react/WysiwygEditor';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [html, setHtml] = useState('<p>Hello from React!</p>');
  const [output, setOutput] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [tabActive, setTabActive] = useState(true);
  const editorRef = useRef<WysiwygEditorHandle>(null);

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif', background: theme === 'dark' ? '#111827' : '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ color: theme === 'dark' ? '#f9fafb' : '#111827', marginTop: 0 }}>WYSIWYG Editor — React Demo</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>Toggle Dark</button>
        <button type="button" onClick={() => { const h = editorRef.current?.getHTML(); if (h !== undefined) setOutput(h); }}>Get HTML</button>
        <button type="button" onClick={() => setHtml('<h1>Updated via controlled value</h1><p>This was set programmatically.</p>')}>
          Set Value
        </button>
        <button type="button" onClick={() => setDisabled(d => !d)}>{disabled ? 'Enable editor' : 'Disable editor'}</button>
        <button type="button" onClick={() => setTabActive(a => !a)}>{tabActive ? 'Simulate tab inactive' : 'Simulate tab active'}</button>
      </div>
      <WysiwygEditor
        ref={editorRef}
        value={html}
        onChange={(newHtml) => setHtml(newHtml)}
        theme={theme}
        placeholder="Start writing..."
        style={{ maxWidth: 900 }}
        disabled={disabled}
        focusTrigger={tabActive}
        onChangeDebounceMs={300}
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
