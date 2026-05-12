import { BasePlugin } from './BasePlugin';
import { getAncestorWithTag } from '../core/DOMUtils';

export class TextFormattingPlugin extends BasePlugin {
  readonly name = 'TextFormatting';
  private _unsubscribers: Array<() => void> = [];

  init(): void {
    this.registerCommand('bold', () => document.execCommand('bold'));
    this.registerCommand('italic', () => document.execCommand('italic'));
    this.registerCommand('underline', () => document.execCommand('underline'));
    this.registerCommand('strikethrough', () => document.execCommand('strikeThrough'));
    this.registerCommand('subscript', () => document.execCommand('subscript'));
    this.registerCommand('superscript', () => document.execCommand('superscript'));
    this.registerCommand('inlineCode', () => this._toggleInlineCode());
    this.registerCommand('clearFormat', () => {
      document.execCommand('removeFormat');
      document.execCommand('unlink');
    });

    const kb = (e: KeyboardEvent) => this._onKeyboard(e);
    document.addEventListener('keydown', kb);
    this._unsubscribers.push(() => document.removeEventListener('keydown', kb));
  }

  private _onKeyboard(e: KeyboardEvent): void {
    if (!this.editor.wrapperEl.contains(document.activeElement)) return;
    if (!e.ctrlKey && !e.metaKey) return;
    switch (e.key) {
      case 'b': e.preventDefault(); document.execCommand('bold'); break;
      case 'i': e.preventDefault(); document.execCommand('italic'); break;
      case 'u': e.preventDefault(); document.execCommand('underline'); break;
      case 'S':
        if (e.shiftKey) { e.preventDefault(); document.execCommand('strikeThrough'); }
        break;
    }
  }

  private _toggleInlineCode(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const existingCode = getAncestorWithTag(range.commonAncestorContainer, 'CODE');
    if (existingCode && existingCode.closest('pre') === null) {
      const parent = existingCode.parentNode!;
      while (existingCode.firstChild) parent.insertBefore(existingCode.firstChild, existingCode);
      parent.removeChild(existingCode);
      return;
    }
    const code = document.createElement('code');
    try {
      range.surroundContents(code);
    } catch {
      code.appendChild(range.extractContents());
      range.insertNode(code);
    }
  }

  destroy(): void {
    this._unsubscribers.forEach(fn => fn());
  }
}
