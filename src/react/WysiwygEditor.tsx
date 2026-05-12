'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { EditorOptions } from '../core/types';

if (typeof window !== 'undefined') {
  // Only load Editor and styles in browser context
}

export interface WysiwygEditorProps extends Omit<EditorOptions, 'container'> {
  value?: string;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const WysiwygEditor = forwardRef<unknown, WysiwygEditorProps>(
  function WysiwygEditor(props, ref) {
    if (typeof window === 'undefined') return null;

    return <WysiwygEditorInner {...props} forwardedRef={ref} />;
  }
);

WysiwygEditor.displayName = 'WysiwygEditor';

function WysiwygEditorInner({
  value,
  defaultValue,
  className,
  style,
  forwardedRef,
  ...options
}: WysiwygEditorProps & { forwardedRef: React.ForwardedRef<unknown> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<unknown>(null);
  const prevValueRef = useRef<string | undefined>(undefined);

  useImperativeHandle(forwardedRef, () => editorRef.current, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let EditorClass: (new (opts: EditorOptions) => unknown) | null = null;

    const init = async () => {
      const mod = await import('../index');
      EditorClass = mod.Editor as unknown as new (opts: EditorOptions) => unknown;

      const initialHTML = defaultValue ?? value ?? '';
      const editor = new EditorClass({
        ...options,
        container: containerRef.current!,
        initialHTML,
      });
      editorRef.current = editor;
      prevValueRef.current = initialHTML;
    };

    init();

    return () => {
      const e = editorRef.current as { destroy?: () => void } | null;
      e?.destroy?.();
      editorRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editorRef.current || value === undefined) return;
    const editor = editorRef.current as { getHTML: () => string; setHTML: (h: string) => void };
    if (value !== prevValueRef.current && value !== editor.getHTML()) {
      prevValueRef.current = value;
      editor.setHTML(value);
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    />
  );
}
